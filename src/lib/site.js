import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join as joinPath } from "node:path";
// Shared building blocks for every page. Ported one-for-one from tools/site_lib.py and tools/build_site.py
// so the Astro build outputs the same markup as the prototype. Content lives in src/data/content.json.
import C from "../data/content.json";
import ICONS from "../data/icons.json";
import IMGS from "../data/img-sizes.json";

export const PROTOTYPE = false; // true keeps every page out of search engines; false is the live build (set 14 Nov 2026 for launch)
export const WA_BASE = "https://wa.me/447887353457";
// WhatsApp openers (16 Nov 2026, Huzaifa): every plain WhatsApp button opens one short, natural line that fits the page,
// (21 Nov 2026: the page and button tag was removed at Huzaifa's request; the forms keep their own filled-in message and STG ref).
// In the markup a button links to waMark("spot"); waLinks() in Base.astro swaps it for the real link once the page is known.
export const waMark = (spot) => WA_BASE + "?wa=" + spot;
const WA_TRIP = { honeymoons: "a honeymoon", "beach-and-island": "a beach or island holiday", "family-holidays": "a family holiday", "multi-city": "a multi-city trip", hotels: "a hotel stay" };
export function waOpener(path, spot) {
  const [sect, slug] = path.replace(/\.html$/, "").split("/");
  const dest = sect === "destinations" && C.DESTS.find((d) => d.slug === slug);
  const guide = sect === "guides" && C.GUIDES.find((g) => g.slug === slug);
  if (spot === "help") return "Salaams, I have a question about my booking.";
  if (spot === "faq") return "Salaams, I have a question.";
  if (spot === "business" || (sect === "trips" && slug === "business")) return "Salaams, I'd like to talk to you about business travel.";
  if (spot === "guide" && guide) return `Salaams, please send me the ${guide.name} guide.`;
  if (sect === "trips" && WA_TRIP[slug]) return `Salaams, I'm interested in ${WA_TRIP[slug]}. Could you help?`;
  if (dest && slug === "makkah-and-madinah") return "Salaams, I'd like some help with Umrah hotels in Makkah and Madinah.";
  if (dest) return `Salaams, I'm interested in a trip to ${dest.name}. Could you help?`;
  if (guide) return `Salaams, I've been reading your ${guide.name} guide and I'd like some help planning a trip.`;
  if (path === "faq.html") return "Salaams, I have a question.";
  if (path === "price-check.html") return "Salaams, could you do a price check on a hotel I've found?";
  return "Salaams, I'm planning a trip and would like some help.";
}
// 21 Nov 2026 (Huzaifa): the page and button tag after the message was removed; the opener itself says what the chat is about
export const waHref = (path, spot) => WA_BASE + "?text=" + encodeURIComponent(waOpener(path, spot));
export const waLinks = (html, path) => html.replace(/https:\/\/wa\.me\/447887353457\?wa=([a-z0-9-]+)/g, (m, spot) => waHref(path, spot).replace(/&/g, "&amp;"));
export const WA = waMark("link"); // fallback spot; most buttons pass their own
export const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
export const TICK = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
export const PLUS = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
export const IG = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';
const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';

export const ico = (n) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[n] || ""}</svg>`;
export const waGlyph = (cls = "wai") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${C.WA_PATH}</svg>`;
export const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

