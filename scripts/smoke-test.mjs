import { readFileSync, existsSync } from "node:fs";
import { strict as assert } from "node:assert";

function page(path) {
  assert.ok(existsSync(path), `Missing built page: ${path}`);
  return readFileSync(path, "utf8");
}

const home = page("dist/index.html");
const price = page("dist/price-check.html");
const plan = page("dist/plan-my-trip.html");
const why = page("dist/why-saphara.html");
const css = page("dist/assets/site.css");

assert.doesNotMatch(home, /class="hs-toggle"/, "Hero must not render a pause control");
assert.doesNotMatch(home, /hd-calm/, "Hero must not contain the price comparison card");
assert.doesNotMatch(home, /id="price-check"|Before you book, let us check/, "Price Check should stay in the main navigation, not repeat on the homepage");
assert.doesNotMatch(home, /Illustrative example|pcx-verdict|pcx-grid/, "Homepage should not repeat the full comparison example");
assert.doesNotMatch(home, /id="compare"|id="business"|id="pay-later"/, "Comparison matrix, Business Travel and separate Pay Later sections should stay off the homepage");
assert.match(home, /trips\/business/, "Business Travel should remain accessible through the Trips navigation");
const homeOrder = ["id=\"proof\"", "id=\"trips\"", "id=\"destinations\"", "id=\"why\"", "id=\"more\"", "id=\"faq\"", "id=\"enquire\""];
assert.ok(homeOrder.every((marker, i) => i === 0 || home.indexOf(homeOrder[i - 1]) < home.indexOf(marker)), "Homepage sections must follow the agreed decision journey");
assert.doesNotMatch(home, /Hotels our clients have stayed with|From ‘Where to\?’|momentH|Somewhere worth the journey/, "Homepage should not contain the hotel-name strip, From Where To or editorial moment");
assert.match(home, /href="\/reviews"/, "Homepage should link to client reviews");
assert.match(home, /href="\/why-saphara"/, "Homepage should link to How we work");
assert.match(home, /href="\/guides\/?"/, "Homepage should link to travel guides");
assert.match(home, /id="faq"/, "FAQs should remain on the homepage");
assert.doesNotMatch(home.match(/<ul class="more-cards">[\s\S]*?<\/ul>/)?.[0] || "", /Common questions|faq\.html/, "More from Saphara should not duplicate the FAQ section");
assert.match(home, /class="pcard trip trip-featured on rv"/, "Hotel-only should be the first and pre-opened featured homepage trip");
const tripCards = [...home.matchAll(/<article class="pcard trip[\s\S]*?<\/article>/g)].map(m => m[0]);
assert.equal(tripCards.length, 5, "Homepage should show five trip types");
assert.ok(tripCards.every(card => (card.match(/class="split light"/g) || []).length === 1), "Each homepage trip card should have exactly one CTA");
assert.match(tripCards[0], /href="\/trips\/hotels"/, "Hotel-only must be the first featured trip card");
assert.match(home, /class="mm-trip-card"/, "Mobile Trips menu should use visual image cards");
assert.match(css, /\.dd-tile\.dd-featured \{ grid-column: span 2; grid-row: span 2;/, "Hotel-only should be the single featured Trips dropdown tile");
assert.match(css, /\.header \.desk-links > a\.nl[\s\S]*font-family: var\(--display\)/, "Desktop navigation should use the Kensington display font");
assert.match(css, /\.mm-trip-img/, "Mobile Trips menu should include image thumbnails");
assert.doesNotMatch(home.match(/<section class="band[\s\S]*?id="trips"[\s\S]*?<\/section>/)?.[0] || "", /trips\/business/, "Business Travel should not return as a homepage trip card");


assert.match(css, /--section: 56px; --intro-content: 28px/, "Mobile spacing tokens must be explicitly defined");
assert.match(css, /--section: 72px; --intro-content: 36px/, "Tablet spacing tokens must be explicitly defined");
assert.match(css, /--section: 88px; --intro-content: 48px/, "Desktop spacing tokens must be explicitly defined");
assert.match(css, /mobile section rhythm and button sizing/, "Mobile CTA sizing rules must be present");
assert.match(home, /href="\/trips\/honeymoons"/, "Trip card links should have descriptive accessible names");
assert.match(home, /saphara-logo-sand\.svg/, "Footer should use the sand logo on black");
assert.match(why, /Travel, with/, "Why Saphara page should lead with a clear customer proposition");
assert.match(why, /id="how"/, "Why Saphara page should explain the booking process");
assert.doesNotMatch(why, /pay-later/, "Why Saphara should not repeat the standalone Pay Later section");
assert.match(price, /id="pcForm"/, "Price Check form must be present");
assert.match(price, /Illustrative example/, "Price Check comparison must be labelled illustrative");
assert.match(price, /supplier allows a change/, "Price Check must qualify rebooking on supplier conditions");
assert.match(price, /Tap Send in WhatsApp to complete your price check/, "Price Check must explain the WhatsApp handoff");
assert.match(readFileSync("public/assets/price-check.js", "utf8"), /new URL\(rawLink\)/, "Price Check must validate optional hotel links");
assert.match(plan, /Your message is\s+ready\./, "Trip enquiry must not claim the enquiry was received");
assert.match(plan, /Tap Send in WhatsApp to complete your\s+enquiry/, "Trip enquiry must explain the final send step");
assert.doesNotMatch(plan, /You're checked in/, "Trip enquiry must not claim a request was received");
assert.match(css, /#trips \.trips, #destinations \.dests \{\s*display: grid/, "Mobile trip and destination cards must use a grid, not horizontal swipe tracks");
assert.match(css, /#trips \.trip h3,[\s\S]*?#trips \.trip-featured h3 \{\s*position: static;/, "Trip card headings, including the featured hotel-only card, should remain visible on mobile");
assert.match(css, /#trips \.trip \.actions > \.split \{\s*position: static;/, "Trip card CTAs should sit in the card content on mobile, not float in the corner");
assert.match(css, /#destinations \.dest:nth-child\(even\) \{ margin-top:/, "Destination cards should retain the staggered arch layout");
assert.match(css, /min-width: 0; min-height: 0; scroll-snap-align: none/, "Mobile cards must not inherit oversized desktop minimum heights");
assert.doesNotMatch(css, /EDITORIAL PREVIEW/, "Obsolete preview CSS must not ship");
assert.match(css, /--footer-ink: #111111/, "Footer must use the black brand surface");
assert.match(css, /background: var\(--footer-ink\)/, "Footer must use the black brand surface");
assert.doesNotMatch(css, /#8A3B2E|#1E7A4C|#E7F3EB|#14563A|#BFE6CC|#b9874c|#5c4a22|#2B2925|#34312C|#E9DCC0|#CDBFA5/, "Rust, green and warm brown brand colours must not ship");
assert.match(css, /\.bento \.rv-stack \{ grid-column: 2; grid-row: 1; display: grid;/, "Desktop reviews must use a real two-column review grid");

console.log("Saphara smoke tests passed.");
