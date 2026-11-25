// End-to-end checks for the Opal Square Properties website. Run after `npm run build`:
//   npm run test:e2e
// Uses your installed Google Chrome (playwright-core, no browser download).
// Starts two production servers: one with no enquiry backend, one pointed at a
// local mock webhook, so every enquiry outcome is exercised.
import { spawn } from "node:child_process";
import http from "node:http";
import { chromium } from "playwright-core";

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

// ---- mock webhook: accepts everything except names containing "Fail" ----
const received = [];
const mock = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    const data = JSON.parse(body || "{}");
    received.push(data);
    res.statusCode = /Fail/.test(data.name) ? 500 : 200;
    res.end("{}");
  });
});
await new Promise((r) => mock.listen(0, r));
const mockUrl = `http://127.0.0.1:${mock.address().port}/hook`;

const startServer = (port, env) =>
  spawn("npx", ["next", "start", "-p", String(port)], { env: { ...process.env, ...env }, stdio: "ignore" });

async function waitFor(url) {
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`server did not start: ${url}`);
}

const PLAIN = 3141;
const WIRED = 3142;
const s1 = startServer(PLAIN, { ENQUIRY_WEBHOOK_URL: "" });
const s2 = startServer(WIRED, { ENQUIRY_WEBHOOK_URL: mockUrl });
const browser = await chromium.launch({ channel: "chrome" });
const A = `http://localhost:${PLAIN}`;
const W = `http://localhost:${WIRED}`;