/** A page knows its own path so it can make relative links (the site works from files and any folder). */
export class Page {
  constructor(path) { this.path = path; this.depth = (path.match(/\//g) || []).length; }
  u(target) {
    if (/^(http|mailto:|#)/.test(target)) return target;
    // The host serves 404.html for any missing address (for example /a/b/c), so relative links would break there: use root links.
    if (this.path === "404.html") return "/" + target;
    const pre = "../".repeat(this.depth);
    return target ? pre + target : (pre ? pre + "index.html" : "index.html");
  }
  img(name) { return this.u("img/" + name); }
}

export const split = (label, href, light = false, plan = false) =>
  `<a class="split${light ? " light" : ""}" href="${href}"${plan ? " data-plan" : ""}><span class="split-label">${label}</span><span class="split-arrow">${ARROW}</span></a>`;

// Share button for guide heroes (14 Nov, Huzaifa): the phone share sheet, or copies the link where that is missing.
const SHARE_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';
export const shareBtn = (label = "Share this guide") =>
  `<button class="split" type="button" data-share><span class="split-label">${label}</span><span class="split-arrow">${SHARE_ICON}</span></button>`;

export const planLink = (pg) => (pg.path === "plan-my-trip.html" ? "#enquire" : pg.u("plan-my-trip.html")); // the form lives only on Plan my trip (slim homepage, 15 Nov)

// Phone menu trips (22 Nov 2026 evening, Huzaifa): a row per trip with a small rounded thumbnail, the name and its pun line.
const mmTrip = (href, img, name, line) => `<a class="mm-trip-card" href="${href}"><span class="mm-trip-img"><img src="${img}" alt="" width="400" height="300" loading="lazy" decoding="async"></span><span class="mm-trip-copy"><b>${name}</b><small>${line}</small></span></a>`;

export function header(pg) {
  // 22 Nov 2026 (late night, Huzaifa): Trips dropdown is option B: "Holidays" and "Just the hotel" lists with small photos, the free price check card on the right, centred under the menu.
  const THUMB = { honeymoons: "r/st-reviews-maldives-400.webp", "multi-city": "r/st-howwework-kl-400.webp" };
  const thumbOf = (s, img) => THUMB[s] || "thumb-" + img;
  const row = (href, img, name, line, warm) => `\n            <a class="ddb-row" href="${href}"><span class="ph"><img data-src="${pg.img(img)}" alt="" width="400" height="300" decoding="async"${warm ? ' class="warm"' : ""}></span><span class="ddb-tx"><b>${name}</b><span>${line}</span></span></a>`;
  const T = Object.fromEntries(C.TRIPS.map((t) => [t[0], t]));
  const tripRow = (s) => { const [, n, img, [a, b]] = T[s]; return row(pg.u("trips/" + s + ".html"), thumbOf(s, img), n, a + " " + b, s === "business"); };
  const extraRows = (C.MENU_EXTRA || []).map((m) => row(pg.u(m.href), m.thumb, m.name, m.lines[0] + " " + m.lines[1], false)).join("");
  const holidays = ["honeymoons", "beach-and-island", "family-holidays", "multi-city"].filter((s) => T[s]).map(tripRow).join("");
  const hotelish = ["hotels"].filter((s) => T[s]).map(tripRow).join("") + extraRows + ["business"].filter((s) => T[s]).map(tripRow).join("");
  const ddPanel = `<div class="dd-panel ddb" id="tripsMenu" role="region" aria-label="Trips">
          <div class="ddb-col"><p class="dd-k">Holidays</p>${holidays}
          </div>
          <div class="ddb-col"><p class="dd-k">Just the hotel</p>${hotelish}
          </div>
          <a class="ddb-promo" href="${pg.u("price-check.html")}"><span class="nl-free">Free</span><b>Found a hotel already?</b><span class="ddb-p">Send us the hotel and price. We'll compare the same room, dates and terms, and tell you honestly if we can do better.</span><span class="ddb-cta">Get a free price check${ARROW}</span></a>
          <div class="ddb-foot"><a class="dd-all" href="${pg.u("trips/index.html")}">See all trips${ARROW}</a></div>
        </div>`;
  const destIndex = pg.u("destinations/index.html");
  const destLinks = C.DESTS.map((d) => {
    const path = "destinations/" + d.slug + ".html";
    const current = pg.path === path ? ' aria-current="page"' : "";
    const country = d.name === d.country ? "" : `<span>${esc(d.country)}</span>`;
    return `<a class="ddb-row" href="${pg.u(path)}"${current}><span class="ph">${countryFlag(pg, d.flag)}</span><span class="ddb-tx"><b>${esc(d.name)}</b>${country}</span></a>`;
  }).join("");
  const allDestinations = `<a class="dd-all" href="${destIndex}">See all destinations${ARROW}</a>`;
  const chevron = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
  const pl = planLink(pg), dp = pl === "#enquire" ? " data-plan" : "";
  return `<a class="skip" href="#main">Skip to content</a>
<header class="header" id="hdr">
  <div class="col">
    <a href="${pg.u("")}" aria-label="Saphara Travel, home">
      <img class="logo logo-light" src="${pg.img("saphara-logo-sand.svg")}" alt="Saphara Travel" width="120" height="35">
      <img class="logo logo-dark" src="${pg.img("saphara-logo-dark.svg")}" alt="" width="120" height="35">
    </a>
    <div class="hnav">
      <nav class="desk-links" aria-label="Main">
        <a class="nl nl-pc" href="${pg.u("price-check.html")}"><span class="nl-free">Free</span> Price check</a>
        <div class="dd"><button class="nl dd-btn" type="button" aria-expanded="false" aria-controls="tripsMenu">Trips${chevron}</button>
        ${ddPanel}</div>
        <div class="dd"><button class="nl dd-btn" type="button" aria-expanded="false" aria-controls="destinationsMenu">Destinations${chevron}</button>
          <div class="dd-panel ddb dd-destinations" id="destinationsMenu" role="region" aria-label="Destinations">
            ${destLinks}
            <div class="ddb-foot">${allDestinations}</div>
          </div>
        </div>
        <a class="nl" href="${pg.u("guides/index.html")}">Guides</a><a class="nl" href="${pg.u("why-saphara.html")}">Why Saphara</a>
      </nav>
      <a class="hwa" href="${waMark("header")}" aria-label="WhatsApp us">${waGlyph("")}</a>
      <a class="split hsplit" href="${pl}"${dp}><span class="split-label">Plan my trip</span><span class="split-arrow">${ARROW}</span></a>
      <button class="mbtn" id="mbtn" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mmenu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg></button>
    </div>
  </div>
</header>
<div class="mmenu" id="mmenu" role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="mm-top"><img src="${pg.img("saphara-logo-dark.svg")}" alt="Saphara Travel" width="120" height="35"><button class="mm-close" type="button" aria-label="Close menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>
  <nav aria-label="Menu">
    <a class="mm-pc" href="${pg.u("price-check.html")}"><span class="mm-tag">Free</span> Price check</a>
    <div class="mm-trips"><span>Trips</span><div class="mm-sub">${C.TRIPS.map(([s2, n2, img2, [a2, b2]]) => mmTrip(pg.u("trips/" + s2 + ".html"), pg.img("thumb-" + img2), n2, a2 + " " + b2)).join("")}${(C.MENU_EXTRA || []).map((m) => mmTrip(pg.u(m.href), pg.img(m.thumb), m.name, m.lines[0] + " " + m.lines[1])).join("")}</div></div>
    <details class="mm-destinations">
      <summary>Destinations${chevron}</summary>
      <div class="dd-destinations">${destLinks}<div class="ddb-foot">${allDestinations}</div></div>
    </details>
    <a href="${pg.u("guides/index.html")}">Guides</a><a href="${pg.u("why-saphara.html")}">Why Saphara</a>
  </nav>
  <div class="mm-actions"><a class="textlink" href="${waMark("menu")}">${waGlyph()}WhatsApp us</a><a class="split" href="${pl}"${dp}><span class="split-label">Plan my trip</span><span class="split-arrow">${ARROW}</span></a></div>
</div>`;
}

export function igStrip(pg) {
  const items = (dup) => [1, 2, 3, 4, 5, 6].map((i) => `<a href="https://www.instagram.com/sapharatravel/"${dup ? ' aria-hidden="true" tabindex="-1"' : ""} aria-label="Saphara Travel on Instagram, photo ${i}"><img src="${pg.img("guides/ig-" + i + ".webp")}" alt="" width="480" height="640" loading="lazy" decoding="async"></a>`).join("");
  return `<section class="igstrip white" aria-labelledby="ig-h">
  <div class="col ig-head">
    <div><h2 id="ig-h">Follow our trips</h2><p>New guides and hotels we've checked, on Instagram first.</p></div>
    <a class="textlink" href="https://www.instagram.com/sapharatravel/">@sapharatravel <span aria-hidden="true">→</span></a>
  </div>
  <div class="igm"><div class="igm-track">${items(false)}${items(true)}</div></div>
</section>`;
}

export function footer(pg) {
  // Rounded inset sand-deep panel (approved 15 Nov 2026), on a white surround. Styles: "Footer" block at the end of site.css.
  const L = (t, h) => `<li><a href="${pg.u(h)}">${t}</a></li>`;
  const pl = planLink(pg);
  const MAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>`;
  const IG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/></svg>`;
  const STAR = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.8l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 17l-5.8 3.6 1.6-6.6-5.2-4.4 6.8-.5z"/></svg>`;
  return `<div class="sf-wrap" id="footer">
<footer class="sf">
  <div class="sf-top">
    <div class="sf-brand">
      <img class="logo" src="${pg.img("saphara-logo-dark.svg")}" alt="Saphara Travel" width="120" height="35" loading="lazy">
      <p class="sf-closer"><span class="beat">Safe travels.</span> <span class="beat tone">Send us a picture.</span></p>
      <p class="sf-statement">We help make hotel and holiday bookings easier. We speak with hotels for you, compare prices like for like and stay in touch on WhatsApp while you're away.</p>
      <div class="sf-cta"><a class="split" href="${pl}"${pl === "#enquire" ? " data-plan" : ""}><span class="split-label">Plan my trip</span><span class="split-arrow">${ARROW}</span></a></div>
    </div>
    <nav class="sf-nav" aria-label="Footer">
      <div><h2 class="sf-h">Explore</h2><ul class="sf-links">
        ${L("Trips", "trips/index.html")}${L("Destinations", "destinations/index.html")}${L("Guides", "guides/index.html")}${L("Price check", "price-check.html")}${C.SHOW_ESSENTIALS ? L("Travel essentials", "travel-essentials.html") : ""}</ul></div>
      <div><h2 class="sf-h">Company</h2><ul class="sf-links">
        ${L("Why Saphara", "why-saphara.html")}${L("Reviews", "reviews.html")}${L("FAQ", "faq.html")}${L("Plan my trip", "plan-my-trip.html")}</ul></div>
    </nav>
    <div class="sf-help">
      <h2 class="sf-h">Help and contact</h2>
      <p>Already booked, or away right now? Message us on WhatsApp. We'll get back to you as soon as we can.</p>
      <ul class="sf-contact">
        <li><a href="${waMark("help")}"><span class="ic">${waGlyph()}</span><span class="nw">WhatsApp +44 7887 353457</span></a></li>
        <li><a href="mailto:hello@sapharatravel.co.uk"><span class="ic">${MAIL}</span>hello@sapharatravel.co.uk</a></li>
      </ul>
      <div class="sf-social">
        <a href="https://www.instagram.com/sapharatravel/" aria-label="Instagram @sapharatravel">${IG}</a>
        <a href="https://www.trustpilot.com/review/sapharatravel.co.uk" aria-label="Trustpilot reviews">${STAR}</a>
      </div>
    </div>
  </div>
  <div class="sf-legal">
    <ul aria-label="Legal">
      ${L("Privacy", "privacy.html")}${L("Cookies", "cookies.html")}${L("Booking terms", "booking-terms.html")}${L("Website terms", "website-terms.html")}${L("ATOL and financial protection", "atol-and-financial-protection.html")}</ul>
    <p>&copy; ${new Date().getFullYear()} Saphara Travel Group Ltd (STG). Saphara Travel is a trading name of Saphara Travel Group Ltd, registered in England and Wales, company number 16336079.${C.REG_OFFICE ? ` Registered office: ${esc(C.REG_OFFICE)}.` : ""}</p>
  </div>
  <!-- Doha skyline removed from the footer (16 Nov 2026, Huzaifa) -->
</footer>
</div>`;
}

export function sticky(pg) {
  const pl = planLink(pg);
  // 16 Nov 2026 (Huzaifa): WhatsApp is the main button on phones and tablets; Plan my trip sits beside it as the second choice.
  return `<div class="sticky" id="sticky">
  <a class="split" href="${waMark("sticky")}" tabindex="-1"><span class="split-label">${waGlyph()}WhatsApp us</span><span class="split-arrow">${ARROW}</span></a>
  <a class="sticky-plan" href="${pl}"${pl === "#enquire" ? " data-plan" : ""} tabindex="-1">Plan my trip</a>
</div>`;
}

export function crumbs(pg, trail) {
  const parts = [`<a href="${pg.u("")}">Home</a>`];
  for (const [t, h] of trail.slice(0, -1)) parts.push(`<a href="${pg.u(h)}">${t}</a>`);
  parts.push(`<span aria-current="page">${trail[trail.length - 1][0]}</span>`);
  return '<nav class="crumbs" aria-label="Breadcrumb">' + parts.join(' <span aria-hidden="true">/</span> ') + "</nav>";
}

/** Keeps the WhatsApp icon and word together so they never wrap apart. */
// Phrases that must never split across lines. Only text between tags is touched, never attributes or scripts.
const NOBREAK = [["WhatsApp us", "WhatsApp\u00a0us"], ["Plan my trip", "Plan\u00a0my\u00a0trip"], ["Muslim-owned", "Muslim\u2011owned"], ["£0 ", "£0\u00a0"], ["and Madinah", "and\u00a0Madinah"]];
const ENDS = /^<\/(p|li|dd|dt|blockquote|figcaption|h[1-6]|span|a|b|strong|em|small|label|button)>/;
// The last two words of a run that ends an element are joined with a no-break space when the last word is short,
// so no line ends on one word, the same in Safari and Chrome (Safari 18 has no text-wrap: pretty).
const tieLast = (t) => t.replace(/(\S) +(\S{1,15}\s*)$/, "$1\u00a0$2");
// In headings, short hyphenated words (flight-inclusive) never split at the hyphen; Safari breaks there otherwise.
const keepHyphens = (t) => t.replace(/(^|[\s(\u201c"])([A-Za-z]+(?:-[A-Za-z]+)+)(?=[\s.,;:!?)\u201d"\u00a0]|$)/g, (m, pre, w) => (w.length <= 24 ? `${pre}<span class="keep">${w}</span>` : m));
export const keepTogether = (html) => { const P = html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<textarea[\s\S]*?<\/textarea>|<[^>]*>)/); return P.map((seg, i) => { if (i % 2) return seg; let t = NOBREAK.reduce((x, [a, b]) => x.split(a).join(b), seg); if (ENDS.test(P[i + 1] || "") && t.trim().split(/\s+/).length >= 3) t = tieLast(t); if (/^<(h[1-4]|span class="beat)[\s>]/.test(P[i - 1] || "")) t = keepHyphens(t); return t; }).join(""); };
export const keepWhatsAppTogether = (html) => keepTogether(html).replace(/(<svg class="wai"[^>]*>(?:(?!<\/svg>)[\s\S])*<\/svg>)\s*(WhatsApp)/g, '<span class="nw">$1$2</span>');

// ---------- page blocks ----------
export const beats = (lines, toneLast = false) => lines.map((l, i) => `<span class="${toneLast && i === lines.length - 1 && lines.length > 1 ? "beat tone" : "beat"}">${l}</span>`).join(" ");

// ---------- responsive images (21 Nov 2026) ----------
// Smaller copies live in img/r/ and are listed in src/data/img-sizes.json (made by tools/images/responsive.py).
// `sizes` says how wide each kind of photo shows, so the browser picks the right copy. Order matters: first match wins.
// 22 Nov 2026: st-* rules added from measured widths at 390, 1440 and 1920px (before, they all fell to the default, which
// asked for files about 1.5x too big on desktop). Photos now go up to 1600px (tools/images/crisp.cjs).
const SIZES = [
  [/^st-hero-/, "100vw"],
  [/^st-(panel-|family-phiphi|multi-westbay|hotel-balcony)/, "(min-width: 1024px) 37vw, 75vw"],
  [/^st-business-doha/, "(min-width: 1024px) 38vw, 92vw"],
  [/^st-why-(room|mosque|beach)/, "(min-width: 1024px) 28vw, 90vw"],
  [/^st-(why-|reviews-mayabay)/, "(min-width: 1024px) 44vw, 100vw"],
  [/^st-(reviews-maldives|howwework-kl)/, "(min-width: 1024px) 20vw, 75vw"],
  [/^st-reviews-praslin/, "(min-width: 1024px) 29vw, (min-width: 768px) 45vw, 64px"],
  [/^st-(dest-|madinah-|langkawi-|dubai-alfahidi)/, "(min-width: 1920px) 560px, (min-width: 1024px) 34vw, (min-width: 768px) 50vw, 56vw"], // two per row on phones
  [/^st-/, "(min-width: 1920px) 560px, (min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"],
  [/^dest-/, "(min-width: 1440px) 340px, (min-width: 1024px) 24vw, 50vw"],
  [/^guides\/guide-/, "(min-width: 1920px) 470px, (min-width: 1440px) 410px, (min-width: 768px) 33vw, 90vw"],
  [/^trip-/, "(min-width: 1440px) 420px, (min-width: 1024px) 31vw, (min-width: 768px) 48vw, 92vw"],
  [/^hero-/, "100vw"],
];
const SIZES_DEFAULT = "(min-width: 1024px) 50vw, 100vw";
const stemOf = (name) => name.replace(/\.[a-z]+$/i, "");
/** srcset for a photo in img/ (pre is the "../" prefix the page already uses), or "" when it has no smaller copies. */
export const srcsetFor = (pre, name) => {
  const e = IMGS.photos[name];
  if (!e || !e.w.length) return "";
  return e.w.map((w) => `${pre}img/r/${stemOf(name)}-${w}.webp ${w}w`).concat(`${pre}img/${name} ${e.full}w`).join(", ");
};
/** Adds srcset and sizes to every <img src=".../img/..."> that has smaller copies and no srcset yet. Runs on every page in Base.astro. */
export const responsiveImgs = (html) => html.replace(/<img\b([^>]*?)\ssrc="((?:\.\.\/|\/)*)img\/([^"]+)"([^>]*)>/g, (all, a, pre, name, b) => {
  if (/\ssrcset=/.test(a + b)) return all;
  const ss = srcsetFor(pre, name);
  if (!ss) return all;
  let sz = (SIZES.find(([re]) => re.test(name)) || [null, SIZES_DEFAULT])[1];
  // 22 Nov 2026: lazy photos get sizes="auto" first, so Chrome and Edge use the real width on that page (the same photo is a
  // big card on one page and a small one on another). Browsers without it (Safari for now) use the list after it.
  if (/\sloading="lazy"/.test(a + b)) sz = "auto, " + sz;
  return `<img${a} src="${pre}img/${name}" srcset="${ss}" sizes="${sz}"${b}>`;
});
/** Hero photo. A destination hero set (IMGS.heroes) gets a landscape set from 768px and a portrait crop on phones. */
function heroPicture(pg, img, alt) {
  const pre = pg.u("img/x").slice(0, -"img/x".length);
  const h = IMGS.heroes[img];
  if (h) {
    const set = (k) => h[k].w.map((w) => `${pre}img/r/${img}-${k}-${w}.webp ${w}w`).join(", ");
    const dims = (k, w) => `width="${w}" height="${Math.round((w * h[k].ratio[1]) / h[k].ratio[0])}"`;
    const mMax = h.m.w[h.m.w.length - 1], dMax = h.d.w[h.d.w.length - 1];
    return `<picture><source media="(min-width: 768px)" srcset="${set("d")}" sizes="100vw" ${dims("d", dMax)}><img src="${pre}img/r/${img}-m-${mMax}.webp" srcset="${set("m")}" sizes="100vw" ${dims("m", mMax)} alt="${alt}" fetchpriority="high" decoding="async"></picture>`;
  }
  const ss = srcsetFor(pre, img);
  return `<picture><img src="${pg.img(img)}"${ss ? ` srcset="${ss}" sizes="100vw"` : ""} alt="${alt}" fetchpriority="high" decoding="async"></picture>`;
}

export function photoHero(pg, img, alt, h1Lines, lead, btn = "Plan my trip", extra = "", fit = null, actions = null) {
  const fitS = fit ? ` style="--fit:${typeof fit === "number" && Number.isInteger(fit) ? fit.toFixed(1) : fit}"` : "";
  const h1 = h1Lines.map((l, i) => `<span${i === h1Lines.length - 1 && h1Lines.length > 1 ? ' class="tone"' : ""}>${l}</span>`).join(" ");
  return `<section class="hero" id="hero" aria-label="Introduction">
  ${heroPicture(pg, img, alt)}
  <div class="col">
    <h1 class="display"${fitS}>${h1}</h1>
    <p class="lead">${lead}</p>${extra}
    <div class="actions${!actions && btn && btn.replace(/<[^>]+>/g, "").length > 14 ? " stack" : ""}">${actions ?? split(btn, planLink(pg), false, planLink(pg) === "#enquire") + `<a class="btn btn-ghost-light" href="${waMark("hero")}">${waGlyph("wa-glyph")}WhatsApp us</a>`}</div>
  </div>
</section>`;
}

export function pageHead(pg, trail, h1Lines, lead, fit = null, actions = "") {
  const fitS = fit ? ` style="--fit:${fit}"` : "";
  return `<section class="page-head white"><div class="col"><div class="intro">
  ${crumbs(pg, trail)}
  <h1 class="display d-l"${fitS}>${beats(h1Lines)}</h1>
  <p>${lead}</p>${actions}
</div></div></section>`;
}

export const crumbBar = (pg, trail) => `<div class="col crumbs-bar">${crumbs(pg, trail)}</div>`;
export const band = (cls, inner, id = "") => `<section class="band ${cls}"${id ? ` id="${id}"` : ""}><div class="col">${inner}</div></section>`;
export function intro(h2Lines, p = "", fit = null, extra = "") {
  const fitS = fit ? ` style="--fit:${fit}"` : "";
  return `<div class="intro"><h2 class="display d-l"${fitS}>${beats(h2Lines)}</h2>${p ? `<p>${p}</p>` : ""}${extra}</div>`;
}
export const why = (items) => '<div class="why6">' + items.map(([i, t, d]) => `<div class="rv">${ico(i)}<div><h3>${t}</h3><p>${d}</p></div></div>`).join("") + "</div>";

export function rustPanel(pg, label, lines, text, img, alt, items, btn = null, trip = null, fit = null) {
  const rows = items.map(([, t, d]) => `<li><span class="tick">${CHECK}</span><div><h3>${t}</h3><p>${d}</p></div></li>`).join("");
  let b = "";
  if (btn) { const href = pg.u("plan-my-trip.html") + (trip ? "?trip=" + trip.replace(/ /g, "+") : ""); b = `<div class="actions" style="margin-top:var(--s-24)">${split(btn, href)}</div>`; }
  return `<div class="rpanel"><div class="rbox rv"><h2 class="display d-l"${fit ? ` style="--fit:${fit}"` : ""}>${beats(lines, true)}</h2><p>${text}</p><img src="${pg.img(img)}" alt="${alt}" loading="lazy" decoding="async"></div><div class="rlist"><ol>${rows}</ol>${b}</div></div>`;
}

export const chips = (items) => '<ul class="chips">' + items.map((c) => `<li>${TICK}${c}</li>`).join("") + "</ul>";
export const faq = (items) => '<div class="faq">' + items.map(([q, a]) => `<details class="rv"><summary>${q}${PLUS}</summary><p class="ans">${a}</p></details>`).join("") + "</div>";

export function cta(pg, lines, p, label, { chipsTitle = "What happens next", chipItems = ["We'll get back to you as soon as we can", "Options compared like for like", "Nothing booked until you say yes", "Nothing upfront on eligible free cancellation rates"], cls = "white", trip = null, href = null } = {}) {
  const wa = href !== null;
  href = href || planLink(pg);
  let btn = split(label, href, false, href === "#enquire");
  if (trip && href !== "#enquire" && !wa) btn = split(label, href + "?trip=" + trip.replace(/ /g, "+"));
  return band(cls, `<div class="price-card rv"><div class="pc-main"><div class="intro"><h2 class="display d-m">${beats(lines)}</h2><p>${p}</p><div class="actions">${btn}</div></div></div>
  <div class="pc-checks"><p class="pc-k">${chipsTitle}</p>${chips(chipItems)}</div></div>`);
}

export function tripCard(pg, slug, name, img, lines, line) {
  const arrow = ARROW.replace("<svg ", '<svg width="16" height="16" style="stroke:currentColor;fill:none;stroke-width:1.8" ');
  return `<a class="pcard tcard rv" href="${pg.u("trips/" + slug + ".html")}" data-move><img class="fade${slug === "business" ? " warm" : ""}" src="${pg.img(img)}" alt="" loading="lazy" decoding="async">
  <div class="body"><h3><span>${lines[0]}</span> <span>${lines[1]}</span></h3><p>${line}</p><span class="go">${name} ${arrow}</span></div></a>`;
}

export const countryFlag = (pg, code, country = "") => code
  ? `<img class="country-flag" src="${pg.u("assets/flags/" + code + ".svg")}" width="20" height="15" alt="${esc(country)}">`
  : "";

const destInner = (pg, d) => `<img class="fade${d.warm ? " warm" : ""}" src="${pg.img(d.img)}" alt="${d.alt}" width="800" height="1066" loading="lazy" decoding="async"><span class="code">${countryFlag(pg, d.flag)}${d.code}</span><h3>${d.short || d.name}</h3><span class="time">${ico("flights")}${d.flight}</span>`;
export const destCard = (pg, d) => `<a class="pcard dest rv" href="${pg.u("destinations/" + d.slug + ".html")}" data-move aria-label="${d.name}, ${d.country}. ${d.flight_long}">${destInner(pg, d)}</a>`;
export const placeCard = (pg, d) => (d.slug ? destCard(pg, d) : `<div class="pcard dest rv" aria-label="${d.name}, ${d.country}. ${d.flight_long}">${destInner(pg, d)}</div>`);

export const gcard = (pg, g) => `<div class="gitem rv"><a class="gcard" href="${pg.u("guides/" + g.slug + ".html")}"><span class="gphoto"><img src="${pg.img("guides/" + g.img)}" alt="" width="960" height="1200" loading="lazy" decoding="async"></span><span class="gtext"><span class="gk">${countryFlag(pg, g.flag)}Guide</span><h3>${g.name}</h3><span class="gline">${g.card || g.line}</span></span></a></div>`;

export { C };

// ---------- clean addresses (SEO fixes, 15 Nov 2026) ----------
// Cloudflare serves privacy.html at /privacy and guides/index.html at /guides/, and redirects the .html address there.
// Every internal link is rewritten to that clean, root-relative address after a page is built, so no link goes through a redirect.
export const SITE = "https://sapharatravel.co.uk";
export function cleanPath(target, from) {
  const m = target.match(/^([^?#]*)(.*)$/);
  let p = m[1];
  if (!p.endsWith(".html")) return null;
  const parts = p.startsWith("/") ? [] : from.split("/").slice(0, -1);
  for (const seg of p.split("/")) { if (seg === "..") parts.pop(); else if (seg && seg !== ".") parts.push(seg); }
  p = "/" + parts.join("/");
  p = p.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "");
  return p + m[2];
}
export const cleanLinks = (html, from) => html.replace(/(<a\b[^>]*?\shref=")([^"]*)"/g, (all, pre, href) => {
  if (/^(https?:|mailto:|tel:|#|data:|javascript:)/.test(href)) return all;
  const c = cleanPath(href, from);
  return c === null ? all : pre + c + '"';
});

// ---------- structured data (docs/SEO.md). No address and no star ratings (brief 13.11). ----------
export const ORG_ID = SITE + "/#organization";
export const travelAgencyLd = () => ({
  "@type": "TravelAgency",
  "@id": ORG_ID,
  name: "Saphara Travel",
  legalName: "Saphara Travel Group Ltd",
  description: "Saphara Travel is a Muslim-owned UK travel company arranging Muslim-friendly holidays, honeymoons and hotel stays, with personalised travel planning and support.",
  url: SITE + "/",
  logo: SITE + "/img/icons/icon-512.png",
  image: SITE + "/img/og-home.jpg",
  email: "hello@sapharatravel.co.uk",
  telephone: "+447887353457",
  contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: "+447887353457", email: "hello@sapharatravel.co.uk", url: WA_BASE, availableLanguage: "en-GB" },
  areaServed: { "@type": "Country", name: "United Kingdom" },
  sameAs: ["https://www.instagram.com/sapharatravel/", "https://www.trustpilot.com/review/sapharatravel.co.uk"],
});
export const websiteLd = () => ({ "@type": "WebSite", "@id": SITE + "/#website", name: "Saphara Travel", url: SITE + "/", inLanguage: "en-GB", publisher: { "@id": ORG_ID } });
/** BreadcrumbList from the page's own breadcrumb trail, so the markup always matches what people see. */
export function breadcrumbLd(html, from, canon) {
  const nav = html.match(/<nav class="crumbs"[^>]*>([\s\S]*?)<\/nav>/);
  if (!nav) return null;
  const strip = (s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\u00a0/g, " ").trim();
  const items = [...nav[1].matchAll(/<a href="([^"]*)">([\s\S]*?)<\/a>/g)].map(([, h, t]) => ({ name: strip(t), item: SITE + (h.startsWith("/") ? h : cleanPath(h, from) ?? "/") }));
  const cur = nav[1].match(/<span aria-current="page">([\s\S]*?)<\/span>/);
  if (cur) items.push({ name: strip(cur[1]), item: canon });
  return { "@type": "BreadcrumbList", itemListElement: items.map((x, i) => ({ "@type": "ListItem", position: i + 1, name: x.name, item: x.item })) };
}
export const ldScript = (nodes) => {
  const graph = nodes.filter(Boolean);
  if (!graph.length) return "";
  return `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c")}</script>`;
};

// 21 Nov 2026: version tag for site files that keep their name (site.css, site.js, price-check.js), so browsers fetch the new file after every change instead of using a cached copy for up to a day (see public/_headers)
export const assetV = (f) => { try { return createHash("md5").update(readFileSync(joinPath(process.cwd(), "public", "assets", f))).digest("hex").slice(0, 8); } catch (e) { return String(Date.now()); } };
