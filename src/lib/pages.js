// Page bodies, ported from build() in tools/build_site.py. Each function returns { path, title, desc, hero, og, body }.
import { assetV, C, Page, WA, WA_BASE, waMark, IG, SITE, ORG_ID, cleanPath, waGlyph, split, planLink, crumbs, beats, photoHero, shareBtn, pageHead, crumbBar, band, intro, why, rustPanel, chips, faq, cta, tripCard, destCard, placeCard, gcard, ico, igStrip } from "./site.js";

import hero from "../components/home/00-hero.html?raw";
import hotelNames from "../components/home/01-hotel-names.html?raw";
import how from "../components/home/02-how-it-works.html?raw";
import HQ from "../data/hotel-questions.json";
import payLater from "../components/home/03b-pay-later.html?raw";
import priceCheck from "../components/home/03-price-check.html?raw";
import trips from "../components/home/04-trips.html?raw";
import destinations from "../components/home/05-destinations.html?raw";
import declaration from "../components/home/06-declaration.html?raw";
import moment from "../components/home/05b-moment.html?raw";
// import compare from "../components/home/06b-compare.html?raw"; // parked 21 Nov 2026
import reviews from "../components/home/07-reviews.html?raw";
import quote from "../components/home/08-quote.html?raw";
import business from "../components/home/09-business.html?raw";
import faqTeaser from "../components/home/12-faq.html?raw";
import enquiry from "../components/home/13-enquiry.html?raw";

/** Trip stories: short, real, a request confirmed or a problem fixed. Hidden until C.TRIP_STORIES has entries (see docs/TRIP-STORIES.md). */
export function tripStories(pg, cls = "white") {
  const st = C.TRIP_STORIES || [];
  if (!st.length) return "";
  const cards = st.map((t) => `<article class="story rv"><p class="story-k">${t.trip}</p><dl><div><dt>The ask</dt><dd>${t.ask}</dd></div><div><dt>What we did</dt><dd>${t.did}</dd></div></dl><blockquote>“${t.outcome}”</blockquote><p class="story-who">${t.name}${t.when ? " · " + t.when : ""}</p></article>`).join("");
  return band(cls, intro(["Trip stories."], "Real trips, in our clients' words.") + `<div class="stories">${cards}</div>`, "stories");
}


/** "Pack light." section: the questions we ask hotels. Edit the list in src/data/hotel-questions.json. */
function hotelQuestions() {
  let n = 0;
  const cols = HQ.groups.map((g) => {
    const start = n + 1;
    const items = g.questions.map((q) => { n += 1; return `<li>${q}</li>`; }).join("\n            ");
    return `<div class="qa-col rv">
          <p class="qa-k">${g.title}</p>
          <ol class="qa-list" start="${start}" style="counter-reset:q ${start - 1}">
            ${items}
          </ol>
        </div>`;
  }).join("\n        ");
  return `<!-- 2b PACK LIGHT: the questions we ask hotels (list in src/data/hotel-questions.json) -->
<section class="band white" id="questions">
  <div class="col">
    <div class="qa-wrap">
      <div class="intro">
        <h2 class="display d-l" style="--fit:6.95">${beats(HQ.headline)}</h2>
        <p>${HQ.intro}</p>
      </div>
      <div class="qa-lists">
        ${cols}
      </div>
    </div>
  </div>
</section>
`;
}

/** "More than just a booking": things we ask hotels for, worded as requests (never guaranteed perks). Hotel only trip page and Why Saphara. */
function moreThanBooking(cls = "sand") {
  return band(cls, `<div class="split-cols"><div class="intro"><h2 class="display d-l">${beats(["More than just a booking."])}</h2><p>When we book your hotel, we don't just send the reservation. We ask the hotel for the things that make a stay: early check-in after an overnight flight, a room upgrade if one's free, a honeymoon touch, a cot ready on arrival, a driver at arrivals. Then we tell you exactly what they've agreed to before you travel.</p></div><div class="rv"><p class="pc-k">Requested, not guaranteed</p>${chips(["Early check-in, requested", "Upgrades, asked for", "Honeymoon touches, arranged where the hotel can", "Transfers, booked and confirmed"])}<p class="small-print">Some hotels say yes, some can't. We'll never promise anything a hotel hasn't confirmed.</p></div></div>`, "more-than-booking");
}

const D = Object.fromEntries(C.DESTS.map((d) => [d.slug, d]));
const join = (...parts) => parts.join("\n");