try {
  await Promise.all([waitFor(`${A}/`), waitFor(`${W}/`)]);

  // ---------- Every page renders, has a title and one h1 ----------
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    // Figures the data pack marks as unconfirmed or conflicting must never be published.
    const HIDDEN = [/1\.12\s*(cr|crore)/i, /11200000/, /₹\s?40\s*lakh/i, /6,?500\s*sq/i, /1,?723/, /5,?999/, /2,?350/, /2,?950/, /4\.5\s*\/\s*5|29 reviews/i, /82\.47|5\.45 lakh|1\.63 crore/i];
    for (const path of ["/", "/projects", "/projects/sunwest-homes-sector-107-noida", "/projects/cyberthum", "/projects/eon", "/localities", "/services", "/about", "/contact", "/faqs", "/privacy-policy", "/terms"]) {
      const res = await page.goto(`${A}${path}`);
      const h1 = await page.locator("h1:visible").count();
      const title = await page.title();
      check(`page ${path}: 200, one h1, titled`, res.status() === 200 && h1 === 1 && title.includes("Opal Square"), `status=${res.status()} h1=${h1}`);
      const text = await page.locator("body").innerText();
      const leaked = HIDDEN.filter((re) => re.test(text)).map(String);
      check(`page ${path}: no unconfirmed figures shown`, leaked.length === 0, leaked.join(" "));
      const broken = await page.$$eval("img", (els) => els.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
      check(`page ${path}: all images load`, broken.length === 0, broken.join(", "));
    }
    const res404 = await page.goto(`${A}/this-does-not-exist`);
    check("unknown URL → branded 404", res404.status() === 404 && (await page.getByText("We couldn't find that page").isVisible()));
    // Browsers get a streamed response (status 200 + noindex); crawlers get a hard 404.
    await page.goto(`${A}/projects/not-a-project`);
    const noindex = await page.locator('meta[name="robots"][content*="noindex"]').count();
    const bot = await fetch(`${A}/projects/not-a-project`, { headers: { "user-agent": "Googlebot" } });
    check("unknown project → not-found page, noindex, 404 for crawlers",
      (await page.getByText("We couldn't find that page").isVisible()) && noindex > 0 && bot.status === 404, `bot=${bot.status}`);
    await page.close();
  }

  // ---------- Mobile: layout, menu navigation, WhatsApp ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    for (const path of ["/", "/projects", "/projects/sunwest-homes-sector-107-noida", "/contact"]) {
      await page.goto(`${A}${path}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      check(`mobile ${path}: no horizontal overflow`, overflow <= 0, `${overflow}px`);
    }
    await page.goto(`${A}/`);
    check("mobile: nav collapsed behind menu button", await page.locator("#site-nav").isHidden());
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#site-nav").getByRole("link", { name: "About Us" }).click();
    await page.waitForURL("**/about");
    check("mobile: menu link navigates to About and menu closes", (await page.locator("#site-nav").isHidden()) && page.url().endsWith("/about"));
    const wa = await page.locator(".wa-float").getAttribute("href");
    check("WhatsApp floating button → wa.me/917010101295", (wa ?? "").startsWith("https://wa.me/917010101295?text="));
    const small = await page.$$eval("a.btn, button", (els) =>
      els.filter((e) => e.offsetParent && e.getBoundingClientRect().height < 40).map((e) => e.textContent.trim() || e.getAttribute("aria-label")),
    );
    check("mobile: buttons are touch-sized", small.length === 0, small.join(", "));
    await ctx.close();
  }

  // ---------- Desktop: navigation, home search, listing filters + sort ----------
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${A}/`);
    for (const [label, path] of [["Projects", "/projects"], ["Localities", "/localities"], ["Services", "/services"], ["About Us", "/about"], ["Contact", "/contact"]]) {
      await page.locator("#site-nav").getByRole("link", { name: label, exact: true }).click();
      await page.waitForURL(`**${path}`);
      const current = await page.locator("#site-nav").getByRole("link", { name: label, exact: true }).getAttribute("aria-current");
      check(`nav "${label}" → ${path}, marked current`, page.url().endsWith(path) && current === "page");
    }

    // Home quick links (search and filters appear automatically at 5+ projects).
    await page.goto(`${A}/`);
    check("home: shows 1 property for sale and 2 highlighted projects",
      (await page.locator("#listing-title").count()) === 1 && (await page.locator(".showcase").nth(0).locator(".card").count()) === 1 && (await page.locator(".showcase").nth(1).locator(".card").count()) === 2);
    await page.locator(".hero-quick").getByRole("link", { name: /property for sale/ }).click();
    await page.waitForURL("**/projects");
    check("home quick link → /projects", page.url().endsWith("/projects"));

    // Listing: grouped, no filter sidebar for a small inventory.
    check("listing: grouped into for-sale (1) and highlighted (2), no filter panel",
      (await page.locator("#for-sale .card").count()) === 1 && (await page.locator("#highlighted .card").count()) === 2 && (await page.locator("#filters-panel").count()) === 0);

    // Areas we serve → WhatsApp with the area in the message.
    await page.goto(`${A}/localities`);
    const areaHref = await page.locator(".area-card", { hasText: "Noida Extension" }).locator("a").getAttribute("href");
    check("area card → WhatsApp message names the area", decodeURIComponent(areaHref ?? "").includes("Noida Extension") && (areaHref ?? "").startsWith("https://wa.me/917010101295"));

    // Contact and About show the office.
    await page.goto(`${A}/contact`);
    check("contact: office address, contact person and directions", (await page.getByText("Sector 70, Noida, Uttar Pradesh 201301").first().isVisible()) && (await page.getByText("Anmol Sharma").isVisible()) && (await page.getByRole("link", { name: "Get directions" }).first().getAttribute("href"))?.includes("28.5974,77.3827"));

    // Card → project page
    await page.goto(`${A}/projects`);
    await page.getByRole("link", { name: /View Details for Sunwest Homes/ }).click();
    await page.waitForURL("**/projects/sunwest-homes-sector-107-noida");
    check("card → listing page", (await page.locator("h1:visible").innerText()) === "3 BHK Builder Floor at Sunwest Homes");
    await page.close();
  }

  // ---------- Listing page ----------
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${A}/projects/sunwest-homes-sector-107-noida`);
    const facts = await page.locator(".facts-bar").innerText();
    check("listing: price and area shown as on request", facts.includes("Price on request") && facts.includes("On request") && !facts.includes("₹"));
    check("listing: pending-confirmation note", await page.getByText("Price, area and availability are being confirmed.").first().isVisible());
    check("listing: property details (facing, floor, furnishing)", (await page.locator(".spec-grid").innerText()).includes("Northwest") && (await page.locator(".spec-grid").innerText()).includes("1st of 6"));
    check("listing: amenities, features and nearby", (await page.getByText("Rooftop green terrace").isVisible()) && (await page.getByText("Aqua Line Metro").isVisible()) && (await page.getByText("24/7 security").isVisible()));
    check("listing: no carpet-area drawing without a confirmed area", (await page.locator(".area").count()) === 0);
    check("listing: RERA hidden while unverified", (await page.getByRole("heading", { name: "RERA registration" }).count()) === 0);
    check("listing: gallery shows the confirmed photo only", (await page.locator(".pgallery-main img").getAttribute("src"))?.includes("photo-1") && (await page.locator(".pgallery-thumbs").count()) === 0);
    check("listing: enquiry form locked to this listing", (await page.locator("#enquire input[name=property]").inputValue()) === "sunwest-homes-sector-107-noida");
    const wa = await page.locator("#enquire a.btn-wa").getAttribute("href");
    check("listing: WhatsApp message names the property", decodeURIComponent(wa ?? "").includes("Sunwest Homes"));
    check("listing: other projects suggested", (await page.locator(".similar .card").count()) === 2);
    await page.goto(`${A}/projects/eon`);
    check("highlighted project page: no price, no configuration table", (await page.locator(".config-table").count()) === 0 && (await page.locator(".facts-bar").innerText()).includes("Price on request"));
    await page.close();
  }

  // ---------- Enquiry: no backend configured ----------
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${A}/contact?property=cyberthum#enquire`);
    await page.waitForTimeout(300);
    const sel = page.locator("#enquire select[name=property]");
    check("contact: ?property= preselects the project", (await sel.inputValue()) === "cyberthum");
    await page.locator("#enquire input[name=name]").fill("Test Buyer");
    await page.locator("#enquire input[name=phone]").fill("98765 43210");
    await page.getByRole("button", { name: "Send request" }).click();
    await page.getByText("Your request was not sent.").waitFor({ timeout: 5000 });
    check("enquiry: no backend → 'not sent', points to WhatsApp, no success", (await page.getByText("Request received").count()) === 0 && (await page.locator(".form-status-warn a").getAttribute("href"))?.startsWith("https://wa.me/917010101295"));
    await page.close();
  }

  // ---------- Enquiry against a configured backend ----------
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(`${W}/contact#enquire`);
    const form = page.locator("#enquire");
    await form.getByRole("button", { name: "Send request" }).click();
    check("enquiry: empty submit shows field errors", (await page.getByText("Enter your name.").isVisible()) && (await page.getByText("Enter your mobile number.").isVisible()));
    await form.locator("input[name=name]").fill("Asha Rao");
    await form.locator("input[name=phone]").fill("12345");
    await form.locator("select[name=property]").selectOption("not-sure");
    await form.getByRole("button", { name: "Send request" }).click();
    check("enquiry: invalid phone rejected", await page.getByText("Enter a 10-digit Indian mobile number.").isVisible());
    await form.locator("input[name=phone]").fill("+91 98765 43210");
    check("enquiry: date min set to today", /^\d{4}-\d{2}-\d{2}$/.test((await form.locator("input[name=preferredDate]").getAttribute("min")) ?? ""));
    await form.locator("input[name=preferredDate]").fill("2099-01-15");
    const before = received.length;
    await form.getByRole("button", { name: "Send request" }).click();
    await page.getByText("Request received").waitFor({ timeout: 5000 });
    const sent = received[before];
    check("enquiry: success only after backend accepted", !!sent && sent.phone === "+919876543210" && sent.property.slug === "not-sure" && sent.preferredDate === "2099-01-15");

    // From a project page: the project is sent.
    await page.goto(`${W}/projects/eon`);
    const pf = page.locator("#enquire");
    await pf.locator("input[name=name]").fill("Ravi Kumar");
    await pf.locator("input[name=phone]").fill("9123456780");
    const b2 = received.length;
    await pf.getByRole("button", { name: "Send request" }).click();
    await page.getByText("Request received").waitFor({ timeout: 5000 });
    check("enquiry from project page carries the project", received[b2]?.property.slug === "eon");

    // Backend failure → no success.
    await page.goto(`${W}/contact#enquire`);
    await form.locator("input[name=name]").fill("Fail Case");
    await form.locator("input[name=phone]").fill("9123456789");
    await form.locator("select[name=property]").selectOption("sunwest-homes-sector-107-noida");
    await form.getByRole("button", { name: "Send request" }).click();
    await page.getByText("Your request was not sent.").waitFor({ timeout: 5000 });
    check("enquiry: backend error → 'not sent', no success", (await page.getByText("Request received").count()) === 0);

    const api = await fetch(`${W}/api/enquiry`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "X", phone: "1", property: "does-not-exist", preferredDate: "2000-01-01" }),
    });
    const j = await api.json();
    check("api: server validates every field", api.status === 422 && j.errors.name && j.errors.phone && j.errors.property && j.errors.preferredDate);
    await ctx.close();
  }
} finally {
  await browser.close();
  s1.kill();
  s2.kill();
  mock.close();
}

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
