// End-to-end checks for the Opal Square website. Run after `npm run build`:
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
    for (const path of ["/", "/projects", "/projects/sample-project-a", "/localities", "/services", "/about", "/contact", "/faqs", "/privacy-policy", "/terms"]) {
      const res = await page.goto(`${A}${path}`);
      const h1 = await page.locator("h1:visible").count();
      const title = await page.title();
      check(`page ${path}: 200, one h1, titled`, res.status() === 200 && h1 === 1 && title.includes("Opal Square"), `status=${res.status()} h1=${h1}`);
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
    for (const path of ["/", "/projects", "/projects/sample-project-b", "/contact"]) {
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

    // Home hero search submits to /projects with filters.
    await page.goto(`${A}/`);
    const hero = page.locator(".hero-search");
    await hero.getByLabel("Configuration").selectOption("2 BHK");
    await hero.getByRole("button", { name: "Search" }).click();
    await page.waitForURL("**/projects?**");
    const cards = page.locator(".browser .card");
    await page.waitForTimeout(300);
    check("home search → /projects?config=2 BHK shows 3 projects", page.url().includes("config=2+BHK") && (await cards.count()) === 3, `${await cards.count()}`);

    // Listing filters
    await page.goto(`${A}/projects`);
    const panel = page.locator("#filters-panel");
    check("listing: 6 projects", (await cards.count()) === 6);
    await panel.getByLabel("Locality").selectOption("Baner");
    check("listing: locality=Baner → 1, URL updated", (await cards.count()) === 1 && page.url().includes("locality=Baner"));
    await panel.getByRole("button", { name: "Clear all" }).click();
    await panel.getByRole("button", { name: "Villa", exact: true }).click();
    check("listing: type Villa → 1", (await cards.count()) === 1);
    await panel.getByRole("button", { name: "Clear all" }).click();
    await panel.getByRole("button", { name: "Ready to move", exact: true }).click();
    check("listing: status Ready to move → 2", (await cards.count()) === 2);
    await panel.getByRole("button", { name: "Clear all" }).click();
    await panel.getByLabel("Search").fill("kharadi");
    check("listing: search 'kharadi' → 1", (await cards.count()) === 1);
    await panel.getByLabel("Search").fill("zzz");
    check("listing: no match → empty state", await page.getByText("No projects match these filters.").isVisible());
    await panel.getByRole("button", { name: "Clear all" }).click();

    // Sort
    await page.getByLabel("Sort by").selectOption("price-asc");
    const firstAsc = await cards.first().locator(".card-title").innerText();
    await page.getByLabel("Sort by").selectOption("price-desc");
    const firstDesc = await cards.first().locator(".card-title").innerText();
    check("sort: price low→high starts with B (₹65 lakh), high→low with D (₹3.2 crore)", firstAsc === "Sample Project B" && firstDesc === "Sample Project D", `${firstAsc} / ${firstDesc}`);
    check("sort: kept in URL", page.url().includes("sort=price-desc"));

    // Shared link restores filters
    await page.goto(`${A}/projects?config=3+BHK`);
    await page.waitForTimeout(300);
    check("listing: shared link ?config=3 BHK → 2", (await cards.count()) === 2);

    // Locality tile → filtered listing
    await page.goto(`${A}/localities`);
    await page.locator(".loc-tile", { hasText: "Kothrud" }).click();
    await page.waitForURL("**/projects?**");
    await page.waitForTimeout(300);
    check("locality tile → listing filtered to Kothrud", (await cards.count()) === 1 && page.url().includes("locality=Kothrud"));

    // Card → project page
    await page.goto(`${A}/projects`);
    await page.getByRole("link", { name: /View Details for Sample Project A/ }).click();
    await page.waitForURL("**/projects/sample-project-a");
    check("card → project page", (await page.locator("h1:visible").innerText()) === "Sample Project A");
    await page.close();
  }

  // ---------- Project page ----------
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${A}/projects/sample-project-a`);
    check("project: facts bar shows price and carpet area", (await page.locator(".facts-bar").innerText()).includes("₹92 lakh") && (await page.locator(".facts-bar").innerText()).includes("680–960 sq ft"));
    check("project: configuration table", await page.getByRole("cell", { name: "960 sq ft" }).isVisible());
    check("project: RERA hidden while unverified", (await page.getByRole("heading", { name: "RERA registration" }).count()) === 0);
    await page.getByRole("button", { name: "Next photograph" }).click();
    check("project: gallery next → 2 of 2", await page.getByText("2 of 2").isVisible());
    await page.getByRole("radio", { name: "3 BHK" }).click();
    check("project: carpet-area drawing switches to 960 sq ft", await page.locator(".area-caption").getByText("960 sq ft").isVisible());
    check("project: enquiry form locked to this project", (await page.locator("#enquire input[name=property]").inputValue()) === "sample-project-a");
    const wa = await page.locator("#enquire a.btn-wa").getAttribute("href");
    check("project: WhatsApp message names the project", decodeURIComponent(wa ?? "").includes("Sample Project A"));
    check("project: similar projects listed", (await page.locator(".similar .card").count()) === 3);
    await page.close();
  }

  // ---------- Enquiry: no backend configured ----------
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${A}/contact?property=sample-project-c#enquire`);
    await page.waitForTimeout(300);
    const sel = page.locator("#enquire select[name=property]");
    check("contact: ?property= preselects the project", (await sel.inputValue()) === "sample-project-c");
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
    await page.goto(`${W}/projects/sample-project-e`);
    const pf = page.locator("#enquire");
    await pf.locator("input[name=name]").fill("Ravi Kumar");
    await pf.locator("input[name=phone]").fill("9123456780");
    const b2 = received.length;
    await pf.getByRole("button", { name: "Send request" }).click();
    await page.getByText("Request received").waitFor({ timeout: 5000 });
    check("enquiry from project page carries the project", received[b2]?.property.slug === "sample-project-e");

    // Backend failure → no success.
    await page.goto(`${W}/contact#enquire`);
    await form.locator("input[name=name]").fill("Fail Case");
    await form.locator("input[name=phone]").fill("9123456789");
    await form.locator("select[name=property]").selectOption("sample-project-b");
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
