/* UK departure airports for the Plan my trip concepts (prototype, 22 Nov 2026).
   Every code is the airport's official three-letter IATA code, typed in by hand. Never derive a code from a name.
   Scope: UK airports with scheduled passenger flights, plus the Crown Dependencies (Jersey, Guernsey, Alderney, Isle of Man),
   which many UK customers fly from. Closed airports (for example Doncaster Sheffield, closed 2022) are left out.
   "LON" is IATA's official city code for all London airports, offered as "Any London airport".
   pop: order in the "Popular" group (lower first). alias: extra words people search by. */
window.UK_AIRPORTS = [
  { iata: "LHR", name: "London Heathrow", place: "London", region: "England", pop: 1 },
  { iata: "MAN", name: "Manchester", place: "Manchester", region: "England", pop: 2 },
  { iata: "LGW", name: "London Gatwick", place: "Crawley, West Sussex", region: "England", pop: 3 },
  { iata: "BHX", name: "Birmingham", place: "Birmingham", region: "England", pop: 4 },
  { iata: "STN", name: "London Stansted", place: "Essex", region: "England", pop: 5 },
  { iata: "LTN", name: "London Luton", place: "Luton, Bedfordshire", region: "England", pop: 6 },
  { iata: "LBA", name: "Leeds Bradford", place: "Leeds", region: "England", pop: 7, alias: "yorkshire bradford" },
  { iata: "GLA", name: "Glasgow", place: "Glasgow", region: "Scotland", pop: 8 },
  { iata: "EDI", name: "Edinburgh", place: "Edinburgh", region: "Scotland", pop: 9 },
  { iata: "EMA", name: "East Midlands", place: "Castle Donington, near Nottingham, Derby and Leicester", region: "England", pop: 10, alias: "nottingham derby leicester" },
  { iata: "NCL", name: "Newcastle International", place: "Newcastle upon Tyne", region: "England", pop: 11 },
  { iata: "LPL", name: "Liverpool John Lennon", place: "Liverpool", region: "England", pop: 12 },
  { iata: "BRS", name: "Bristol", place: "Bristol", region: "England", pop: 13 },
  { iata: "LCY", name: "London City", place: "Docklands, London", region: "England", pop: 14 },
  { iata: "LON", name: "Any London airport", place: "Heathrow, Gatwick, Stansted, Luton, City or Southend", region: "England", pop: 15, alias: "london all airports" },
  { iata: "SEN", name: "London Southend", place: "Southend-on-Sea, Essex", region: "England" },
  { iata: "SOU", name: "Southampton", place: "Southampton", region: "England" },
  { iata: "BOH", name: "Bournemouth", place: "Bournemouth", region: "England" },
  { iata: "EXT", name: "Exeter", place: "Exeter, Devon", region: "England" },
  { iata: "NQY", name: "Cornwall Airport Newquay", place: "Newquay, Cornwall", region: "England" },
  { iata: "NWI", name: "Norwich", place: "Norwich, Norfolk", region: "England" },
  { iata: "HUY", name: "Humberside", place: "Kirmington, near Hull and Grimsby", region: "England", alias: "hull grimsby" },
  { iata: "MME", name: "Teesside International", place: "Darlington, County Durham", region: "England", alias: "durham tees valley middlesbrough" },
  { iata: "ISC", name: "Isles of Scilly (St Mary's)", place: "St Mary's, Isles of Scilly", region: "England", alias: "scilly st marys" },
  { iata: "LEQ", name: "Land's End", place: "St Just, Cornwall", region: "England", alias: "lands end" },
  { iata: "CWL", name: "Cardiff", place: "Rhoose, Vale of Glamorgan", region: "Wales", alias: "wales" },
  { iata: "ABZ", name: "Aberdeen", place: "Aberdeen", region: "Scotland" },
  { iata: "INV", name: "Inverness", place: "Inverness", region: "Scotland", alias: "highlands" },
  { iata: "PIK", name: "Glasgow Prestwick", place: "Prestwick, Ayrshire", region: "Scotland" },
  { iata: "DND", name: "Dundee", place: "Dundee", region: "Scotland" },
  { iata: "KOI", name: "Kirkwall", place: "Kirkwall, Orkney", region: "Scotland", alias: "orkney" },
  { iata: "LSI", name: "Sumburgh", place: "Shetland", region: "Scotland", alias: "shetland" },
  { iata: "SYY", name: "Stornoway", place: "Isle of Lewis", region: "Scotland", alias: "lewis western isles" },
  { iata: "BEB", name: "Benbecula", place: "Benbecula, Outer Hebrides", region: "Scotland", alias: "hebrides" },
  { iata: "BRR", name: "Barra", place: "Isle of Barra", region: "Scotland" },
  { iata: "ILY", name: "Islay", place: "Isle of Islay", region: "Scotland" },
  { iata: "CAL", name: "Campbeltown", place: "Kintyre, Argyll", region: "Scotland" },
  { iata: "TRE", name: "Tiree", place: "Isle of Tiree", region: "Scotland" },
  { iata: "BFS", name: "Belfast International", place: "Aldergrove, County Antrim", region: "Northern Ireland", alias: "northern ireland" },
  { iata: "BHD", name: "George Best Belfast City", place: "Belfast", region: "Northern Ireland", alias: "belfast city northern ireland" },
  { iata: "LDY", name: "City of Derry", place: "Derry~Londonderry", region: "Northern Ireland", alias: "derry londonderry" },
  { iata: "JER", name: "Jersey", place: "St Peter, Jersey", region: "Channel Islands" },
  { iata: "GCI", name: "Guernsey", place: "Forest, Guernsey", region: "Channel Islands" },
  { iata: "ACI", name: "Alderney", place: "Alderney", region: "Channel Islands" },
  { iata: "IOM", name: "Isle of Man", place: "Ronaldsway, Isle of Man", region: "Isle of Man", alias: "ronaldsway douglas" }
];

/* Plan my trip form (Concept C, approved by Huzaifa 22 Nov 2026). Ported from design/form-concepts-2026-11-22/shared/kit.js.
   One answers object per concept, the WhatsApp message builder, and the pieces every concept reuses
   (option tiles, airport picker, travellers, dates, preferences, trip pass, summary rows).
   Nothing is sent anywhere or stored on a server: the message opens in WhatsApp, as on the live site. */