// ---------- home ----------
// Cards on the homepage to the pages that hold what used to be on it.
// 21 Nov 2026 (Huzaifa): no photo used twice on the homepage; Reviews, Business and FAQs got their own photos (IMAGES.md).
// 22 Nov 2026 (evening, Huzaifa, Cloudflare preview review): "A little more about SAPHARA." with three cards replaces "Still deciding?".
const MORE_CARDS = [
  ["reviews.html", "st-reviews-praslin.webp", "Client Reviews", "Read what travellers have said after booking with Saphara."],
  ["why-saphara.html", "st-card-multicity.webp", "How We Work", "A small team, honest hotel comparisons and support on WhatsApp."],
  ["guides/index.html", "guides/guide-malta.webp", "Travel Guides", "Practical notes on where to eat, pray, stay and explore."],
];
const CARD_ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
function moreCards(pg) {
  return `<section class="band white more-band" id="more" aria-labelledby="moreH"><div class="col"><div class="intro"><h2 class="display d-l" id="moreH">A little more about SAPHARA.</h2><p>Useful things to look through while you\'re deciding.</p></div><ul class="more-cards">${MORE_CARDS.map(([h, img, t, d]) => `<li><a class="more-card rv" href="${pg.u(h)}"><img src="${pg.img(img)}" alt="" loading="lazy" decoding="async"><span class="mc-tx"><span class="mc-t">${t}</span><span class="mc-d">${d}</span></span><span class="mc-a">${CARD_ARROW}</span></a></li>`).join("")}</ul></div></section>`;
}
// Proof under the hero (16 Nov 2026, Huzaifa): the Trustpilot line and one real review, lifted from the reviews block so the wording can't drift.
// Reviews under the hotel names (22 Nov 2026 audit, Huzaifa): the three real Trustpilot reviews rotate, lifted from the reviews block so the wording can't drift.
function proofReviews() {
  // 22 Nov 2026 (night, Huzaifa: "show the clients first name on the trustpilot reviews"). Real Trustpilot reviews whose public display name gives a first name,
  // quoted as written (Maroof's is an excerpt). "AS" and "Shmikkyy" are initials and a username on Trustpilot, so they stay on the Reviews page only.
  return [
    { quote: "One of the smoothest, most well organised holidays we’ve ever had.", who: "Maroof", when: "Honeymoon in Seychelles and Oman · Trustpilot, July 2026" },
    { quote: "Just returned from an incredible trip to Malaysia and Japan, all thanks to Saphara Travel Group!", who: "Hamza", when: "Trustpilot, July 2026" },
    { quote: "The Saphara lads have made holiday planning the most seamless thing ever.", who: "Umair", when: "Trustpilot, May 2026" },
    { quote: "First time using these guys and I will definitely be using them again.", who: "Uwaisse", when: "Trustpilot, May 2026" },
  ];
}
function heroProof(pg, bandClass = "white") {
  // Redesigned 16 Nov (Huzaifa: "show the review bigger in Kensington"): large quote in Kensington, then the Trustpilot line. 22 Nov 2026: rotates through four reviews, first names shown.
  const rvs = proofReviews();
  const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 17l-5.8 3.6 1.6-6.6-5.2-4.4 6.8-.5z"/></svg>';
  const slides = rvs.map((r, k) => `<div class="proof-slide${k === 0 ? " is-on" : ""}" id="proofSlide${k}" role="group" aria-roledescription="review" aria-label="Review ${k + 1} of ${rvs.length}"${k === 0 ? "" : ' aria-hidden="true"'}><blockquote>${r.quote}</blockquote><figcaption><span class="proof-who">${r.who}</span><span class="proof-src">${r.when}</span></figcaption></div>`).join("");
  const dots = rvs.length > 1 ? `<div class="proof-dots" role="group" aria-label="Choose a review">${rvs.map((r, k) => `<button type="button" class="proof-dot${k === 0 ? " is-on" : ""}" aria-label="Review ${k + 1}" aria-controls="proofSlide${k}" aria-pressed="${k === 0}"></button>`).join("")}</div>` : "";
  return `<section class="band ${bandClass} proof-band" id="proof" aria-label="What our travellers say"><div class="col"><figure class="proof rv" data-proof>
  <span class="proof-mark" aria-hidden="true">“</span>
  <span class="proof-stars" role="img" aria-label="5 out of 5 stars">${STAR.repeat(5)}</span>
  <div class="proof-slides" aria-live="polite">${slides}</div>
  ${dots}
  <p class="proof-tp"><b>Rated Excellent on Trustpilot</b><a class="textlink" href="${pg.u("reviews.html")}">Read our reviews <span aria-hidden="true">→</span></a></p>
</figure></div></section>`;
}
export function home() {
  const pg = new Page("index.html");
  const guides = `<!-- 4b GUIDES: the bridge from Instagram -->
<section class="band sand" id="guides">
  <div class="col">
    <div class="dest-head"><div class="intro"><h2 class="display d-l">${beats(["Field notes.", "From our own trips."])}</h2><p>Our Instagram guides, in full: where we ate, where we prayed and what was worth the walk.</p></div>
      <a class="textlink" href="guides/index.html">All our Muslim-friendly travel guides <span aria-hidden="true">→</span></a></div>
    <div class="gcards" style="margin-top:var(--intro-content)">${C.GUIDES.map((g) => gcard(pg, g)).join("")}</div>
  </div>
</section>
`;
  // Slim homepage (15 Nov, Huzaifa): hero, trip types, destinations and the USPs, then cards to everything that moved to its own page.
  const toPlan = (h) => h.replace(/href="#enquire" data-trip="([^"]+)"/g, (m, t) => `href="${pg.u("plan-my-trip.html")}?trip=${t.replace(/ /g, "+")}"`).replace(/href="#enquire"( data-plan)?/g, `href="${pg.u("plan-my-trip.html")}"`);
  void guides;
  // 16 Nov 2026 (Huzaifa): proof under the hero, then the FAQ teaser and the check-in form ("Bismillah. Let's plan it.") back at the end, with a WhatsApp button.
  const finalCta = enquiry.replace(/(<h2 class="display d-l"><span class="beat">Bismillah\.<\/span>[\s\S]*?<\/p>)(\s*<\/div>)/, `$1<p class="final-wa-link mob-only">Prefer to chat? <a class="textlink" href="${waMark("final")}">${waGlyph("wa-glyph")}WhatsApp us</a></p><div class="actions final-wa not-mob">${split(waGlyph("wa-glyph") + "WhatsApp us", waMark("final"), true)}</div>$2`).replace('class="band sand form-wrap"', 'class="band final-band form-wrap"');
  // 21 Nov 2026 (Huzaifa): comparison section added after destinations; bands re-alternate white and sand.
  // 21 Nov 2026 (later): comparison section parked (component kept in 06b-compare.html); bands alternate white and sand again.
  // 22 Nov 2026 (Huzaifa): the pay later block replaced the declaration; 22 Nov 2026 (evening, Cloudflare preview review): the declaration is back. Pay later stays in 03b-pay-later.html (Why Saphara).
  // 22 Nov 2026 (mobile audit, Huzaifa): the full-width sand pay later banner replaces the declaration (declaration parked in 06-declaration.html); reviews move up under the hotel names and rotate.
  // Order: hero, hotel names, reviews, trips, pay later, destinations, big photo, FAQ, A little more, form. Bands: names white, reviews sand, trips white, pay later sand, destinations white, FAQ sand, More white.
  // Phones drop the "Due today" card so the banner stays short.
  const payLaterHome = payLater.replace('<section class="band white" id="pay-later">', '<section class="band sand pl-home" id="pay-later">').replace('<a class="split light" href="#enquire" data-plan>', '<a class="split" href="#enquire" data-plan>');
  void declaration;
  // Superseded the same day: 22 Nov 2026 (later, Huzaifa): reordered so the trip cards and the destination arches are not side by side.
  // Flow: what we arrange (trips), why it costs you nothing extra (declaration), where we know (destinations), a client's words, the big photo with its call to action, questions answered, more to read, then the form.
  // Bands re-alternate: hotel names white, trips sand, declaration white, destinations sand, testimonial white, FAQ sand, More white.
  // 22 Nov 2026 (night, Huzaifa): the big photo ("Somewhere worth the journey.", parked in 05b-moment.html) is replaced by How booking with Saphara works.
  // Bands: names white, reviews sand, trips white, pay later sand, destinations white, how it works sand, FAQ white, More sand.
  void moment;
  // 22 Nov 2026 (late night, Huzaifa: "tighter and easy to digest"): homepage How it works uses shorter steps; Why Saphara keeps the full version.
  const howHome = how.replace('<section class="band sand" id="how">', '<section class="band sand how-home" id="how">')
    .replace("<p>Four steps, all in one WhatsApp chat.</p>", "<p>Four steps, one WhatsApp chat.</p>")
    // 22 Nov 2026 (late night, Huzaifa): the phone graphic is replaced by WhatsApp-style chat bubbles.
    .replace(/<div class="phone-wrap" data-bubbles>[\s\S]*?<\/div>\s*<\/div>(?=\s*<ol class="steps">)/, `<div class="wa-chat" data-bubbles>
        <div class="wa-top" aria-hidden="true"><span class="wa-av">S</span><span class="wa-who"><b>SAPHARA</b><small>WhatsApp</small></span></div>
        <div class="wa-msgs" role="img" aria-label="Example messages: a couple asks about a Zanzibar honeymoon, Saphara sends options, and later sorts a room that wasn't ready">
          <p class="bub wa them">Salaam. Honeymoon in Zanzibar in March?<span class="wa-t">10:02</span></p>
          <p class="bub wa us">Congratulations. Here are three villas we'd book, compared like for like.<span class="wa-t">10:14 <span class="wa-ticks">\u2713\u2713</span></span></p>
          <p class="wa-day" aria-hidden="true">March</p>
          <p class="bub wa them">We've landed but the room isn't ready.<span class="wa-t">11:40</span></p>
          <p class="bub wa us">Spoken to the hotel. Ready by 1pm, and the pool is yours till then.<span class="wa-t">11:46 <span class="wa-ticks">\u2713\u2713</span></span></p>
        </div>
      </div>`)
    .replace(/<ol class="steps">[\s\S]*?<\/ol>/, `<ol class="steps">
        <li><span class="step-ico" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4.5 3.5V16.5H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z"/><path d="M7.5 10h9M7.5 13h5.5"/></svg></span><span class="n">01</span><h3>Tell us the trip</h3><p>Where, when and who's coming.</p></li>
        <li><span class="step-ico" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><path d="M3 18.5V7M3 14h18v4.5M21 14v-2.5a3 3 0 0 0-3-3h-6.5V14"/><circle cx="7" cy="10.8" r="1.8"/></svg></span><span class="n">02</span><h3>Pick a hotel</h3><p>Two or three we'd book ourselves, compared like for like.</p></li>
        <li><span class="step-ico" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M9 15l2 2 4-4"/></svg></span><span class="n">03</span><h3>We book it</h3><p>Your requests passed to the hotel and confirmed.</p></li>
        <li><span class="step-ico" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24"><path d="M21 16.5v-1.8l-7.5-4.6V5a1.5 1.5 0 0 0-3 0v5.1L3 14.7v1.8l7.5-2.2v4.4l-2 1.5V21l3.5-1 3.5 1v-.8l-2-1.5v-4.4z"/></svg></span><span class="n">04</span><h3>We stay with you</h3><p>On WhatsApp until you're home.</p></li>
      </ol>`);
  const body = toPlan(join(hero, hotelNames, heroProof(pg, "sand"),
    trips.replace('<section class="band sand" id="trips">', '<section class="band white" id="trips">'),
    payLaterHome, destinations, howHome,
    faqTeaser,
    moreCards(pg).replace('class="band white more-band"', 'class="band sand more-band"'))) + "\n" + finalCta;
  return { path: pg.path, title: "Muslim-friendly holidays from the UK | Saphara Travel", desc: "Muslim-friendly holidays and honeymoons, arranged by a Muslim-owned UK travel company. Find hotels, plan your trip and get personal support from our team on WhatsApp.", hero: true, body };
}

