import { readFileSync, existsSync } from "node:fs";
import { strict as assert } from "node:assert";

function page(path) {
  assert.ok(existsSync(path), `Missing built page: ${path}`);
  return readFileSync(path, "utf8");
}

const home = page("dist/index.html");
const price = page("dist/price-check.html");
const plan = page("dist/plan-my-trip.html");
const css = page("dist/assets/site.css");

assert.match(home, /class="hs-toggle"/, "Homepage must render the hero pause control");
assert.match(home, /Still deciding\?/, "Homepage secondary navigation should render");
assert.match(price, /id="pcForm"/, "Price Check form must be present");
assert.match(price, /Tap Send in WhatsApp to complete your price check/, "Price Check must explain the WhatsApp handoff");
assert.match(readFileSync("public/assets/price-check.js", "utf8"), /new URL\(rawLink\)/, "Price Check must validate optional hotel links");
assert.match(plan, /Your message is ready\./, "Trip enquiry must not claim the enquiry was received");
assert.match(plan, /Tap Send in WhatsApp to complete your enquiry/, "Trip enquiry must explain the final send step");
assert.doesNotMatch(css, /EDITORIAL PREVIEW/, "Obsolete preview CSS must not ship");
assert.match(css, /--footer-rust: #8A3B2E/, "Footer rust colour token must be present");
assert.match(css, /background: var\(--footer-rust\)/, "Footer must use the dedicated rust token");

console.log("Saphara smoke tests passed.");