(function () {
  "use strict";
  var WA_NUMBER = "447887353457"; /* the existing business WhatsApp number, as in astro/public/assets/site.js */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* scripted focus after a tap shows no outline; keyboard users keep :focus-visible (as on the live form) */
  /* (site.js already sets the pointer-input class used to hide the outline on headings focused after a tap) */

  /* ---------- options ---------- */
  var TYPES = [
    { v: "Honeymoon", label: "Honeymoon", phrase: "a honeymoon" },
    { v: "Beach and island", label: "Beach & Island", phrase: "a beach holiday" },
    { v: "Family holiday", label: "Family Holiday", phrase: "a family holiday" },
    { v: "Multi-city", label: "Multi-City", phrase: "a multi-city trip" },
    { v: "Umrah", label: "Umrah", phrase: "Umrah" },
    { v: "Hotel only", label: "Hotel Only", phrase: "a hotel stay" },
    { v: "Business travel", label: "Business Travel", phrase: "business travel" },
    { v: "Something else", label: "Something Else", phrase: "a trip" },
    { v: "Not sure yet", label: "Not Sure Yet", phrase: "a trip" }
  ];
  /* Suggested ranges: the brief's five plus a split at the top, because honeymoons and family trips to the Maldives or Mauritius often pass £8,000. */
  var BUDGETS = [
    { v: "Under £2,000", label: "Under £2,000", short: "<£2K" },
    { v: "£2,000 to £4,000", label: "£2,000 to £4,000", short: "£2K to £4K" },
    { v: "£4,000 to £6,000", label: "£4,000 to £6,000", short: "£4K to £6K" },
    { v: "£6,000 to £8,000", label: "£6,000 to £8,000", short: "£6K to £8K" },
    { v: "£8,000 to £12,000", label: "£8,000 to £12,000", short: "£8K to £12K" },
    { v: "Over £12,000", label: "Over £12,000", short: "£12K+" },
    { v: "Not sure yet", label: "Not Sure Yet", short: "TBC" }
  ];
  var STARS = [{ v: "Any", label: "Any" }, { v: "4 star", label: "4 Star" }, { v: "5 star", label: "5 Star" }];
  var BOARDS = [
    { v: "Room only", label: "Room Only" }, { v: "Breakfast", label: "Breakfast" }, { v: "Half board", label: "Half Board" },
    { v: "Full board", label: "Full Board" }, { v: "All inclusive", label: "All Inclusive" }, { v: "Not sure", label: "Not Sure" }
  ];
  var EXTRAS = [
    { v: "Private pool or villa", label: "Private Pool or Villa" },
    { v: "Family-friendly facilities", label: "Family-Friendly Facilities", family: true },
    { v: "Halal food options", label: "Halal Food Options" }
  ];
  var DATE_MODES = [
    { v: "exact", label: "Exact Dates", sub: "I know when" },
    { v: "month", label: "A Rough Month", sub: "Around a month" },
    { v: "flexible", label: "Flexible", sub: "Happy to move" },
    { v: "undecided", label: "Not Decided Yet", sub: "Still thinking" }
  ];
  var LENGTHS = ["A few nights", "About a week", "10 nights", "About two weeks", "Longer", "Not sure"];
  var MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function months(n) { var d = new Date(), out = []; d.setDate(1); d.setMonth(d.getMonth() + 1); for (var i = 0; i < (n || 12); i++) { out.push({ v: MONTH_NAMES[d.getMonth()] + " " + d.getFullYear(), m: MONTH_NAMES[d.getMonth()].slice(0, 3), y: d.getFullYear() }); d.setMonth(d.getMonth() + 1); } return out; }
  var DEST_SUGGEST = {
    "Honeymoon": ["Maldives", "Mauritius", "Seychelles", "Bali", "Zanzibar"],
    "Beach and island": ["Maldives", "Zanzibar", "Turkey", "Mauritius", "Langkawi"],
    "Family holiday": ["Turkey", "Dubai", "Malaysia", "Morocco", "Mauritius"],
    "Multi-city": ["Malaysia and Singapore", "Japan", "Turkey", "Bosnia and Croatia"],
    "Umrah": ["Makkah and Madinah", "Makkah only"],
    "Business travel": ["Dubai", "Doha", "Riyadh", "Kuala Lumpur", "Istanbul"],
    "_": ["Maldives", "Dubai", "Turkey", "Malaysia", "Zanzibar"]
  };
  /* real airport codes for places with one obvious arrival airport; countries with several (Turkey, Malaysia, Japan) show the name only, never a made-up code */
  var PLACES = [["zanzibar","ZNZ"],["maldives","MLE"],["mauritius","MRU"],["seychelles","SEZ"],["bali","DPS"],["langkawi","LGK"],["kuala lumpur","KUL"],["singapore","SIN"],["dubai","DXB"],["abu dhabi","AUH"],["doha","DOH"],["qatar","DOH"],["makkah","JED"],["mecca","JED"],["madinah","MED"],["medina","MED"],["istanbul","IST"],["antalya","AYT"],["dalaman","DLM"],["marrakech","RAK"],["tokyo","TYO"],["sarajevo","SJJ"],["phuket","HKT"],["oman","MCT"],["muscat","MCT"],["malta","MLA"],["sri lanka","CMB"],["cape town","CPT"]];
  function destCode(s) { var l = (s || "").toLowerCase(); for (var i = 0; i < PLACES.length; i++) if (l.indexOf(PLACES[i][0]) > -1) return PLACES[i][1]; return ""; }

  function find(list, v) { for (var i = 0; i < list.length; i++) if (list[i].v === v) return list[i]; return null; }

  /* ---------- answers ---------- */
  function newState() {
    return { type: null, dest: "", destUnsure: false, flights: null, airport: null,
      dateMode: null, checkIn: "", checkOut: "", month: null, flexMonths: [], length: null,
      adults: 2, children: 0, ages: [], rooms: { mode: null, list: [] }, budget: null, stars: null, board: null, extras: [],
      name: "", email: "", notes: "", ref: "STG-" + String(Math.floor(1000 + Math.random() * 9000)) };
  }
  /* realistic example answers (not a real client) to jump straight to a summary */
  function example() {
    var s = newState(), d = new Date(); d.setMonth(d.getMonth() + 4); d.setDate(12);
    var out = new Date(d); out.setDate(out.getDate() + 7);
    s.type = "Family holiday"; s.dest = "Turkey"; s.flights = "need";
    s.airport = airportByCode("MAN"); s.dateMode = "exact"; s.checkIn = iso(d); s.checkOut = iso(out);
    s.adults = 2; s.children = 2; s.ages = ["5", "8"]; s.budget = "£4,000 to £6,000"; s.stars = "5 star"; s.board = "All inclusive";
    s.extras = ["Family-friendly facilities", "Halal food options"]; s.name = "Sana Ahmed"; s.email = "sana.ahmed@example.com"; s.notes = "Connecting rooms if possible.";
    return s;
  }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function parse(s) { var p = (s || "").split("-"); return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null; }
  function nights(s) { var a = parse(s.checkIn), b = parse(s.checkOut); return a && b ? Math.round((b - a) / 864e5) : 0; }

  /* ---------- wording ---------- */
  function listAnd(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]; }
  function ageWord(a) { return a === "0" ? "under 1" : a; }
  function childrenText(n, ages) {
    if (!n) return "";
    var known = (ages || []).slice(0, n).filter(function (a) { return a !== "" && a != null; }).map(ageWord), base = n + (n === 1 ? " child" : " children");
    if (known.length === n) return base + ", aged " + listAnd(known);
    if (!known.length) return base + " (" + (n === 1 ? "age" : "ages") + " to confirm)";
    var left = n - known.length;
    return base + ", aged " + listAnd(known) + " (" + (left === 1 ? "one age" : left + " ages") + " to confirm)";
  }
  function travellersText(s) { var a = s.adults + (s.adults === 1 ? " adult" : " adults"); return s.children ? a + ", " + childrenText(s.children, s.ages) : a; }
  function travellersShort(s) { return s.adults + " AD" + (s.children ? ", " + s.children + " CH" : ""); }
  function fmtDay(d, withYear) { return d.getDate() + " " + MONTH_NAMES[d.getMonth()] + (withYear ? " " + d.getFullYear() : ""); }
  function exactText(s) {
    var a = parse(s.checkIn), b = parse(s.checkOut);
    if (a && b) { var n = nights(s), r;
      if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()) r = a.getDate() + " to " + fmtDay(b, true);
      else if (a.getFullYear() === b.getFullYear()) r = fmtDay(a) + " to " + fmtDay(b, true);
      else r = fmtDay(a, true) + " to " + fmtDay(b, true);
      return r + " (" + n + (n === 1 ? " night)" : " nights)"); }
    if (a) return "From " + fmtDay(a, true);
    return "Exact dates to confirm";
  }
  function lengthText(s) { return s.length && s.length !== "Not sure" ? s.length.charAt(0).toLowerCase() + s.length.slice(1) : ""; }
  function datesText(s) {
    var len = lengthText(s);
    if (s.dateMode === "exact") return exactText(s);
    if (s.dateMode === "month") return (s.month ? "Around " + s.month : "A rough month, to confirm") + (len ? ", " + len : "");
    if (s.dateMode === "flexible") { var sorted = s.flexMonths.slice().sort(monthSort), yrs = sorted.map(function (x) { return x.slice(-4); }).filter(function (y, i, a) { return a.indexOf(y) === i; });
      var m = yrs.length === 1 ? listOr(sorted.map(function (x) { return x.replace(/ \d{4}$/, ""); })) + " " + yrs[0] : listOr(sorted);
      return "Flexible" + (sorted.length ? ", any time in " + m : "") + (len ? ", " + len : ""); }
    return "Not decided yet";
  }
  function listOr(a) { return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " or " + a[a.length - 1]; }
  function monthSort(a, b) { return monthIndex(a) - monthIndex(b); }
  function monthIndex(x) { var p = x.split(" "); return +p[1] * 12 + MONTH_NAMES.indexOf(p[0]); }
  function whenShort(s) {
    if (s.dateMode === "exact") { var a = parse(s.checkIn); return a ? a.getDate() + " " + MONTH_NAMES[a.getMonth()].slice(0, 3) : "TBC"; }
    if (s.dateMode === "month") return s.month ? s.month.slice(0, 3) + " " + s.month.slice(-2) : "TBC";
    if (s.dateMode === "flexible") return "Flexible";
    return s.dateMode === "undecided" ? "TBC" : "";
  }
  function destText(s) { return s.destUnsure || !s.dest.trim() ? "Not sure yet, open to ideas" : s.dest.trim(); }
  function airportText(a) { return a ? (a.iata === "LON" ? "Any London airport (LON)" : a.name + " (" + a.iata + ")") : ""; }
  function prefsText(s) { var p = []; if (s.stars && s.stars !== "Any") p.push(s.stars); if (s.board && s.board !== "Not sure") p.push(s.board); return p.join(", "); }

  /* the WhatsApp message: one line per answer, empty optional lines left out */
  function message(s) {
    var t = find(TYPES, s.type), name = s.name.trim(), L = [];
    L.push("Salaams" + (name ? ", I'm " + name.split(/\s+/)[0] + "." : ".") + " I'd like some help planning " + (t ? t.phrase : "a trip") + ".");
    L.push("");
    if (name) L.push("Name: " + name);
    L.push("Trip type: " + (s.type || "Not sure yet"));
    L.push("Destination: " + destText(s));
    if (s.airport) L.push("Flying from: " + airportText(s.airport));
    if (s.flights) L.push("Flights: " + (s.flights === "booked" ? "Already booked" : "Not booked yet"));
    if (s.type === "Umrah" && s.flights === "need") L.push("Help with a flight itinerary: Yes please");
    L.push("Dates: " + datesText(s));
    L.push("Travellers: " + travellersText(s));
    var rt = roomsText(s); if (rt) L.push("Rooms: " + rt);
    L.push("Budget: " + (s.budget && s.budget !== "Not sure yet" ? s.budget + " for the whole trip" : "Not sure yet"));
    var h = prefsText(s); if (h) L.push("Hotel: " + h);
    var ex = s.extras.filter(function (x) { return x !== "Family-friendly facilities" || s.children > 0 || s.type === "Family holiday"; });
    if (ex.length) L.push("Would like: " + ex.join(", "));
    L.push("Email: " + s.email.trim());
    if (s.notes.trim()) L.push("Notes: " + s.notes.trim().replace(/\s*\n+\s*/g, " "));
    L.push("");
    L.push("Ref: " + s.ref);
    return L.join("\n");
  }
  function waUrl(s) { return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message(s)); }
  /* opens WhatsApp from the tap (new tab on desktop, the app on phones); same tab if a pop-up is blocked (Instagram, Facebook) */
  function openWhatsApp(s) { var url = waUrl(s), w = window.open(url, "_blank"); if (w) { try { w.opener = null; } catch (e) {} } else window.location.href = url; }
  function copyMessage(s, btn) {
    var txt = message(s), done = function () { var o = btn.textContent; btn.textContent = "Copied"; setTimeout(function () { btn.textContent = o; }, 2000); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, function () {}); else { var t = document.createElement("textarea"); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (e) {} t.remove(); }
  }

  /* ---------- checks before sending ---------- */
  function validate(s) {
    var e = {};
    var nm = s.name.trim();
    if (!nm) e.name = "Please add your full name, so we know who to ask for.";
    else if (nm.split(/\s+/).length < 2) e.name = "Please add your surname too, so we can match your booking.";
    if (s.children) for (var i = 0; i < s.children; i++) if (s.ages[i] === "" || s.ages[i] == null) { e.ages = "Please choose an age for each child. Hotels price by age."; break; }
    if (needsRooms(s) && !s.rooms.mode) e.rooms = "Please choose how you'd like the rooms. Suggest for Me is fine.";
    if (needsRooms(s) && s.rooms.mode === "custom") { var p = roomsPlaced(s); if (p.a !== s.adults || p.c !== s.children) e.rooms = "The rooms don't add up to everyone yet. Adjust them, or choose Suggest for Me."; }
    if (s.dateMode === "exact") {
      if (!s.checkIn || !s.checkOut) e.dates = "Please choose both dates, or pick a rough month instead.";
      else if (nights(s) < 1) e.dates = "Check-out needs to be after check-in.";
    }
    if (!s.email.trim()) e.email = "Please add your email, so we can send your options and confirmation.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.email.trim())) e.email = "That email doesn't look quite right. Please check it.";
    return e;
  }

  /* ---------- DOM helpers ---------- */
  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) { var v = attrs[k]; if (v == null || v === false) continue;
      if (k === "class") el.className = v; else if (k === "text") el.textContent = v; else if (k === "html") el.innerHTML = v;
      else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), v); else el.setAttribute(k, v === true ? "" : v); }
    (kids || []).forEach(function (c) { if (c != null) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return el;
  }
  var uid = 0; function id(p) { return (p || "k") + "-" + (++uid); }
  var WA_SVG = '<svg class="wai" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3Z"/></svg>';
  var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

  /* option tiles. opts.multi: toggles values in an array; opts.onPick fires after a single choice (used to move on) */
  function tiles(list, get, set, opts) {
    opts = opts || {};
    var wrap = h("div", { class: opts.cls || "grid2", role: "group", "aria-label": opts.label || null });
    function paint() { var cur = get(); Array.prototype.forEach.call(wrap.children, function (b) { var v = b.getAttribute("data-v"); b.setAttribute("aria-pressed", String(opts.multi ? cur.indexOf(v) > -1 : cur === v)); }); }
    list.forEach(function (o) {
      var b = h("button", { type: "button", class: (opts.tileCls || "tile") + (o.wide ? " wide" : ""), "data-v": o.v, "aria-pressed": "false" }, [o.label]);
      if (o.sub) { b.appendChild(h("small", { text: o.sub })); }
      b.addEventListener("click", function () {
        if (opts.multi) { var cur = get().slice(), i = cur.indexOf(o.v); if (i > -1) cur.splice(i, 1); else cur.push(o.v); set(cur); }
        else set(opts.toggle && get() === o.v ? null : o.v);
        paint(); if (!opts.multi && opts.onPick) opts.onPick(o.v);
      });
      wrap.appendChild(b);
    });
    wrap.paint = paint; paint();
    return wrap;
  }

  /* ---------- airport picker ---------- */
  var AIRPORTS = window.UK_AIRPORTS || [];
  function airportByCode(c) { for (var i = 0; i < AIRPORTS.length; i++) if (AIRPORTS[i].iata === c) return AIRPORTS[i]; return null; }
  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’~]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); }
  function popular() { return AIRPORTS.filter(function (a) { return a.pop; }).sort(function (a, b) { return a.pop - b.pop; }); }
  function searchAirports(q) {
    q = norm(q); if (!q) return null;
    var out = [];
    AIRPORTS.forEach(function (a) {
      var name = norm(a.name), hay = norm(a.name + " " + a.place + " " + a.region + " " + (a.alias || "")), code = a.iata.toLowerCase(), score = -1;
      if (code === q) score = 0;
      else if (name.indexOf(q) === 0) score = 1;
      else if ((" " + hay).indexOf(" " + q) > -1) score = 2;
      else if (q.length >= 2 && code.indexOf(q) === 0) score = 3;
      else if (q.length >= 3 && hay.indexOf(q) > -1) score = 4;
      if (score > -1) out.push({ a: a, s: score });
    });
    out.sort(function (x, y) { return x.s - y.s || (x.a.pop || 99) - (y.a.pop || 99) || x.a.name.localeCompare(y.a.name); });
    return out.map(function (x) { return x.a; });
  }
  function hl(text, q) {
    var t = text.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }); q = (q || "").trim();
    if (q.length < 2) return t;
    var i = t.toLowerCase().indexOf(q.toLowerCase()); return i < 0 ? t : t.slice(0, i) + "<mark>" + t.slice(i, i + q.length) + "</mark>" + t.slice(i + q.length);
  }
  var sheet, sheetState = {};
  function buildSheet() {
    var listId = id("aplist"), inputId = id("apq");
    sheet = h("dialog", { class: "sheet", "aria-labelledby": "ap-title" });
    sheet.innerHTML = '<div class="sheet-in"><div class="sheet-head"><div class="sheet-top"><h2 id="ap-title">Flying from</h2>' +
      '<button type="button" class="sheet-close" aria-label="Close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
      '<label class="sr-only" for="' + inputId + '">Search UK airports by name, city or code</label>' +
      '<input class="field" id="' + inputId + '" type="search" placeholder="Search airport, city or code" autocomplete="off" autocapitalize="off" spellcheck="false" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls="' + listId + '">' +
      '</div><ul class="ap-list" id="' + listId + '" role="listbox" aria-label="UK airports"></ul><p class="sr-only" aria-live="polite" data-live></p></div>';
    document.body.appendChild(sheet);
    var input = sheet.querySelector("input"), list = sheet.querySelector("ul"), live = sheet.querySelector("[data-live]");
    sheet.querySelector(".sheet-close").addEventListener("click", function () { sheet.close(); });
    sheet.addEventListener("click", function (e) { if (e.target === sheet) sheet.close(); });
    sheet.addEventListener("close", function () { if (sheetState.ret) sheetState.ret.focus(); });
    function render() {
      var q = input.value, res = searchAirports(q), cur = sheetState.cur && sheetState.cur.iata; list.innerHTML = ""; sheetState.items = [];
      function group(label, arr) { if (!arr.length) return; list.appendChild(h("li", { class: "ap-group", role: "presentation", text: label })); arr.forEach(item); }
      function item(a) {
        var li = h("li", { class: "ap-opt" + (a.iata === cur ? " is-picked" : ""), role: "option", id: "ap-" + a.iata + "-" + listId, "aria-selected": "false", "data-code": a.iata });
        li.innerHTML = '<span class="code">' + hl(a.iata, q) + '</span><span class="txt"><b>' + hl(a.name, q) + '</b><small>' + hl(a.place, q) + (a.region && a.place.indexOf(a.region) < 0 ? ", " + a.region : "") + '</small></span>';
        li.addEventListener("click", function () { pick(a); });
        list.appendChild(li); sheetState.items.push(li);
      }
      if (res === null) {
        group("Popular", popular());
        ["England", "Scotland", "Wales", "Northern Ireland", "Channel Islands", "Isle of Man"].forEach(function (r) {
          group(r, AIRPORTS.filter(function (a) { return a.region === r && !a.pop; }).sort(function (a, b) { return a.name.localeCompare(b.name); }));
        });
        live.textContent = "";
      } else if (!res.length) {
        list.appendChild(h("li", { class: "ap-empty", role: "presentation", text: "No UK airport matches “" + q.trim() + "”. Try a city, like Manchester, or a code, like MAN." }));
        live.textContent = "No airports found";
      } else { res.forEach(item); live.textContent = res.length + (res.length === 1 ? " airport" : " airports") + " found"; }
      setActive(res && res.length ? 0 : -1);
    }
    function setActive(i) {
      sheetState.active = i;
      sheetState.items.forEach(function (li, j) { li.setAttribute("aria-selected", String(j === i)); });
      if (i > -1 && sheetState.items[i]) { input.setAttribute("aria-activedescendant", sheetState.items[i].id); sheetState.items[i].scrollIntoView({ block: "nearest" }); }
      else input.removeAttribute("aria-activedescendant");
    }
    function pick(a) { var cb = sheetState.onPick; sheet.close(); if (cb) cb(a); }
    input.addEventListener("input", render);
    input.addEventListener("keydown", function (e) {
      var n = sheetState.items.length; if (!n) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(Math.min(n - 1, sheetState.active + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(Math.max(0, sheetState.active - 1)); }
      else if (e.key === "Enter") { e.preventDefault(); var li = sheetState.items[Math.max(0, sheetState.active)]; if (li) pick(airportByCode(li.getAttribute("data-code"))); }
    });
    sheet.render = render; sheet.input = input;
  }
  function openAirportSheet(cur, onPick, ret) {
    if (!sheet) buildSheet();
    sheetState = { cur: cur, onPick: onPick, ret: ret };
    sheet.input.value = ""; sheet.render(); sheet.showModal();
    sheet.querySelector(".ap-list").scrollTop = 0;
    /* on phones, wait for the sheet before raising the keyboard, so the list is visible first */
    if (window.matchMedia("(min-width: 640px)").matches) sheet.input.focus(); else sheet.querySelector(".sheet-close").focus();
  }
  /* a field-like button that shows the chosen airport and opens the search sheet */
  function airportButton(s, onChange, opts) {
    opts = opts || {};
    var b = h("button", { type: "button", class: "ap-btn" + (opts.white ? " white" : ""), "aria-haspopup": "dialog" });
    function paint() {
      var a = s.airport; b.classList.toggle("empty", !a);
      b.innerHTML = '<span class="code">' + (a ? a.iata : "UK") + '</span><span class="txt"><b>' + (a ? a.name : (opts.placeholder || "Choose a UK airport")) + '</b><small>' + (a ? a.place : "Search by airport, city or code") + '</small></span>' + CHEV;
      b.setAttribute("aria-label", a ? "Flying from " + a.name + ", " + a.iata + ". Change airport" : "Choose a UK airport to fly from");
    }
    b.addEventListener("click", function () { openAirportSheet(s.airport, function (a) { s.airport = a; paint(); onChange && onChange("airport"); }, b); });
    b.paint = paint; paint(); return b;
  }
  /* popular airports as big tiles, for the conversational concept */
  function airportTiles(s, onPick, count) {
    var wrap = h("div", { class: "ap-pop", role: "group", "aria-label": "Popular airports" });
    popular().slice(0, count || 9).forEach(function (a) {
      var b = h("button", { type: "button", class: "tile", "data-v": a.iata, "aria-pressed": String(!!(s.airport && s.airport.iata === a.iata)), "aria-label": a.name + ", " + a.iata });
      b.innerHTML = "<b>" + a.iata + "</b><small>" + a.name.replace(/^London /, "") + "</small>";
      b.addEventListener("click", function () { s.airport = a; paintTiles(); onPick(a); });
      wrap.appendChild(b);
    });
    function paintTiles() { Array.prototype.forEach.call(wrap.children, function (b) { b.setAttribute("aria-pressed", String(!!(s.airport && s.airport.iata === b.getAttribute("data-v")))); }); }
    wrap.paint = paintTiles; return wrap;
  }

  /* ---------- destination: suggestions plus a free text box, or "not sure yet" ---------- */
  function destination(s, onChange, opts) {
    opts = opts || {};
    var inId = id("dest"), wrap = h("div", { class: "fq" });
    var input = h("input", { class: "field" + (opts.white ? " white" : ""), id: inId, type: "text", maxlength: "120", autocomplete: "off", placeholder: "A country, city or island", value: s.dest });
    var chips = h("div", { class: "pf-chips", role: "group", "aria-label": "Suggestions" });
    if (opts.label !== false) wrap.appendChild(h("label", { for: inId, text: opts.label || "Where would you like to go?" }));
    wrap.appendChild(input); wrap.appendChild(chips);
    function paint() {
      chips.innerHTML = "";
      (DEST_SUGGEST[s.type] || DEST_SUGGEST._).concat(["Not sure yet"]).forEach(function (d) {
        var unsure = d === "Not sure yet", on = unsure ? s.destUnsure : (!s.destUnsure && s.dest.trim().toLowerCase() === d.toLowerCase());
        var c = h("button", { type: "button", class: "chip", "aria-pressed": String(on) }, [unsure ? "Not Sure Yet" : d]);
        c.addEventListener("click", function () {
          if (unsure) { s.destUnsure = !s.destUnsure; if (s.destUnsure) { s.destPrev = s.dest; s.dest = ""; } else if (s.destPrev) s.dest = s.destPrev; }
          else { s.destUnsure = false; s.dest = on ? "" : d; }
          input.value = s.dest; paint(); onChange && onChange("dest", unsure ? s.destUnsure : !!s.dest);
        });
        chips.appendChild(c);
      });
    }
    input.addEventListener("input", function () { s.dest = input.value; if (s.dest.trim()) s.destUnsure = false; paint(); onChange && onChange("destTyping"); });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter" && opts.onEnter) { e.preventDefault(); opts.onEnter(); } });
    wrap.paint = function () { input.value = s.dest; paint(); }; wrap.input = input; paint();
    return wrap;
  }

  /* ---------- travellers: adults, children and an age picker per child ---------- */
  function travellers(s, onChange, opts) {
    opts = opts || {};
    var wrap = h("div", { class: "steppers" + (opts.compact ? " compact" : "") }), live = h("p", { class: "sr-only", "aria-live": "polite" });
    var ages = h("div", { class: "fq" }), agesGrid = h("div", { class: "ages" }), err = h("p", { class: "err", role: "alert", hidden: true });
    ages.appendChild(h("span", { class: "ql", text: "Children's Ages" })); ages.appendChild(h("p", { class: "hint", text: "Their age on the day you travel. Hotels price by age." })); ages.appendChild(agesGrid); ages.appendChild(err);
    function row(key, label, sub, min) {
      var out = h("output", { text: String(s[key]) }), minus = h("button", { type: "button", "aria-label": "One fewer " + (key === "adults" ? "adult" : "child") }, ["−"]), plus = h("button", { type: "button", "aria-label": "One more " + (key === "adults" ? "adult" : "child") }, ["+"]);
      function set(d) { s[key] = Math.max(min, Math.min(key === "adults" ? 12 : 8, s[key] + d)); paint(); live.textContent = travellersText(s); onChange && onChange("travellers"); }
      minus.addEventListener("click", function () { set(-1); }); plus.addEventListener("click", function () { set(1); });
      var r = h("div", { class: "stepper" }, [h("span", { class: "lab" }, [label, h("small", { text: sub })]), h("span", { class: "ctrl" }, [minus, out, plus])]);
      r.paint = function () { out.textContent = s[key]; minus.disabled = s[key] <= min; plus.disabled = s[key] >= (key === "adults" ? 12 : 8); };
      return r;
    }
    var ra = row("adults", "Adults", "18 and over", 1), rc = row("children", "Children", "Under 18", 0), rm = roomsField(s, onChange, opts);
    wrap.appendChild(ra); wrap.appendChild(rc); wrap.appendChild(ages); wrap.appendChild(rm); wrap.appendChild(live);
    function paint() {
      ra.paint(); rc.paint(); reveal(ages, s.children > 0); rm.paint();
      /* ages beyond the current count are kept, so going 2 > 1 > 2 children brings the second age back */
      while (agesGrid.children.length > s.children) agesGrid.removeChild(agesGrid.lastChild);
      for (var i = agesGrid.children.length; i < s.children; i++) agesGrid.appendChild(ageSelect(i));
      Array.prototype.forEach.call(agesGrid.querySelectorAll("select"), function (sel, j) { sel.value = s.ages[j] == null ? "" : s.ages[j]; });
    }
    function ageSelect(i) {
      var sid = id("age"), sel = h("select", { class: "field" + (opts.white ? " white" : ""), id: sid });
      sel.appendChild(h("option", { value: "", text: "Age" })); sel.appendChild(h("option", { value: "0", text: "Under 1" }));
      for (var a = 1; a <= 17; a++) sel.appendChild(h("option", { value: String(a), text: String(a) }));
      sel.addEventListener("change", function () { s.ages[i] = sel.value; sel.classList.remove("invalid"); if (validate(s).ages == null) err.hidden = true; onChange && onChange("ages"); });
      return h("div", { class: "fq" }, [h("label", { for: sid, text: "Child " + (i + 1) }), sel]);
    }
    wrap.paint = paint;
    wrap.showError = function (msg, which) {
      if (which === "rooms") { rm.showError(msg); return; }
      err.textContent = msg; err.hidden = !msg; Array.prototype.forEach.call(agesGrid.querySelectorAll("select"), function (sel) { sel.classList.toggle("invalid", !!msg && !sel.value); }); var first = agesGrid.querySelector("select.invalid"); if (first) first.focus(); };
    paint(); return wrap;
  }

  /* ---------- room arrangements: asked only for bigger groups (3 or more adults, or 5 or more people) ---------- */
  function needsRooms(s) { return s.adults >= 3 || s.adults + s.children >= 5; }
  function splitRooms(s, n) {
    var list = []; for (var i = 0; i < n; i++) list.push({ a: 0, c: 0 });
    for (var a = 0; a < s.adults; a++) list[a % n].a++;
    for (var c = 0; c < s.children; c++) list[c % n].c++;
    return list;
  }
  function roomsPlaced(s) { var a = 0, c = 0; s.rooms.list.forEach(function (r) { a += r.a; c += r.c; }); return { a: a, c: c }; }
  function roomText(r) { return r.a + (r.a === 1 ? " adult" : " adults") + (r.c ? ", " + r.c + (r.c === 1 ? " child" : " children") : ""); }
  function roomsText(s) {
    if (!needsRooms(s) || !s.rooms.mode) return "";
    if (s.rooms.mode === "one") return "All in one room";
    if (s.rooms.mode === "suggest") return "Happy for you to suggest";
    var l = s.rooms.list; return l.length + (l.length === 1 ? " room" : " rooms") + " (" + l.map(function (r, i) { return "Room " + (i + 1) + ": " + roomText(r); }).join("; ") + ")";
  }
  function roomsField(s, onChange, opts) {
    var box = h("div", { class: "fq rooms" }), err = h("p", { class: "err", role: "alert", hidden: true });
    var modes = tiles([{ v: "one", label: "One Room" }, { v: "custom", label: "Split Into Rooms" }, { v: "suggest", label: "Suggest for Me", wide: true }], function () { return s.rooms.mode; }, function (v) {
      s.rooms.mode = v; if (v === "custom" && !s.rooms.list.length) s.rooms.list = splitRooms(s, Math.max(2, Math.ceil(s.adults / 3))); err.hidden = true; paint(); onChange && onChange("rooms"); }, { label: "Rooms", tileCls: "tile quiet" });
    var listEl = h("div", { class: "room-list" }), placed = h("p", { class: "hint", "aria-live": "polite" });
    var addBtn = h("button", { type: "button", class: "linkbtn", text: "Add another room", onclick: function () { s.rooms.list.push({ a: 1, c: 0 }); paint(); onChange && onChange("rooms"); } });
    var even = h("button", { type: "button", class: "linkbtn", text: "Share everyone out evenly", onclick: function () { s.rooms.list = splitRooms(s, s.rooms.list.length || 2); paint(); onChange && onChange("rooms"); } });
    var custom = h("div", { class: "fq" }, [listEl, placed, h("div", { class: "pf-chips" }, [addBtn, even])]);
    box.appendChild(h("span", { class: "ql", text: "How would you like the rooms?" }));
    box.appendChild(h("p", { class: "hint", text: "Bigger groups often need more than one room. Tell us how you'd like to share." }));
    box.appendChild(modes); box.appendChild(custom); box.appendChild(err);
    function mini(r, key, label, i) {
      var out = h("output", { text: String(r[key]) });
      var minus = h("button", { type: "button", "aria-label": "One fewer " + label + " in room " + (i + 1) }, ["−"]), plus = h("button", { type: "button", "aria-label": "One more " + label + " in room " + (i + 1) }, ["+"]);
      minus.disabled = r[key] <= (key === "a" ? 1 : 0);
      minus.addEventListener("click", function () { r[key]--; err.hidden = true; paint(); onChange && onChange("rooms"); });
      plus.addEventListener("click", function () { r[key]++; err.hidden = true; paint(); onChange && onChange("rooms"); });
      return h("span", { class: "ctrl" }, [minus, out, plus]);
    }
    function paint() {
      reveal(box, needsRooms(s)); modes.paint(); reveal(custom, s.rooms.mode === "custom"); listEl.innerHTML = "";
      s.rooms.list.forEach(function (r, i) {
        var rm = h("button", { type: "button", class: "linkbtn room-x", text: "Remove", "aria-label": "Remove room " + (i + 1), hidden: s.rooms.list.length <= 1 || null, onclick: function () { s.rooms.list.splice(i, 1); paint(); onChange && onChange("rooms"); } });
        var kids = s.children ? h("div", { class: "room-row" }, [h("span", { text: "Children" }), mini(r, "c", "child", i)]) : null;
        listEl.appendChild(h("div", { class: "room" }, [h("div", { class: "room-head" }, [h("b", { text: "Room " + (i + 1) }), rm]), h("div", { class: "room-row" }, [h("span", { text: "Adults" }), mini(r, "a", "adult", i)]), kids]));
      });
      var p = roomsPlaced(s);
      placed.textContent = "Placed " + p.a + " of " + s.adults + " adults" + (s.children ? " and " + p.c + " of " + s.children + (s.children === 1 ? " child" : " children") : "") + ".";
      placed.classList.toggle("err", p.a !== s.adults || p.c !== s.children);
    }
    box.paint = paint;
    box.showError = function (msg) { err.textContent = msg; err.hidden = !msg; if (msg) box.scrollIntoView({ block: "center" }); };
    paint(); return box;
  }

  /* ---------- dates: details for the chosen mode (exact pickers only when "exact") ---------- */
  function dateDetails(s, onChange, opts) {
    opts = opts || {};
    var wrap = h("div", { class: "fq", style: "gap: var(--s-24)" }), white = opts.white ? " white" : "";
    var today = iso(new Date());
    var inId = id("in"), outId = id("out"), err = h("p", { class: "err", role: "alert", hidden: true });
    var cin = h("input", { class: "field" + white, type: "date", id: inId, min: today, value: s.checkIn });
    var cout = h("input", { class: "field" + white, type: "date", id: outId, min: s.checkIn || today, value: s.checkOut });
    var nightsEl = h("p", { class: "hint", "aria-live": "polite" });
    var exact = h("div", { class: "fq" }, [h("div", { class: "dates2" }, [h("div", { class: "fq" }, [h("label", { for: inId, text: "Check-In" }), cin]), h("div", { class: "fq" }, [h("label", { for: outId, text: "Check-Out" }), cout])]), nightsEl, err]);
    function exactPaint() { var n = nights(s); nightsEl.textContent = s.checkIn && s.checkOut && n > 0 ? n + (n === 1 ? " night" : " nights") : ""; cout.min = s.checkIn || today; }
    cin.addEventListener("change", function () { s.checkIn = cin.value; if (s.checkOut && s.checkOut <= s.checkIn) { s.checkOut = ""; cout.value = ""; } cin.classList.remove("invalid"); err.hidden = true; exactPaint(); onChange && onChange("dates");
      if (s.checkIn && !s.checkOut && cout.showPicker) { try { cout.focus(); } catch (e) {} } });
    cout.addEventListener("change", function () { s.checkOut = cout.value; cout.classList.remove("invalid"); err.hidden = true; exactPaint(); onChange && onChange("dates"); });
    var monthList = months(12);
    var monthTiles = tiles(monthList.map(function (m) { return { v: m.v, label: m.m, sub: String(m.y) }; }), function () { return s.month; }, function (v) { s.month = v; onChange && onChange("dates"); }, { cls: "months-grid", tileCls: "tile mtile", label: "Month" });
    var flexTiles = tiles(monthList.map(function (m) { return { v: m.v, label: m.m, sub: String(m.y) }; }), function () { return s.flexMonths; }, function (v) { s.flexMonths = v; onChange && onChange("dates"); }, { cls: "months-grid", tileCls: "tile mtile", multi: true, label: "Months that could work" });
    var lenChips = tiles(LENGTHS.map(function (l) { return { v: l, label: l }; }), function () { return s.length; }, function (v) { s.length = v; onChange && onChange("dates"); }, { cls: "pf-chips", tileCls: "chip", toggle: true, label: "How long" });
    var monthBox = h("div", { class: "fq" }, [h("span", { class: "ql", text: "Which month?" }), monthTiles]);
    var flexBox = h("div", { class: "fq" }, [h("span", { class: "ql" }, ["Any months that could work? ", h("span", { class: "opt", text: "(optional)" })]), flexTiles]);
    var lenBox = h("div", { class: "fq" }, [h("span", { class: "ql" }, ["How long? ", h("span", { class: "opt", text: "(optional)" })]), lenChips]);
    wrap.appendChild(exact); wrap.appendChild(monthBox); wrap.appendChild(flexBox); wrap.appendChild(lenBox);
    function paint() { var m = s.dateMode; reveal(exact, m === "exact"); reveal(monthBox, m === "month"); reveal(flexBox, m === "flexible"); reveal(lenBox, m === "month" || m === "flexible"); reveal(wrap, !!m && m !== "undecided"); cin.value = s.checkIn; cout.value = s.checkOut; exactPaint(); monthTiles.paint(); flexTiles.paint(); lenChips.paint(); }
    wrap.paint = paint;
    wrap.showError = function (msg) { err.textContent = msg; err.hidden = !msg; if (msg) { (!s.checkIn ? cin : cout).classList.add("invalid"); (!s.checkIn ? cin : cout).focus(); } };
    paint(); return wrap;
  }
  function dateModes(s, onChange, opts) {
    opts = opts || {};
    return tiles(DATE_MODES.map(function (d) { return { v: d.v, label: d.label, sub: opts.subs === false ? null : d.sub }; }), function () { return s.dateMode; }, function (v) { s.dateMode = v; onChange && onChange("dateMode", v); }, { cls: opts.cls || "grid2", tileCls: opts.tileCls || "tile", label: "When", onPick: opts.onPick });
  }

  /* ---------- optional preferences ---------- */
  function prefs(s, onChange, opts) {
    opts = opts || {};
    var wrap = h("div", { class: "fq", style: "gap: var(--s-24)" });
    var stars = tiles(STARS, function () { return s.stars; }, function (v) { s.stars = v; onChange && onChange("prefs"); }, { cls: "pf-seg", tileCls: "segbtn", toggle: true, label: "Hotel rating" });
    var board = tiles(BOARDS, function () { return s.board; }, function (v) { s.board = v; onChange && onChange("prefs"); }, { cls: "pf-chips", tileCls: "chip", toggle: true, label: "Meal plan" });
    var extrasBox = h("div");
    function buildExtras() {
      extrasBox.innerHTML = "";
      var show = EXTRAS.filter(function (x) { return !x.family || s.children > 0 || s.type === "Family holiday"; });
      extrasBox.appendChild(tiles(show, function () { return s.extras; }, function (v) { s.extras = v; onChange && onChange("prefs"); }, { cls: "pf-chips", tileCls: "chip", multi: true, label: "Would like" }));
    }
    wrap.appendChild(h("div", { class: "fq" }, [h("span", { class: "ql", text: "Hotel Rating" }), stars]));
    wrap.appendChild(h("div", { class: "fq" }, [h("span", { class: "ql", text: "Meal Plan" }), board]));
    wrap.appendChild(h("div", { class: "fq" }, [h("span", { class: "ql" }, ["Would Be Nice ", h("span", { class: "opt", text: "(choose any)" })]), extrasBox]));
    wrap.paint = function () { stars.paint(); board.paint(); buildExtras(); }; wrap.paint();
    return wrap;
  }

  /* ---------- simple text field bound to an answer ---------- */
  function textField(s, key, label, opts) {
    opts = opts || {};
    var fid = id(key), el = h(opts.area ? "textarea" : "input", { class: "field" + (opts.white ? " white" : ""), id: fid, maxlength: opts.max || (opts.area ? 500 : 80), placeholder: opts.placeholder || "", autocomplete: opts.autocomplete || "off", type: opts.area ? null : (opts.type || "text"), "aria-required": opts.required ? "true" : null, inputmode: opts.inputmode || null, enterkeyhint: opts.enterkeyhint || null });
    el.value = s[key] || "";
    var err = h("p", { class: "err", role: "alert", hidden: true });
    el.addEventListener("input", function () { s[key] = el.value; if (!err.hidden) { el.classList.remove("invalid"); err.hidden = true; } opts.onChange && opts.onChange(key); });
    if (opts.onEnter) el.addEventListener("keydown", function (e) { if (e.key === "Enter" && !opts.area) { e.preventDefault(); opts.onEnter(); } });
    var lab = h("label", { for: fid }, [label]); if (opts.optional) { lab.appendChild(document.createTextNode(" ")); lab.appendChild(h("span", { class: "opt", text: "(optional)" })); }
    var wrap = h("div", { class: "fq" }, [lab, el, err]);
    wrap.input = el; wrap.paint = function () { el.value = s[key] || ""; };
    wrap.showError = function (msg) { err.textContent = msg; err.hidden = !msg; el.classList.toggle("invalid", !!msg); if (msg) el.focus(); };
    return wrap;
  }

  /* ---------- trip pass (the boarding pass summary). Departure shows the chosen airport's IATA code ---------- */
  function pass() {
    var el = h("div", { class: "pass-wrap" });
    el.innerHTML = '<div class="bp" aria-hidden="true"><div class="bp-main"><div class="bp-top"><span class="bp-brand">Saphara</span><span class="bp-kind">Your trip request</span></div>' +
      '<div class="bp-route"><div class="end"><b class="code" data-f="from">UK</b><small data-f="fromName">UK airport</small></div><svg class="arc" viewBox="0 0 120 44" preserveAspectRatio="none"><path d="M4 40 Q60 -8 116 40"/></svg><div class="end to"><b class="code" data-f="to">?</b><small data-f="toName">Where to?</small></div></div>' +
      '<dl class="bp-grid"><div><dt>When</dt><dd data-f="when"></dd></div><div><dt>Travellers</dt><dd data-f="trav"></dd></div><div><dt>Trip</dt><dd data-f="trip"></dd></div><div><dt>Budget</dt><dd data-f="budget"></dd></div><div><dt>Board</dt><dd data-f="board"></dd></div><div><dt>Nights</dt><dd data-f="nights"></dd></div></dl></div>' +
      '<div class="bp-perf"></div><div class="bp-stub"><dl><div><dt>Ref</dt><dd data-f="ref"></dd></div><div><dt>Name</dt><dd data-f="name"></dd></div></dl><span class="bism">Bismillah</span></div></div>';
    return el;
  }
  function paintPass(el, s) {
    function f(k, v) { el.querySelectorAll('[data-f="' + k + '"]').forEach(function (n) { n.textContent = v || ""; }); }
    var a = s.airport, t = find(TYPES, s.type), b = find(BUDGETS, s.budget), code = destCode(s.dest), n = s.dateMode === "exact" ? nights(s) : 0;
    /* fallback with no airport: "UK" (never a code made from letters of a name) */
    f("from", a ? a.iata : "UK"); f("fromName", a ? (a.iata === "LON" ? "Any London airport" : a.name) : (s.flights === "booked" ? "Flights booked" : "UK airport"));
    f("to", s.destUnsure ? "?" : (code || (s.dest.trim() ? "•••" : "?"))); f("toName", s.destUnsure ? "Open to ideas" : (s.dest.trim() || "Where to?"));
    f("when", whenShort(s)); f("trav", travellersShort(s)); f("trip", t ? (t.v === "Not sure yet" ? "TBC" : t.label) : ""); f("budget", b ? b.short : "");
    f("board", s.board ? (s.board === "Not sure" ? "TBC" : s.board) : ""); f("nights", n > 0 ? String(n) : (s.length && s.length !== "Not sure" ? s.length.replace("About ", "~").replace(" nights", "").replace("a week", "7").replace("two weeks", "14") : ""));
    f("ref", s.ref); f("name", s.name.trim());
    el.setAttribute("data-summary", "From " + (a ? a.iata : "UK") + " to " + (s.dest || "not sure yet"));
  }

  /* ---------- summary rows for review screens ---------- */
  function summaryRows(s) {
    var t = find(TYPES, s.type), rows = [
      { k: "Trip", v: t ? t.label : "", edit: "type" },
      { k: "Destination", v: s.destUnsure || !s.dest.trim() ? "Not sure yet" : s.dest.trim(), edit: "dest" },
      { k: "Flying from", v: s.airport ? airportText(s.airport) : (s.flights === "booked" ? "" : ""), edit: "airport", optional: true },
      { k: "Flights", v: s.flights ? (s.flights === "booked" ? "Already booked" : "Not booked yet") : "", edit: "flights", optional: true },
      { k: "Dates", v: s.dateMode ? datesText(s) : "", edit: "dates" },
      { k: "Travellers", v: travellersText(s), edit: "who" },
      { k: "Rooms", v: roomsText(s), edit: "who", optional: true },
      { k: "Budget", v: s.budget ? (s.budget === "Not sure yet" ? "Not sure yet" : s.budget + " for the whole trip") : "", edit: "budget" },
      { k: "Hotel", v: prefsText(s), edit: "prefs", optional: true },
      { k: "Would like", v: s.extras.join(", "), edit: "prefs", optional: true },
      { k: "Name", v: s.name.trim(), edit: "name" },
      { k: "Email", v: s.email.trim(), edit: "name" },
      { k: "Notes", v: s.notes.trim(), edit: "name", optional: true }
    ];
    return rows;
  }
  function summaryList(s, onEdit, opts) {
    opts = opts || {};
    var ul = h("ul", { class: "sum" });
    summaryRows(s).forEach(function (r) {
      if (r.optional && !r.v && !opts.showEmpty) return;
      var li = h("li", null, [h("span", { class: "k", text: r.k }), h("span", { class: "v" + (r.v ? "" : " muted"), text: r.v || "Not answered" })]);
      if (onEdit) li.appendChild(h("button", { type: "button", class: "edit", "aria-label": "Change " + r.k.toLowerCase(), text: "Change", onclick: function () { onEdit(r.edit); } }));
      ul.appendChild(li);
    });
    return ul;
  }

  /* ---------- motion: fields that appear or disappear open and close smoothly (height and fade); instant with reduced motion ---------- */
  var EASE = "cubic-bezier(.2,.7,.2,1)";
  /* run fn once when an animation ends; a timer backs up the finish event (it can be delayed in background tabs) */
  function after(an, ms, fn) { var done = false; function go() { if (done) return; done = true; fn(); } an.onfinish = go; an._t = setTimeout(go, ms + 40); var c = an.cancel.bind(an); an.cancel = function () { done = true; clearTimeout(an._t); c(); }; }
  function canAnimate(el) { return !reduce && el.isConnected && el.parentElement && el.parentElement.getClientRects().length > 0 && typeof el.animate === "function"; }
  function reveal(el, show, instant) {
    if (!el) return;
    if (el._rv) { el._rv.cancel(); el._rv = null; }
    if (show === !el.hidden) return;
    if (instant || !canAnimate(el)) { el.hidden = !show; return; }
    var hgt;
    if (show) {
      el.hidden = false; hgt = el.offsetHeight;
      el._rv = el.animate([{ height: "0px", opacity: 0, overflow: "hidden" }, { height: hgt + "px", opacity: 1, overflow: "hidden" }], { duration: 340, easing: EASE });
      after(el._rv, 340, function () { el._rv = null; });
    } else {
      hgt = el.offsetHeight;
      el._rv = el.animate([{ height: hgt + "px", opacity: 1, overflow: "hidden" }, { height: "0px", opacity: 0, overflow: "hidden" }], { duration: 240, easing: EASE });
      after(el._rv, 240, function () { el.hidden = true; el._rv = null; });
    }
  }
  /* one screen to the next: the old one slides and fades out, the new one slides in, and the height eases between the two */
  function swap(box, el, dir) {
    /* if a change is still running, finish it at once: keep only the newest screen */
    if (box._sw) { box._sw.forEach(function (an) { an.cancel(); }); box._sw = null; box.style.overflow = ""; }
    while (box.children.length > 1) box.removeChild(box.firstElementChild);
    var old = box.lastElementChild;
    if (old) { old.style.position = ""; old.style.opacity = ""; old.inert = false; old.removeAttribute("aria-hidden"); old.style.pointerEvents = ""; }
    if (!old || reduce || typeof box.animate !== "function") { box.innerHTML = ""; box.appendChild(el); if (!old && !reduce && el.animate) el.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 320, easing: EASE }); return; }
    var h0 = box.offsetHeight, x = dir < 0 ? -1 : 1;
    box.style.position = "relative"; box.style.overflow = "clip";
    old.style.position = "absolute"; old.style.left = "16px"; old.style.right = "16px"; old.style.top = "0"; old.style.pointerEvents = "none"; old.setAttribute("aria-hidden", "true"); old.inert = true;
    box.appendChild(el);
    var h1 = el.offsetHeight;
    var a1 = old.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(" + (-28 * x) + "px)" }], { duration: 200, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" });
    var a2 = el.animate([{ opacity: 0, transform: "translateX(" + (28 * x) + "px)" }, { opacity: 1, transform: "none" }], { duration: 380, delay: 120, easing: EASE, fill: "backwards" });
    var a3 = box.animate([{ height: h0 + "px" }, { height: h1 + "px" }], { duration: 420, easing: EASE });
    box._sw = [a1, a2, a3];
    after(a1, 200, function () { if (old.parentNode === box) box.removeChild(old); });
    after(a2, 500, function () { box.style.overflow = ""; box._sw = null; });
    /* keep the top of the form in view, below the fixed header */
    var top = box.getBoundingClientRect().top, head = 96;
    if (top < head) window.scrollTo({ top: window.scrollY + top - head, behavior: "smooth" });
  }

  /* ---------- contact details: full name and email required; a note is optional and folded away ---------- */
  function contact(s, onChange, opts) {
    opts = opts || {};
    var w = h("div", { class: "fq", style: "gap: var(--s-24)" });
    var nm = textField(s, "name", "Full Name", { placeholder: "For example Sana Ahmed", autocomplete: "name", required: true, onChange: onChange, white: opts.white, enterkeyhint: "next", onEnter: function () { em.input.focus(); } });
    var em = textField(s, "email", "Email", { type: "email", inputmode: "email", autocomplete: "email", required: true, placeholder: "name@example.com", onChange: onChange, white: opts.white, enterkeyhint: opts.onDone ? "go" : "done", onEnter: opts.onDone });
    em.insertBefore(h("p", { class: "hint", text: "So we can send your hotel options and booking confirmation." }), em.lastChild);
    var note = textField(s, "notes", "Anything else we should know?", { optional: true, area: true, placeholder: "A special occasion, connecting rooms, an early check-in", onChange: onChange, white: opts.white });
    note.hidden = !s.notes;
    var more = h("button", { type: "button", class: "linkbtn", style: "align-self:flex-start", text: "Add a note (optional)", hidden: !!s.notes || null, onclick: function () { more.hidden = true; reveal(note, true); note.input.focus({ preventScroll: true }); } });
    w.appendChild(nm); w.appendChild(em); w.appendChild(more); w.appendChild(note);
    w.showErrors = function (e) { em.showError(e.email || ""); nm.showError(e.name || ""); if (!e.name && e.email) em.input.focus(); return !!(e.name || e.email); };
    w.paint = function () { nm.paint(); em.paint(); note.paint(); };
    return w;
  }

  /* preview helper: ?example=1 starts with example answers */
  function wantsExample() { return false; } /* the prototype's example answers are off on the live site */

  window.PlanKit = { TYPES: TYPES, BUDGETS: BUDGETS, BOARDS: BOARDS, STARS: STARS, EXTRAS: EXTRAS, DATE_MODES: DATE_MODES, find: find, reduce: reduce,
    newState: newState, example: example, wantsExample: wantsExample, message: message, waUrl: waUrl, openWhatsApp: openWhatsApp, copyMessage: copyMessage, validate: validate,
    childrenText: childrenText, roomsText: roomsText, needsRooms: needsRooms, travellersText: travellersText, datesText: datesText, destText: destText, airportText: airportText, searchAirports: searchAirports, airportByCode: airportByCode, popular: popular,
    h: h, reveal: reveal, swap: swap, contact: contact, tiles: tiles, airportButton: airportButton, airportTiles: airportTiles, openAirportSheet: openAirportSheet, destination: destination, travellers: travellers,
    dateDetails: dateDetails, dateModes: dateModes, prefs: prefs, textField: textField, pass: pass, paintPass: paintPass, summaryList: summaryList, WA_SVG: WA_SVG };
})();