// ---------- trips ----------
export function tripsIndex() {
  const pg = new Page("trips/index.html");
  let body = photoHero(pg, "page-hero-trips", "A palm-lined lane on La Digue in the Seychelles", ["Trips we arrange.", "Or just the bits you need."], "Honeymoons, beach and island resorts, family holidays, multi-city trips, hotel-only stays and business travel. Tell us what you need and we'll do the rest.", "Plan my trip", "", 6.3, undefined) + crumbBar(pg, [["Trips", "trips/index.html"]]);
  body += band("white after-head", '<h2 class="sr-only">All trips</h2><div class="cards3">' + C.TRIPS.map(([s, n, img, l]) => tripCard(pg, s, n, img, l, C.TRIP_LINES[s])).join("") + "</div>");
  body += band("sand", intro(["How it works."], "Four steps, all in one WhatsApp chat.") + '<ol class="steps" style="margin-top:var(--intro-content)"><li><span class="n">01</span><h3>Tell us the trip</h3><p>Where, roughly when and who\'s coming.</p></li><li><span class="n">02</span><h3>Choose from options</h3><p>Two or three hotels we\'d book ourselves, compared like for like.</p></li><li><span class="n">03</span><h3>We book and brief the hotel</h3><p>Your requests passed on and confirmed, everything in one place.</p></li><li><span class="n">04</span><h3>We stay with you</h3><p>On WhatsApp throughout your stay, and after you\'re home.</p></li></ol>');
  body += cta(pg, ["Not sure which?", "Start anyway."], "Tell us roughly what you'd like and we'll suggest the rest.", "Plan my trip");
  return { path: pg.path, title: "Trips we arrange | Saphara Travel", desc: "Honeymoons, beach and island holidays, family trips, multi-city trips, hotel-only stays and business travel, booked and looked after on WhatsApp.", hero: true, body };
}

export function tripPage(slug) {
  const t = C.TRIP_PAGES[slug];
  const pg = new Page(`trips/${slug}.html`);
  const tl = C.TRIPS.find((x) => x[0] === slug)[3];
  let body = photoHero(pg, t.img, t.alt, tl, t.lead, t.btn, "", C.FIT[slug]);
  body += crumbBar(pg, [["Trips", "trips/index.html"], [t.name, `trips/${slug}.html`]]);
  const [rimg, ralt] = C.RPIMG[slug];
  const heads = C.TRIP_HEADS[slug];
  if (slug === "business") body += business.replace('id="business"', 'id="business-service"').replace(/<h2 class="display d-l"[^>]*>[\s\S]*?<\/h2>\s*/, '<h2 class="sr-only">What we handle</h2>').split('src="img/').join('src="' + pg.img(""));
  else body += band("white", rustPanel(pg, "What we arrange", heads[0], "Tell us what you'd like us to handle. We book it, confirm the details with the hotel and stay on WhatsApp while you're away.", rimg, ralt, t.arrange));
  if (slug === "hotels") body += moreThanBooking("white continue");
  body += band("sand", `<div class="split-cols"><div class="intro sticky-col"><h2 class="display d-l">${beats(heads[1])}</h2><p>Every hotel is different, so we ask, and we tell you plainly what we find.</p></div><div class="rv">${chips(t.checks)}</div></div>`);
  body += band("white", '<div class="dest-head"><div class="intro"><h2 class="display d-l">' + beats(heads[2]) + '</h2></div><a class="textlink" href="' + pg.u("destinations/index.html") + '">All destinations <span aria-hidden="true">→</span></a></div><div class="dests">' + t.dests.map((s) => destCard(pg, D[s])).join("") + "</div>");
  if (t.resorts) body += band("sand", '<div class="intro"><h2 class="display d-l">' + beats(["Resorts", "we've booked before."]) + '</h2><p>Island resorts our clients have stayed in, compared like for like before anyone books.</p></div><div class="dests" style="margin-top:var(--intro-content)">' + C.RESORT_PLACES.filter((x) => !t.dests.includes(x.slug)).map((x) => placeCard(pg, x)).join("") + "</div>");
  body += band("white continue", `<div class="split-cols"><div class="intro"><h2 class="display d-l">${t.name.length < 12 ? beats([t.name + " questions."]) : beats(["Questions."])}</h2><p>Anything else? <a class="textlink" href="${waMark("faq")}">${waGlyph()}Ask us on WhatsApp <span aria-hidden="true">→</span></a></p></div>${faq(t.faq)}</div>`);
  let close = cta(pg, t.cta, "Tell us roughly when and where, and we'll come back with two or three options compared like for like.", t.btn, { cls: "white continue", trip: t.trip });
  // the closing card never repeats the hero headline (business page): it asks the next step instead
  if (t.cta.join(" ") === tl.join(" ")) close = close.replace(/<h2 class="display d-m">[\s\S]*?<\/h2>/, '<h2 class="display d-m">' + beats(["Talk to us about", "your next trip."]) + "</h2>");
  // 21 Nov 2026: one real review and the Trustpilot line before the closing card, so every trip page has proof (it had none)
  body += heroProof(pg).replace('class="band white proof-band"', 'class="band sand proof-band"');
  body += close;
  return { path: pg.path, title: t.title, desc: t.desc, hero: true, body };
}

