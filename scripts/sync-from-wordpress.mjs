// Usage: curl -sS https://opalsquare.in/ -o /tmp/home.html && node scripts/sync-from-wordpress.mjs /tmp/home.html .
// Mirrors every opalsquare.in asset into public/, rewrites URLs to local,
// and emits content/{head.json,body.html,scripts.json,attrs.json}.
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const [, , inFile, proj] = process.argv;
const pub = path.join(proj, "public");
const contentDir = path.join(proj, "content");
fs.mkdirSync(contentDir, { recursive: true });

let html = fs.readFileSync(inFile, "utf8");

// ---------- 1. collect asset URLs ----------
const assetRe = /https?:(?:\/|\\\/){2}opalsquare\.in(?:\/|\\\/)wp-(?:content|includes)[^"'\s)<>,]*/g;
const norm = (u) => u.replace(/\\\//g, "/").replace(/&amp;/g, "&");
const queue = new Set();
for (const m of html.matchAll(assetRe)) {
  const u = norm(m[0]);
  // skip directory-like config values (e.g. elementor assets base url)
  if (/\/$/.test(u.split("?")[0])) continue;
  queue.add(u.split("#")[0]);
}

const done = new Map(); // url -> ok
const failed = [];
const localPath = (u) => path.join(pub, decodeURIComponent(new URL(u).pathname));

async function fetchTo(u) {
  if (done.has(u)) return;
  done.set(u, false);
  const dest = localPath(u);
  if (!fs.existsSync(dest)) {
    const res = await fetch(u, { headers: { "user-agent": "Mozilla/5.0" } });
    if (!res.ok) { failed.push(`${res.status} ${u}`); return; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  }
  done.set(u, true);
  if (/\.css$/i.test(new URL(u).pathname)) {
    const css = fs.readFileSync(dest, "utf8");
    const refs = [...css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)|@import\s+['"]([^'"]+)['"]/g)]
      .map((m) => (m[1] || m[2]).trim())
      .filter((r) => r && !r.startsWith("data:") && !r.startsWith("#"));
    for (const r of refs) {
      const abs = new URL(r, u);
      if (abs.host !== "opalsquare.in") continue;
      abs.hash = "";
      await fetchTo(abs.toString());
    }
  }
}

const list = [...queue];
const POOL = 8;
await Promise.all(
  Array.from({ length: POOL }, async (_, i) => {
    for (let j = i; j < list.length; j += POOL) {
      try { await fetchTo(list[j]); } catch (e) { failed.push(`ERR ${list[j]} ${e.message}`); }
    }
  })
);

// ---------- 2. rewrite URLs ----------
html = html
  .replace(/https:\/\/opalsquare\.in\/wp-/g, "/wp-")
  .replace(/https:\\\/\\\/opalsquare\.in\\\/wp-/g, "\\/wp-")
  .replace(/href="https:\/\/opalsquare\.in\/"/g, 'href="/"');

// ---------- 3. split document ----------
const $ = cheerio.load(html);
const attrsOf = (el) => ({ ...el.attribs });

const head = [];
const scripts = [];
$("head")
  .children()
  .each((_, el) => {
    const tag = el.tagName;
    if (tag === "meta" || tag === "title") return; // handled by Next metadata
    if (tag === "script") {
      scripts.push({ attrs: attrsOf(el), code: $(el).html() || "" });
      return;
    }
    head.push({ tag, attrs: attrsOf(el), html: tag === "style" ? $(el).html() || "" : undefined });
  });

$("body script").each((_, el) => {
  scripts.push({ attrs: attrsOf(el), code: $(el).html() || "" });
  $(el).remove();
});

const wrapper = $("body > #pxl-wapper");
const out = {
  html: attrsOf($("html")[0]),
  body: attrsOf($("body")[0]),
  wrapper: attrsOf(wrapper[0]),
};

fs.writeFileSync(path.join(contentDir, "head.json"), JSON.stringify(head, null, 1));
fs.writeFileSync(path.join(contentDir, "scripts.json"), JSON.stringify(scripts, null, 1));
fs.writeFileSync(path.join(contentDir, "attrs.json"), JSON.stringify(out, null, 1));
fs.writeFileSync(path.join(contentDir, "body.html"), wrapper.html());

console.log(`assets ok: ${[...done.values()].filter(Boolean).length}, failed: ${failed.length}`);
failed.forEach((f) => console.log("  " + f));
console.log(`head els: ${head.length}, scripts: ${scripts.length}`);