/* ---------- the Plan my trip form: welcome, four grouped steps, review, WhatsApp ---------- */
(function () {
  "use strict";
  var root = document.getElementById("planForm"); if (!root) return;
  var K = window.PlanKit, h = K.h, S = K.newState();
  var stage = document.getElementById("pfStage"), passDesk = K.pass(); document.getElementById("pfPass").appendChild(passDesk);
  var STEPS = [{ id: "trip", label: "Trip" }, { id: "when", label: "When" }, { id: "extras", label: "Budget" }, { id: "you", label: "Details" }];
  var cur = -1, fromReview = false, ARROW = ' <span aria-hidden="true">&rarr;</span>';
  var EMAIL = "hello@sapharatravel.co.uk";

  function live() { K.paintPass(passDesk, S); }
  function hotelOnly() { return S.type === "Hotel only"; }

  function header(i) {
    var top = h("div", { class: "pf-top" }, [h("button", { type: "button", class: "pf-back", html: '<span aria-hidden="true">&larr;</span> Back', onclick: function () { if (i === 4) show(3, -1); else if (fromReview) review(-1); else show(i - 1, -1); } }), h("span", { class: "pf-count", text: i < 4 ? "Step " + (i + 1) + " of 4" : "Review" })]);
    var ol = h("ol", { class: "pf-steps", "aria-label": "Progress" });
    STEPS.forEach(function (s, j) { ol.appendChild(h("li", { class: j < i ? "done" : j === i ? "on" : "", "aria-current": j === i ? "step" : null }, [h("span", { text: s.label })])); });
    return [top, ol];
  }
  function mount(el, dir) { K.swap(stage, el, dir); var f = el.querySelector(".q"); if (f && dir !== 0) f.focus({ preventScroll: true }); live(); }
  function gq(label, kids, opt) { var g = h("div", { class: "gq" }, [h("span", { class: "ql" }, [label, opt ? h("span", { class: "opt", text: " (optional)" }) : null])]); kids.forEach(function (k) { if (k) g.appendChild(k); }); return g; }

  function welcome() {
    cur = -1;
    var el = h("section", { class: "pf-welcome", "aria-labelledby": "pf-w" }, [
      h("h3", { class: "q", id: "pf-w", tabindex: "-1", text: "Four quick steps." }),
      h("p", { class: "pf-lead", text: "Mostly taps. You'll see your trip request before anything opens in WhatsApp." }),
      h("ol", null, [
        h("li", null, [h("div", null, [h("b", { text: "The trip. " }), h("span", { text: "What kind, and where if you know." })])]),
        h("li", null, [h("div", null, [h("b", { text: "When and who. " }), h("span", { text: "Rough dates are fine." })])]),
        h("li", null, [h("div", null, [h("b", { text: "Flights and budget. " }), h("span", { text: "Only if you want to say." })])]),
        h("li", null, [h("div", null, [h("b", { text: "Your details. " }), h("span", { text: "Your name and email." })])])
      ]),
      h("div", { class: "foot" }, [h("button", { type: "button", class: "btn btn-primary btn-block", html: "Start" + ARROW, onclick: function () { show(0, 1); } }), h("p", { class: "pf-small", text: "Not sure about anything yet? That's fine. Every question has a “not sure” answer." })])
    ]);
    mount(el, 0);
  }

  function show(i, dir) {
    if (i < 0) { welcome(); return; }
    cur = i; var st = STEPS[i], el = h("section", { class: "pf-panel", "aria-labelledby": "pf-h-" + st.id }), parts = {}, nextBtn;
    header(i).forEach(function (n) { el.appendChild(n); });
    var groups = h("div", { class: "groups g-" + st.id }), check = function () { return true; };
    if (st.id === "trip") {
      el.appendChild(h("h3", { class: "q", id: "pf-h-trip", tabindex: "-1", text: "What are you planning?" }));
      var destBox = h("div", { hidden: !S.type || null });
      parts.type = K.tiles(K.TYPES.map(function (t) { return { v: t.v, label: t.label, wide: t.v === "Not sure yet" }; }), function () { return S.type; }, function (v) { S.type = v; }, { label: "Trip type", onPick: function () { var was = destBox.hidden; K.reveal(destBox, true); parts.dest.paint(); live(); if (was) setTimeout(function () { destBox.scrollIntoView({ behavior: K.reduce ? "auto" : "smooth", block: "nearest" }); }, 360); } });
      parts.dest = K.destination(S, live, { label: false });
      destBox.appendChild(gq("Where would you like to go?", [parts.dest]));
      groups.appendChild(parts.type); groups.appendChild(destBox);
      parts.err = h("p", { class: "err", role: "alert", hidden: true }); groups.appendChild(parts.err);
      check = function () { if (!S.type) { parts.err.textContent = "Choose a trip type, or Not Sure Yet."; parts.err.hidden = false; return false; } return true; };
    }
    if (st.id === "when") {
      el.appendChild(h("h3", { class: "q", id: "pf-h-when", tabindex: "-1", text: "When, and who's coming?" }));
      var whoBox = gq("Who's travelling?", []);
      parts.dates = K.dateDetails(S, live);
      parts.modes = K.dateModes(S, function () { parts.dates.paint(); K.reveal(whoBox, !!S.dateMode); live(); });
      groups.appendChild(gq("When are you thinking?", [parts.modes, parts.dates]));
      parts.who = K.travellers(S, live); whoBox.appendChild(parts.who); whoBox.hidden = !S.dateMode;
      groups.appendChild(whoBox);
      check = function () { var e = K.validate(S); if (!S.dateMode) K.reveal(whoBox, true); if (e.dates) { parts.dates.showError(e.dates); return false; } if (e.ages) { parts.who.showError(e.ages); return false; } if (e.rooms) { parts.who.showError(e.rooms, "rooms"); return false; } return true; };
    }
    if (st.id === "extras") {
      el.appendChild(h("h3", { class: "q", id: "pf-h-extras", tabindex: "-1", text: hotelOnly() ? "Your budget" : "Flights and budget" }));
      el.appendChild(h("p", { class: "sub", text: hotelOnly() ? "Optional, but it helps us suggest the right hotels." : "Both optional, but they help us suggest the right hotels." }));
      if (!hotelOnly()) {
        var apBox = h("div", { hidden: S.flights !== "need" || null }), note = h("p", { class: "note", text: "We can help you find a good flight itinerary for Umrah, but we don't book Umrah flights.", hidden: !(S.type === "Umrah" && S.flights === "need") || null });
        parts.flights = K.tiles([{ v: "need", label: "Not Yet" }, { v: "booked", label: "Already Booked" }], function () { return S.flights; }, function (v) { S.flights = v; }, { label: "Flights", toggle: true, onPick: function () { K.reveal(apBox, S.flights === "need"); K.reveal(note, S.type === "Umrah" && S.flights === "need"); live(); } });
        apBox.appendChild(gq("Which airport would you fly from?", [K.airportButton(S, live)]));
        groups.appendChild(gq("Have you booked flights?", [parts.flights, note, apBox]));
      }
      groups.appendChild(gq(hotelOnly() ? "Rough budget for the whole stay" : "Rough budget for the whole trip", [h("p", { class: "hint", text: "Everyone included. A rough idea is fine." }), K.tiles(K.BUDGETS.map(function (b) { return { v: b.v, label: b.label, wide: b.v === "Not sure yet" }; }), function () { return S.budget; }, function (v) { S.budget = v; live(); }, { label: "Budget", toggle: true })]));
      var disc = h("details", { class: "pf-disc" }, [h("summary", { text: "Hotel preferences (optional)" }), h("div", { class: "pf-disc-body" }, [K.prefs(S, live)])]);
      if (S.stars || S.board || S.extras.length) disc.open = true;
      groups.appendChild(disc);
    }
    if (st.id === "you") {
      el.appendChild(h("h3", { class: "q", id: "pf-h-you", tabindex: "-1", text: "How can we reach you?" }));
      el.appendChild(h("p", { class: "sub", text: "We'll reply on WhatsApp and send your options by email." }));
      parts.contact = K.contact(S, live, { onDone: function () { nextBtn.click(); } });
      groups.appendChild(parts.contact);
      check = function () { return !parts.contact.showErrors(K.validate(S)); };
    }
    el.appendChild(groups);
    nextBtn = h("button", { type: "button", class: "btn btn-primary btn-block", html: (fromReview ? "Save and review" : i === 3 ? "Review my request" : "Continue") + ARROW, onclick: function () { if (!check()) return; if (fromReview || i === 3) review(1); else show(i + 1, 1); } });
    el.appendChild(h("div", { class: "foot" }, [nextBtn]));
    mount(el, dir);
  }

  function review(dir) {
    var e = K.validate(S);
    if (!S.type) { fromReview = true; show(0, -1); return; }
    if (e.ages || e.rooms || e.dates) { fromReview = true; show(1, -1); return; }
    if (e.name || e.email) { fromReview = true; show(3, -1); return; }
    cur = 4; fromReview = true;
    var el = h("section", { class: "pf-panel", "aria-labelledby": "pf-h-rv" });
    header(4).forEach(function (n) { el.appendChild(n); });
    el.appendChild(h("h3", { class: "q", id: "pf-h-rv", tabindex: "-1", text: "Your trip request" }));
    el.appendChild(h("p", { class: "sub", text: "Check it over and change anything. Nothing is sent until you press Send in WhatsApp." }));
    var groups = h("div", { class: "groups pf-review" }), pm = K.pass(); pm.classList.add("pf-pass-mob"); K.paintPass(pm, S); groups.appendChild(pm);
    var rows = {}; K.summaryList(S, null).querySelectorAll("li").forEach(function (li) { rows[li.querySelector(".k").textContent] = li; });
    [["Trip", 0, ["Trip", "Destination"]], ["When and who", 1, ["Dates", "Travellers", "Rooms"]], [hotelOnly() ? "Budget" : "Flights and budget", 2, ["Flying from", "Flights", "Budget", "Hotel", "Would like"]], ["Your details", 3, ["Name", "Email", "Notes"]]].forEach(function (sec) {
      var ul = h("ul", { class: "sum" }); sec[2].forEach(function (k) { if (rows[k] && !(hotelOnly() && (k === "Flying from" || k === "Flights"))) ul.appendChild(rows[k]); });
      if (!ul.children.length) return;
      groups.appendChild(h("div", { class: "rv-sec" }, [h("div", { class: "rv-sec-h" }, [h("h4", { text: sec[0] }), h("button", { type: "button", text: "Edit", "aria-label": "Edit " + sec[0].toLowerCase(), onclick: function () { show(sec[1], -1); } })]), ul]));
    });
    var pre = h("pre", { class: "wa-preview", hidden: true, text: K.message(S) });
    var tog = h("button", { type: "button", class: "linkbtn", style: "align-self:flex-start", "aria-expanded": "false", text: "Show the WhatsApp message", onclick: function () { pre.hidden = !pre.hidden; tog.setAttribute("aria-expanded", String(!pre.hidden)); tog.textContent = pre.hidden ? "Show the WhatsApp message" : "Hide the message"; } });
    groups.appendChild(tog); groups.appendChild(pre); el.appendChild(groups);
    el.appendChild(h("div", { class: "foot" }, [
      h("button", { type: "button", class: "btn btn-wa", html: K.WA_SVG + "Send on WhatsApp", onclick: function () { K.openWhatsApp(S); sent(); } }),
      h("p", { class: "pf-small pf-center", text: "Nothing you type here is stored on our website. It opens WhatsApp with your message written out." })
    ]));
    mount(el, dir);
  }
  function sent() {
    var el = h("section", { class: "pf-panel", "aria-labelledby": "pf-h-sent" }, [
      h("h3", { class: "q pf-sent-h", id: "pf-h-sent", tabindex: "-1", html: '<span class="beat">Your message is ready.</span> <span class="beat">One last tap.</span>' }),
      h("p", { class: "sub", text: "WhatsApp should have opened with your trip request. Tap Send in WhatsApp to complete your enquiry. We won't receive it until you send it." })
    ]);
    var pm = K.pass(); pm.classList.add("pf-pass-mob"); K.paintPass(pm, S);
    var tip = h("p", { class: "note", text: "Inside Instagram? If WhatsApp doesn't open, tap the three dots and choose Open in browser.", hidden: !/Instagram|FBAN|FBAV/i.test(navigator.userAgent) || null });
    el.appendChild(h("div", { class: "groups" }, [pm, tip]));
    var copy = h("button", { type: "button", class: "linkbtn", text: "Copy message", onclick: function () { K.copyMessage(S, copy); } });
    var mail = h("button", { type: "button", class: "linkbtn", text: "Email it instead", onclick: function () { window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Trip request " + S.ref) + "&body=" + encodeURIComponent(K.message(S)); } });
    el.appendChild(h("div", { class: "foot" }, [
      h("a", { class: "btn btn-light", href: K.waUrl(S), target: "_blank", rel: "noopener", html: K.WA_SVG + "Open WhatsApp again" }),
      h("p", { class: "pf-small pf-center", text: "WhatsApp didn't open?" }),
      h("div", { class: "pf-alt" }, [copy, mail]),
      h("button", { type: "button", class: "linkbtn", style: "align-self:center", text: "Back to my request", onclick: function () { review(-1); } })
    ]));
    mount(el, 1);
  }

  /* trip shortcuts: ?trip=Honeymoon (trip pages), ?dest=Doha (destination pages), and on-page Plan my trip links */
  var ALIAS = { "Umrah hotels": "Umrah", "City or multi-centre": "Multi-city" };
  function setTrip(t) { t = ALIAS[t] || t; if (K.find(K.TYPES, t)) { S.type = t; return true; } return false; }
  var qs = new URLSearchParams(window.location.search), qd = qs.get("dest"), qt = qs.get("trip");
  if (qd) S.dest = qd.slice(0, 120);
  if (qt && setTrip(qt)) show(0, 0); else welcome();
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-plan], a[data-trip]"); if (!a) return;
    e.preventDefault();
    var t = a.getAttribute("data-trip");
    if (t && setTrip(t)) { fromReview = false; show(0, 1); }
    else if (cur === -1) { /* stay on the welcome */ }
    var y = root.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: K.reduce ? "auto" : "smooth" });
    setTimeout(function () { var b = stage.querySelector(".q"); if (b) b.focus({ preventScroll: true }); }, K.reduce ? 0 : 500);
  });
  window.sbPlan = { state: S, show: show, review: review, message: function () { return K.message(S); } };
})();