// ---------- destinations ----------
export function destinationsIndex() {
  const pg = new Page("destinations/index.html");
  let body = photoHero(pg, "page-hero-destinations", "An island ringed by reef in the Maldives", ["Pick a place.", "We'll handle the rest."], "Places our clients go back to, from Zanzibar and Langkawi to Makkah and Madinah. Flight times are from Manchester and approximate.", "Plan my trip", "", null, undefined) + crumbBar(pg, [["Destinations", "destinations/index.html"]]);
  body += band("white after-head", '<h2 class="sr-only">All destinations</h2><div class="dests" style="margin-top:0">' + C.DESTS.map((d) => destCard(pg, d)).join("") + "</div>");
  body += cta(pg, ["Somewhere else?", "Ask us."], "These are the places we're asked about most, not the only ones. Tell us where you're thinking.", "Plan my trip");
  return { path: pg.path, title: "Muslim-friendly destinations | Saphara Travel", desc: "Zanzibar, Doha, Dubai, Oman, Makkah and Madinah, Kuala Lumpur and Langkawi: hotels and trips booked and looked after on WhatsApp.", hero: true, body };
}

export function destinationPage(slug) {
  const d = D[slug];
  const pg = new Page(`destinations/${slug}.html`);
  const g = d.page || null; // the fuller destination template (21 Nov 2026); destinations without `page` keep the short layout
  const fromMan = " From Manchester.";
  const meta = `<div class="meta" style="margin-top:var(--s-16);display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;font-size:var(--fs-caption)"><span style="font-family:var(--mono);font-size:11px;letter-spacing:.14em;padding:4px 8px;border-radius:999px;background:rgba(255,255,255,.9);color:var(--ink)">${d.code}</span><span>${d.flight_long}${fromMan}</span></div>`;
  let body = photoHero(pg, (g && g.hero) || d.hero || d.img, (g && g.hero_alt) || d.hero_alt || d.alt, [d.short || d.name], (g && g.lead) || d.intro, d.name.length < 10 ? `Plan a ${d.name} trip` : "Plan this trip", meta);
  body += crumbBar(pg, [["Destinations", "destinations/index.html"], [d.name, `destinations/${slug}.html`]]);
  let facts = (g && g.facts) || [["Flight time", d.flight_long + fromMan], ["Best time to go", d.best], ["Suits", d.suits], ["Food and alcohol", "We check each hotel and tell you plainly."]];
  if (slug === "makkah-and-madinah") facts = facts.filter((f) => f[0] !== "Food and alcohol");
  const checked = g && g.checked ? `<p class="updated dp-checked">Last checked: ${g.checked[1]}</p>` : "";
  const factsNote = (g && g.facts_note) || "Flight times are approximate and depend on the route and airline.";
  body += band("white", intro(["Good to know."], g && g.facts_intro ? g.facts_intro : "", null, checked) + '<dl class="facts rv" style="margin-top:var(--intro-content)">' + facts.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("") + `</dl><p class="small-print">${factsNote}</p>`);
  const whyHead = slug === "makkah-and-madinah" ? ["How we help."] : [d.name.length < 10 ? `Why ${d.name}.` : "Why go."];
  body += band("sand", intro(whyHead) + '<div class="why6" style="margin-top:var(--intro-content)">' + d.why.map(([a, b], k) => `<div class="rv">${ico(C.DEST_ICONS[slug][k])}<div><h3>${a}</h3><p>${b}</p></div></div>`).join("") + "</div>");
  if (g) body += destDetail(pg, d, g);
  body += band("white", intro(["Trips that suit it."]) + '<div class="cards3" style="margin-top:var(--intro-content)">' + C.TRIPS.filter(([s]) => d.trips.includes(s)).map(([s, n, img, l]) => tripCard(pg, s, n, img, l, "")).join("") + "</div>");
  body += cta(pg, [d.name.length < 10 ? `${d.name}, sorted.` : "Sorted."], (g && g.cta) || "Tell us when you'd like to go and who's coming, and we'll send options compared like for like.", "Plan my trip", { cls: "white continue" });
  const q = "?dest=" + d.name.replace(/ /g, "+") + (slug === "makkah-and-madinah" ? "&amp;trip=Umrah+hotels" : "");
  body = body.split('href="../plan-my-trip.html"').join('href="../plan-my-trip.html' + q + '"');
  // Titles and descriptions are set per destination (title in DESTS, description in DESC_OVERRIDES); the stitched fallback stays for a new destination only.
  return { path: pg.path, title: d.title || `${d.name} holidays and hotels | Saphara Travel`, desc: `${d.name}: ${d.intro} ${d.flight_long}`, hero: true, body, og: g && g.og ? g.og : undefined };
}

/**
 * The fuller destination sections (21 Nov 2026, Zanzibar first). Each block shows only if its data is in the
 * destination's `page` object in content.json:
 *   areas  Where to stay: one card per area (name, where, best for, a line, and a tide or practical note)
 *   week   A sample week, day by day, in the style of our client itineraries (a theme per day, a few plain lines)
 *   tips   Before you go: short grouped notes (getting there, entry, money, prayer, Ramadan...)
 *   faq    Questions people ask about the place
 * Bands keep alternating white and sand after "Why ...".
 */
function destDetail(pg, d, g) {
  let out = "";
  if (g.areas) {
    const cards = g.areas.items.map((a) => `<article class="area rv"><div class="area-top"><h3>${a.name}</h3><p class="area-where">${ico("pin")}${a.where}</p></div><p class="area-best"><span>Best for</span> ${a.best}</p><p class="area-line">${a.line}</p>${a.note ? `<p class="area-note">${a.note}</p>` : ""}</article>`).join("");
    out += band("white", intro(g.areas.head, g.areas.intro) + `<div class="areas">${cards}</div>` + (g.areas.foot ? `<p class="small-print">${g.areas.foot}</p>` : ""), "where-to-stay");
  }
  if (g.week) {
    const days = g.week.days.map(([, t, items], i) => `<li class="day rv"><p class="day-n"><small>Day</small> ${i + 1}</p><div class="day-b"><h3>${t}</h3><ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul></div></li>`).join("");
    const side = `<div class="sticky-col">${intro(g.week.head, g.week.intro)}${g.week.handle ? `<div class="week-handle rv"><p class="pc-k">${g.week.handle_head}</p>${chips(g.week.handle)}</div>` : ""}</div>`;
    out += band("sand", `<div class="split-cols week">${side}<ol class="days">${days}</ol></div>`, "sample-week");
  }
  if (g.tips) {
    const blocks = g.tips.items.map(([icon, h, items]) => `<div class="tip rv">${ico(icon)}<div><h3>${h}</h3><ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul></div></div>`).join("");
    out += band("white", intro(g.tips.head, g.tips.intro) + `<div class="tips">${blocks}</div>` + (g.tips.foot ? `<p class="small-print">${g.tips.foot}</p>` : ""), "before-you-go");
  }
  if (g.faq) out += band("sand", intro(g.faq.head) + `<div style="margin-top:var(--intro-content)">${faq(g.faq.items)}</div>`, "questions");
  return out;
}

