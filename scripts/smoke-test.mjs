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

assert.doesNotMatch(home, /class="hs-toggle"/, "Hero must not render a pause control");
assert.doesNotMatch(home, /hd-calm/, "Hero must not contain the price comparison card");
assert.match(home, /id="price-check"/, "Price check should sit in its own homepage section");
assert.match(home, /id="how"/, "Homepage should explain the booking process");
assert.doesNotMatch(home, /id="compare"|id="business"|id="pay-later"/, "Comparison matrix, Business Travel and separate Pay Later sections should stay off the homepage");
assert.match(home, /trips\/business/, "Business Travel should remain accessible through the Trips navigation");
const homeOrder = ["id=\"how\"", "id=\"trips\"", "id=\"destinations\"", "id=\"price-check\"", "id=\"why\"", "id=\"reviews\"", "id=\"faq\"", "id=\"enquire\""];
assert.ok(homeOrder.every((marker, i) => i === 0 || home.indexOf(homeOrder[i - 1]) < home.indexOf(marker)), "Homepage sections must follow the agreed decision journey");
assert.ok(home.indexOf('id="how"') < home.indexOf('id="price-check"'), "Price Check must not interrupt the hero or opening explanation");
assert.match(css, /--section: 56px; --intro-content: 28px/, "Mobile spacing tokens must be explicitly defined");
assert.match(css, /--section: 72px; --intro-content: 36px/, "Tablet spacing tokens must be explicitly defined");
assert.match(css, /--section: 88px; --intro-content: 48px/, "Desktop spacing tokens must be explicitly defined");
assert.match(css, /mobile section rhythm and button sizing/, "Mobile CTA sizing rules must be present");
assert.equal((home.match(/class="rv-card rv"/g) || []).length, 2, "Homepage review section should show two text reviews on desktop");
assert.match(home, /class="pcard rv-photo rv"/, "Homepage review section should include the featured photo review");
assert.match(home, /aria-label="Explore honeymoons"/, "Trip card links should have descriptive accessible names");
assert.match(home, /saphara-logo-sand\.svg/, "Footer should use the sand logo on black");
assert.match(price, /id="pcForm"/, "Price Check form must be present");
assert.match(price, /Illustrative example/, "Price Check comparison must be labelled illustrative");
assert.match(price, /supplier allows a change/, "Price Check must qualify rebooking on supplier conditions");
assert.match(price, /Tap Send in WhatsApp to complete your price check/, "Price Check must explain the WhatsApp handoff");
assert.match(readFileSync("public/assets/price-check.js", "utf8"), /new URL\(rawLink\)/, "Price Check must validate optional hotel links");
assert.match(plan, /Your message is\s+ready\./, "Trip enquiry must not claim the enquiry was received");
assert.match(plan, /Tap Send in WhatsApp to complete your\s+enquiry/, "Trip enquiry must explain the final send step");
assert.doesNotMatch(plan, /You're checked in/, "Trip enquiry must not claim a request was received");
assert.match(css, /#trips \.trips, #destinations \.dests \{\s*display: grid/, "Mobile trip and destination cards must use a grid, not horizontal swipe tracks");
assert.match(css, /#trips \.trips \.pcard\.trip \.enq \{ display: none; \}/, "Mobile trip cards should keep one clear action");
assert.match(css, /min-width: 0; min-height: 0; scroll-snap-align: none/, "Mobile cards must not inherit oversized desktop minimum heights");
assert.doesNotMatch(css, /EDITORIAL PREVIEW/, "Obsolete preview CSS must not ship");
assert.match(css, /--footer-ink: #111111/, "Footer must use the black brand surface");
assert.match(css, /background: var\(--footer-ink\)/, "Footer must use the black brand surface");
assert.doesNotMatch(css, /#8A3B2E|#1E7A4C|#E7F3EB|#14563A|#BFE6CC|#b9874c|#5c4a22|#2B2925|#34312C|#E9DCC0|#CDBFA5/, "Rust, green and warm brown brand colours must not ship");
assert.match(css, /\.bento \.rv-stack \{ grid-column: 2; grid-row: 1; display: grid;/, "Desktop reviews must use a real two-column review grid");

console.log("Saphara smoke tests passed.");