// ---------- guides ----------
export function guidesIndex() {
  const pg = new Page("guides/index.html");
  let body = photoHero(pg, "guides/guide-sarajevo.webp", "Sarajevo from above", ["Field notes.", "From our own trips."], "Our Instagram guides, written up in full: halal food, where to pray, what to see and where to stay. Notes from our own trips: where we ate, prayed and stayed. Opening times and menus change, so check the latest before you go.", "Plan my trip", "", null, undefined) + crumbBar(pg, [["Guides", "guides/index.html"]]);
  body += band("white after-head", '<h2 class="sr-only">All guides</h2><div class="gcards">' + C.GUIDES.map((g) => gcard(pg, g)).join("") + "</div>");
  body += band("sand", `<div class="saved-note">${IG}<span>New guides appear on Instagram first.</span><a href="https://www.instagram.com/sapharatravel/">Follow @sapharatravel</a></div>`);
  return { path: pg.path, title: "Muslim-friendly travel guides | Saphara Travel", desc: "Our guides to halal food, mosques and things to do, written from our own trips and checked before we publish. Sarajevo, Malta and New York.", hero: true, body };
}

// The "Last checked" date shown on every guide, and used as dateModified in its Article markup.
const GUIDE_CHECKED = ["2026-11-14", "14 November 2026"];

export function guidePage(slug) {
  const g = C.GUIDES.find((x) => x.slug === slug);
  const gb = C.GUIDE_BODY[slug];
  const pg = new Page(`guides/${slug}.html`);
  // hero in the homepage style (14 Nov, Huzaifa); the Instagram cover style stays on the share images only
  const kind = g.label.startsWith("Halal") ? "A halal food guide." : "A Muslim-friendly guide.";
  const head = photoHero(pg, "guides/" + g.img, `A view from our trip to ${g.name}`, [g.name + ".", kind], g.line, null, "", 6.3, shareBtn());
  const note = `<div class="saved-note rv">${IG}<span>Saved this on Instagram? Here's the full guide.</span><a href="https://www.instagram.com/sapharatravel/">@sapharatravel</a></div>`;
  let body = head + crumbBar(pg, [["Guides", "guides/index.html"], [g.name, `guides/${slug}.html`]]);
  body += band("white", note + '<div class="intro" style="margin-top:var(--s-40)"><h2 class="display d-l">' + beats(["Quick facts."]) + "</h2><p>" + g.line + '</p></div><dl class="facts rv" style="margin-top:var(--intro-content)">' + gb.facts.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("") + "</dl>");
  let prose = '<div class="prose">';
  for (const [h, p, items] of gb.sections) {
    prose += `<h2>${h}</h2>` + (p ? `<p>${p}</p>` : "") + (items.length ? '<ul class="list">' + items.map(([a, c]) => `<li><b>${a}</b>${c ? ": " + c : ""}</li>`).join("") + "</ul>" : "");
  }
  prose += '<p class="small-print">Details change, so check opening times, menus and halal status before you travel.</p></div>';
  const side = `<div class="sticky-col"><p class="updated">Last checked: ${GUIDE_CHECKED[1]}</p><div class="actions" style="margin-top:var(--s-24);flex-direction:column;align-items:flex-start">${split("Plan this trip", planLink(pg))}<a class="textlink" href="${waMark("guide")}">${waGlyph()}Get this guide on WhatsApp <span aria-hidden="true">→</span></a></div></div>`;
  body += band("white continue", `<div class="split-cols">${side}${prose}</div>`);
  body += band("sand", intro(["More guides."]) + '<div class="gcards" style="margin-top:var(--intro-content)">' + C.GUIDES.filter((x) => x.slug !== slug).map((x) => gcard(pg, x)).join("") + "</div>");
  const label = g.label.charAt(0).toUpperCase() + g.label.slice(1);
  const title = `${label} ${g.name} | Saphara Travel`.replace("Muslim-friendly guide to", "Muslim-friendly").replace("Halal-friendly guide to food in", "Halal food in");
  const url = SITE + cleanPath(pg.path, "");
  const ld = { "@type": "Article", headline: title.replace(" | Saphara Travel", ""), description: C.DESC_OVERRIDES[pg.path] ?? g.line, image: `${SITE}/img/guides/${g.img}`, dateModified: GUIDE_CHECKED[0], inLanguage: "en-GB", author: { "@id": ORG_ID, "@type": "Organization", name: "Saphara Travel", url: SITE + "/" }, publisher: { "@id": ORG_ID, "@type": "Organization", name: "Saphara Travel", logo: { "@type": "ImageObject", url: SITE + "/img/icons/icon-512.png" } }, mainEntityOfPage: url };
  return { path: pg.path, title, desc: g.line, og: `guides/share-${slug}.jpg`, hero: true, body, ld };
}

// ---------- why saphara ----------
export function whySaphara() {
  const pg = new Page("why-saphara.html");
  // 23 Nov 2026 redesign (preview for Huzaifa, from why-saphara-design-prototype.html): eight sections, one job each.
  // Hero, intro, the Saphara difference, what Muslim-friendly means (accordion), Good advice. No extra fee. (black panel),
  // the practical bits, Huzaifa's quote, closing WhatsApp CTA. Bands alternate white and sand. Styles: "Why Saphara redesign" at the end of site.css.
  // Replaced on this page: "How we work." prose, How booking with Saphara works (02-how-it-works), Pack light (hotel questions),
  // the rust panel list, the pay later block and More than just a booking. All of those components still exist for other pages.
  let body = photoHero(pg, "page-hero-why", "The Doha skyline reflected in the water at dusk", ["Travel, with", "someone in your corner."], "Good trips take more than finding a hotel. We compare the details, ask the questions that matter to you and stay with you long after you've booked.", "Plan my trip", "", 6.2, undefined) + crumbBar(pg, [["Why Saphara", "why-saphara.html"]]);

  // 2. Introduction
  body += band("white after-head ws-intro", '<div class="split-cols editorial"><div class="intro"><h2 class="display d-l">' + beats(["The difference", "is in the details."]) + '</h2></div><div class="prose rv"><p>Saphara Travel is an independent, Muslim-owned travel company. We help you understand exactly what you\'re booking, compare the details that matter and feel looked after from the first message to the flight home.</p><p>That might mean asking what halal food a hotel really serves, how private a pool villa is, or checking that two rooms are genuinely comparable before you choose.</p><p class="ws-aside">No big promises. Clear answers, and a real person to talk to.</p></div></div>');

  // 3. The Saphara difference: three editorial columns on hairlines, not cards
  // Round 2 (23 Nov, Huzaifa: "it needs icons and more images"): each column gets a photo and an icon badge from the site icon set. The panorama under the intro was tried and removed the same day.
  const DIFF = [
    ["We look beyond the headline price.", "Room type, board basis, location and cancellation terms. We line options up like for like, so you can see what a difference in price actually buys.", "compare", "st-why-room.webp", "A freshly slept-in white bed by a window over a city at sunrise"],
    ["We check what matters to you.", "Halal food, alcohol, privacy, prayer space or family set-ups. We ask the hotel rather than assume, then tell you what they said.", "pray", "st-why-mosque.webp", "Masjid Jamek in Kuala Lumpur, its minarets and domes in golden evening light"],
    ["We stay involved after booking.", "Requests, changes and questions while you\'re away. You message the same small team on WhatsApp, and we deal with the hotel.", "chat", "st-why-beach.webp", "An empty sandy beach and turquoise sea below dry hills in Oman"],
  ];
  body += band("sand ws-diff-band", intro(["A little more thought", "goes into your trip."], "Not a complicated process. Just the things we\'d want someone to do for us.") + '<ol class="ws-diff">' + DIFF.map(([t, d, i, img, alt], k) => `<li class="rv" style="--i:${k}"><figure class="ws-diff-ph"><img class="fade" src="${pg.img(img)}" alt="${alt}" width="1200" height="800" loading="lazy" decoding="async"></figure><span class="ws-badge">${ico(i)}</span><h3>${t}</h3><p>${d}</p></li>`).join("") + "</ol>");

  // 4. What Muslim-friendly means: photo beside the existing calm accordion (one open at a time). Wording never implies a hotel is halal, alcohol-free or private unless confirmed.
  const MF = [
    ["dining|Food and dining", "Is halal food available, is it certified, and is it served across the hotel or only on request? We ask, and pass on exactly what the hotel tells us. We never describe a hotel as halal unless that has been confirmed."],
    ["lounge|Alcohol and shared spaces", "Many hotels serve alcohol somewhere. We can ask where it\'s served, whether that includes the main restaurants, and what the pool and shared areas are like, so nothing comes as a surprise."],
    ["pool|Privacy and pools", "For pool villas and terraces, we ask about screening, neighbouring rooms and whether the pool is overlooked, and about women-only pool or gym times where a hotel offers them. We share what the hotel confirms and never promise complete privacy without it."],
    ["pray|Prayer and family needs", "We can ask about prayer mats, qibla direction, a quiet place to pray, connecting rooms, cots and children\'s facilities. If a hotel can\'t help with something, we\'ll tell you before you book."],
  ];
  const mfFaq = faq(MF.map(([q, a]) => { const [i, t] = q.split("|"); return [`<span class="ws-q">${ico(i)}<span>${t}</span></span>`, a]; })).replace('<details class="rv">', '<details class="rv" open>');
  body += band("white ws-mf-band", `<div class="ws-mf"><figure class="ws-mf-photo rv"><img class="fade" src="${pg.img("st-why-corridor.webp")}" alt="A long hotel corridor of carved arches, lanterns and polished marble" width="1200" height="1500" loading="lazy" decoding="async"></figure><div class="ws-mf-copy">${intro(["What does", "“Muslim-friendly”", "mean to you?"], "It means different things to different travellers. We don\'t make assumptions. We ask what matters to you, put specific questions to the hotel and tell you exactly what they confirm.", 4.8)}${mfFaq}</div></div>`, "muslim-friendly");

  // 5. Good advice. No extra fee. The black panel (kept on Why Saphara, LOCKED 22 Nov), photo running to the panel edges.
  body += band("sand ws-money-band", `<div class="ws-money rv"><div class="ws-money-copy"><h2 class="display d-l">${beats(["Good advice.", "No extra fee."], true)}</h2><p>There\'s no Saphara service fee. We compare options like for like and show you where the differences are. If we can\'t improve on a price you\'ve found, we\'ll say so.</p><div class="ws-pay"><h3>${ico("paylater")}<span>Reserve now, pay closer to your holiday</span></h3><p>On eligible free cancellation rates, there\'s nothing to pay when you book. You pay by the payment date on your confirmation, before you travel.</p><p class="pl2-note"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span><b>Eligible free cancellation rates only.</b> Non-refundable rates have different terms and are usually paid when you book.</span></p></div><div class="actions">${split("Plan my trip", planLink(pg), true)}</div></div><figure class="ws-money-ph"><img class="fade" src="${pg.img("st-why-terrace.webp")}" alt="Iron chairs on a sunny terrace above a wide blue bay" width="1400" height="1400" loading="lazy" decoding="async"></figure></div>`, "no-extra-fee");

  // 6. The practical bits: four short facts, each with an icon badge. ATOL wording per brief section 9 (eligible flights and packages only, never hotel-only).
  const FACTS = [
    ["fee", "No service fee", "The price we quote is the price you pay. Nothing is added for our help."],
    ["compare", "Honest comparisons", "The same room, board and cancellation terms side by side, and a straight answer on which is better value."],
    ["people", "Personal WhatsApp support", "Message the people who booked your trip, before you go, while you\'re away and after you\'re home."],
    ["shield", "ATOL on eligible bookings", "Eligible flights and flight-inclusive packages we book are ATOL protected, with an ATOL Certificate. Hotel-only bookings are not ATOL protected."],
  ];
  body += band("white ws-facts-band", intro(["Clear about", "what you’re getting."], "We\'d rather explain exactly what we do than make promises that don\'t hold up.") + '<ul class="ws-facts">' + FACTS.map(([i, t, d], k) => `<li class="rv" style="--i:${k}"><span class="ws-badge">${ico(i)}</span><h3>${t}</h3><p>${d}</p></li>`).join("") + "</ul>");

  // 7. Personal touch: Huzaifa's quote (existing .pq component)
  body += band("sand ws-quote-band", '<div class="pq"><div><blockquote>“You\'ll have our WhatsApp, not a call centre. If the room isn\'t right, message us and we\'ll speak to the hotel. That\'s the job.”</blockquote><p class="by"><b>Huzaifa</b><span>Travel Advisor</span></p></div><div class="pcard photo rv" data-move><img class="fade" src="' + pg.img("st-why-door.webp") + '" alt="A carved wooden door with brass studs, framed by two orange pots, in Stone Town, Zanzibar" width="1100" height="1375" loading="lazy" decoding="async"></div></div>');

  // 8. Closing CTA (existing component, WhatsApp)
  body += cta(pg, ["Let’s start with", "one question."], "Tell us what you\'re considering. We\'ll give you an honest answer, with no pressure to book.", "Message us on " + waGlyph() + "WhatsApp", { cls: "white ws-cta-band", href: waMark("cta") });
  return { path: pg.path, title: "Why book with Saphara Travel | Muslim-owned travel company", desc: "An independent, Muslim-owned travel company. No service fee, honest comparisons, and real people on WhatsApp from the first question to the flight home.", hero: true, body };
}

// ---------- reviews ----------
export function reviewsPage() {
  const pg = new Page("reviews.html");
  let rv = reviews.slice(reviews.indexOf('<div class="bento">'));
  rv = rv.slice(0, rv.lastIndexOf("</div>\n  </div>\n</section>"));
  rv = rv.replace(/<a class="textlink mob-only rv-all"[^>]*>[\s\S]*?<\/a>\s*/, "").split('href="reviews.html"').join('href="https://www.trustpilot.com/review/sapharatravel.co.uk"');
  let body = photoHero(pg, "page-hero-reviews", "Palm trees and granite boulders at Anse Lazio, Seychelles, in soft evening light", ["Word travels."], "What clients say on Trustpilot. Every quote is real and shown in full.", "Plan my trip", "", null, undefined) + crumbBar(pg, [["Reviews", "reviews.html"]]);
  body += band("white after-head", rv);
  body += cta(pg, ["Your turn."], "Tell us where you'd like to go. We'll take it from there.", "Plan my trip");
  return { path: pg.path, title: "Saphara Travel reviews from real travellers", desc: "What travellers say after booking hotels and holidays with Saphara Travel, a Muslim-owned travel company. Real Trustpilot reviews, shown in full.", hero: true, body };
}

// ---------- FAQ ----------
export function faqPage() {
  const pg = new Page("faq.html");
  let body = photoHero(pg, "page-hero-faq", "A covered balcony looking out over a calm sea", ["Frequently asked.", "Honestly answered."], "Still wondering about something? Ask us on WhatsApp.", "Plan my trip", "", null, undefined) + crumbBar(pg, [["FAQ", "faq.html"]]);
  body += band("white after-head", `<div class="prose" style="max-width:860px"><h2>Booking with us</h2>${faq(C.FAQ_Q1)}<h2>Money and protection</h2>${faq(C.FAQ_Q2)}<h2>While you're away</h2>${faq(C.FAQ_Q3)}</div>`);
  body += cta(pg, ["Still wondering?"], "Ask us anything on WhatsApp. A real person replies.", "Plan my trip", { cls: "white continue" });
  return { path: pg.path, title: "Questions about booking with Saphara Travel", desc: "How booking with us works: fees, payment, halal checks, Umrah, ATOL protection on flights and packages, and what happens after you message.", hero: true, body };
}

// ---------- plan my trip ----------
export function planMyTrip() {
  const pg = new Page("plan-my-trip.html");
  const head = photoHero(pg, "page-hero-plan", "Palm trees on a wide beach at sunset", ["Bismillah.", "Let's plan it."], "A few quick questions. Your trip request builds as you go, then opens in WhatsApp, ready to send. On eligible free cancellation rates there's nothing to pay&nbsp;upfront.", "Plan my trip", "", null, "") + crumbBar(pg, [["Plan my trip", "plan-my-trip.html"]]);
  const form = enquiry
    .replace(/(<section class="band sand form-wrap" id="enquire">\s*<div class="col">\s*)<div class="intro">[\s\S]*?<\/div>\s*/, "$1")
        .replace('<div class="checkin">', '<h2 class="sr-only">Your trip request</h2><div class="checkin">');
  const body = head + form + "\n" + band("white", intro(["Prefer to talk?"], 'Message us on WhatsApp with where, roughly when and who\'s coming, or email <a href="mailto:hello@sapharatravel.co.uk">hello@sapharatravel.co.uk</a>. Nothing you type in the form is stored on our website; it opens WhatsApp with your message written out.', null, '<div class="actions" style="margin-top:var(--body-btn)">' + split("Message us on " + waGlyph() + "WhatsApp", waMark("talk")) + "</div>"));
  return { path: pg.path, title: "Plan a Muslim-friendly trip | Saphara Travel", desc: "Tell us where, when and who's coming in a few quick questions. Your trip request opens in WhatsApp, ready to send. Nothing is booked until you say yes.", hero: true, body };
}

// ---------- price check ----------
export function priceCheckPage() {
  const pg = new Page("price-check.html");
  let body = photoHero(pg, "page-hero-pricecheck", "An infinity pool with palm trees by the sea", ["Already found a hotel?", "Second opinions are free."], "Send it over and we'll compare it like for like, and tell you honestly if we can get you a better rate.", "Plan my trip", "", "6.6", split("Check my price", "#check")) + crumbBar(pg, [["Price check", "price-check.html"]]);
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
  body += band("white after-head", `<div class="pc-layout">
<form class="pc-form pc-card rv" id="pcForm" novalidate aria-labelledby="pcFormTitle">
  <h2 class="display d-l" id="pcFormTitle">Check my price.</h2>
  <p class="pc-intro">Four details and we'll take it from there. Your message opens in WhatsApp, ready to send. Nothing is stored on this website.</p>
  <fieldset class="pc-group"><legend><span class="pc-n">1</span>The Hotel</legend>
    <div class="pc-row">
      <div class="fq"><label for="pc-hotel">Hotel Name</label><input class="field" id="pc-hotel" type="text" maxlength="120" autocomplete="off" placeholder="As it's listed" aria-describedby="pc-hotel-e"><p class="err" id="pc-hotel-e" role="alert" hidden></p></div>
      <div class="fq"><label for="pc-dest">Destination <span class="opt">(optional)</span></label><input class="field" id="pc-dest" type="text" maxlength="80" placeholder="For example Zanzibar"></div>
    </div>
  </fieldset>
  <fieldset class="pc-group"><legend><span class="pc-n">2</span>Your Stay</legend>
    <div class="pc-row">
      <div class="fq"><label for="pc-in">Check-In</label><input class="field" id="pc-in" type="date" aria-describedby="pc-in-e"><p class="err" id="pc-in-e" role="alert" hidden></p></div>
      <div class="fq"><label for="pc-out">Check-Out</label><input class="field" id="pc-out" type="date" aria-describedby="pc-out-e"><p class="err" id="pc-out-e" role="alert" hidden></p></div>
    </div>
    <div class="pc-row pc-row-sm">
      <div class="fq"><label for="pc-adults">Adults</label><input class="field" id="pc-adults" type="number" min="1" max="20" value="2" inputmode="numeric"></div>
      <div class="fq"><label for="pc-children">Children</label><input class="field" id="pc-children" type="number" min="0" max="12" value="0" inputmode="numeric"></div>
      <div class="fq"><label for="pc-rooms">Rooms</label><input class="field" id="pc-rooms" type="number" min="1" max="10" value="1" inputmode="numeric"></div>
    </div>
    <div class="fq" id="pcAgesWrap" hidden><label for="pc-ages">Children's Ages <span class="opt">(optional)</span></label><input class="field" id="pc-ages" type="text" maxlength="60" placeholder="For example 4 and 7"></div>
  </fieldset>
  <fieldset class="pc-group"><legend><span class="pc-n">3</span>The Price You Found</legend>
    <div class="pc-row">
      <div class="fq"><label for="pc-price">Total Price</label><div class="pc-money"><select class="field" id="pc-currency" aria-label="Currency"><option>GBP</option><option>USD</option><option>EUR</option><option>SAR</option><option>AED</option><option>QAR</option></select><input class="field" id="pc-price" type="text" inputmode="decimal" maxlength="12" placeholder="For the whole stay" aria-describedby="pc-price-e"></div><p class="err" id="pc-price-e" role="alert" hidden></p></div>
      <div class="fq"><label for="pc-where">Where You Found It <span class="opt">(optional)</span></label><input class="field" id="pc-where" type="text" maxlength="60" placeholder="A website or app"></div>
    </div>
  </fieldset>
  <details class="pc-more">
    <summary>Add room, board and link <span class="opt">(optional, helps us match it exactly)</span></summary>
    <div class="pc-row">
      <div class="fq"><label for="pc-room">Room Type</label><input class="field" id="pc-room" type="text" maxlength="80" placeholder="As shown where you found it"></div>
      <div class="fq"><label for="pc-board">Board</label><select class="field" id="pc-board"><option value="">Not Sure</option><option value="Room only">Room Only</option><option>Breakfast</option><option value="Half board">Half Board</option><option value="Full board">Full Board</option><option value="All inclusive">All Inclusive</option></select></div>
    </div>
    <div class="fq"><label for="pc-link">Link</label><input class="field" id="pc-link" type="url" maxlength="400" placeholder="Paste the link if you have it"></div>
  </details>
  <div class="actions pc-actions"><button class="split" type="submit"><span class="split-label">Send on ${waGlyph()}WhatsApp</span><span class="split-arrow">${arrow}</span></button><p class="caption">Send your screenshot in the same chat.</p></div>
  <p class="small-print" id="pcSent" hidden role="status">WhatsApp should now be open with your message. If it didn't open, message us on +44 7887 353457 and paste the details.</p>
</form>
<aside class="pc-side">
  <div class="pc-quick"><p class="pc-k">Only have a screenshot?</p><p>Send it straight to us on WhatsApp and we'll do the rest.</p>${split(waGlyph("wa-glyph") + "Send a screenshot", waMark("screenshot"), true)}</div>
  <div class="pc-how"><p class="pc-k">How it works</p><ol><li><b>Send the hotel and price</b><span>The form or a screenshot, whichever is easier.</span></li><li><b>We compare like for like</b><span>Same room, board, dates and cancellation terms.</span></li><li><b>We tell you honestly</b><span>If we can do better, we say so. If we can't, we say that too.</span></li></ol></div>
  <div class="pc-what"><p class="pc-k">What we compare</p>${chips(["Room type", "Board basis", "Cancellation terms", "Transfers", "Resort fees", "Deposits"])}</div>
</aside>
</div>
<script src="assets/price-check.js?v=${assetV("price-check.js")}" defer></script>`, "check");
  const example = (priceCheck.match(/<div class="pc-example pcx-home rv"[\s\S]*?<p class="pcx-more">[^<]*<\/p>\s*<\/div>/) || [""])[0].split("pcxTitle").join("pcxTitle2");
  body += band("pc-band pc-result", `<div class="pc2"><div class="intro"><h2 class="display d-l">${beats(["What you get back."])}</h2><p>We reply on WhatsApp with a plain comparison like this one: the price you found, what we found, and what's different.</p><p class="pc-fine">We can't beat every price and we won't promise to. It's a free second opinion from people with access to good rates.</p><div class="actions"><a class="split light" href="#check"><span class="split-label">Check my price</span><span class="split-arrow">${arrow}</span></a></div></div><div class="pcx-wrap">${example}</div></div>`);
  return { path: pg.path, title: "Hotel price check | Saphara Travel", desc: "Found a hotel already? Send it over and we'll compare it like for like and tell you honestly if we can get a better rate.", hero: true, body };
}

// ---------- travel essentials ----------
export function travelEssentials() {
  const pg = new Page("travel-essentials.html");
  let body = photoHero(pg, "page-hero-essentials", "A sheltered lagoon with sandy beaches near Muscat, Oman", ["The useful extras.", "Booked in a few taps."], "Two services we recommend. They're affiliate links: if you book through them we may earn a small commission, at no extra cost to you.", "Plan my trip", "", null, undefined) + crumbBar(pg, [["Travel essentials", "travel-essentials.html"]]);
  body += band("white after-head", '<h2 class="sr-only">Affiliate links</h2><div class="aff-list"><div class="aff rv"><span class="tag">Affiliate link</span><h3>Tours and activities</h3><p>Day trips, guided tours and tickets through Viator. Book what you like, at no extra cost to you.</p><a class="textlink" href="#" rel="sponsored nofollow">Browse tours on Viator <span aria-hidden="true">→</span></a></div><div class="aff rv"><span class="tag">Affiliate link</span><h3>eSIMs for travel</h3><p>Mobile data abroad without hunting for a local SIM, through Airalo.</p><a class="textlink" href="#" rel="sponsored nofollow">Get an eSIM from Airalo <span aria-hidden="true">→</span></a></div></div><p class="small-print">These are affiliate links: we may earn a small commission if you buy through them, at no extra cost to you. It doesn\'t change what we recommend.</p>');
  return { path: pg.path, title: "Travel essentials | Saphara Travel", desc: "Tours, activities and travel eSIMs we recommend. Affiliate links, clearly labelled.", hero: true, body };
}

// ---------- legal ----------
export function legalPage(path) {
  const [p, title, h1, sections, desc] = C.LEGAL.find((l) => l[0] === path);
  // The registered office line stays in content.json as a placeholder; REG_OFFICE (content.json) fills it in.
  const regOffice = C.REG_OFFICE || "";
  const body0 = sections.replace(/<span class="reg-office">([\s\S]*?)<\/span>/g, (m, inner) => (regOffice ? inner.replace("[REGISTERED OFFICE ADDRESS]", regOffice) : ""));
  const pg = new Page(p);
  const body = photoHero(pg, "page-hero-legal", "Turtle Beach in Oman in warm evening light", [h1], desc, "Plan my trip", "", null, "") + crumbBar(pg, [[h1, p]]) + `<section class="band white after-head"><div class="col"><div class="prose legal">${body0}</div></div></section>`;
  return { path: p, title, desc, hero: true, body };
}
export const LEGAL_PATHS = C.LEGAL.map((l) => l[0]);

// ---------- thank you and 404 ----------
export function thankYou() {
  const pg = new Page("thank-you.html");
  const body = photoHero(pg, "page-hero-thanks", "A shaded resort terrace looking out to sea", ["You're checked in.", "The hard bit's ours."], "We'll get back to you on WhatsApp as soon as we can. If your message didn't send, you can WhatsApp us on +44 7887 353457 or email hello@sapharatravel.co.uk.", "Plan my trip", "", null, split("Read a guide while you wait", pg.u("guides/index.html"))) + crumbBar(pg, [["Thank you", "thank-you.html"]])
  return { path: pg.path, title: "Thank you | Saphara Travel", desc: "Your trip request is on its way.", hero: true, body };
}
export function notFound() {
  const pg = new Page("404.html");
  const body = photoHero(pg, "page-hero-404", "The Fanar mosque and Souq Waqif in Doha at dusk", ["This gate has closed.", "Your trip hasn't."], "The page you were looking for isn't here. It may have moved, or the link may be old.", "Plan my trip", "", null, '' + split("Back to the homepage", pg.u("")) ) + crumbBar(pg, [["Page not found", "404.html"]]);
  return { path: pg.path, title: "Page not found | Saphara Travel", desc: "Page not found.", hero: true, body };
}
