/* Shared script for the Saphara site. Source of truth since the Astro migration. */

(function () {
  var root = document.documentElement, reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.classList.add("js");
  /* 21 Nov 2026 (Huzaifa): iOS Safari can ring a heading that the form focuses by script after a tap.
     While the last input was a pointer, those headings get no outline; any key press brings keyboard focus styles back. */
  document.addEventListener("pointerdown", function () { root.classList.add("pointer-input"); }, true);
  document.addEventListener("keydown", function () { root.classList.remove("pointer-input"); }, true);
  /* a page opened from a link always starts at the top (some in-app viewers carry the old scroll position over); back and forward keep theirs */
  (function () {
    var nav = window.performance && performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
    if (location.hash || (nav && nav.type === "back_forward")) return;
    var moved = false, top = function () { if (!moved && window.scrollY > 0) window.scrollTo({ top: 0, left: 0, behavior: "instant" }); };
    ["wheel", "touchstart", "keydown"].forEach(function (t) { window.addEventListener(t, function () { moved = true; }, { once: true, passive: true }); });
    top(); document.addEventListener("DOMContentLoaded", top); window.addEventListener("load", function () { top(); setTimeout(top, 60); });
    window.addEventListener("pageshow", function (e) { if (!e.persisted) top(); });
  })();
  if (!root.lang) root.lang = "en-GB"; /* the build sets <html lang="en-GB"> directly */

  /* if Kensington can't load (for example inside a Claude preview), use the normal-size system fallback instead of the size-matched one */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(function () { if (!document.fonts.check('600 40px "kensington"')) root.classList.add("no-kensington"); }, 1200); });

  /* icons */
  var ICONS = {
    "Honeymoon": '<circle cx="9" cy="14" r="5"/><circle cx="15" cy="14" r="5"/><path d="M10.5 5.5 12 4l1.5 1.5L12 7z"/>',
    "Beach and island": '<path d="M4 11a8 8 0 0 1 16 0z"/><path d="M12 11v8"/><path d="M3 21c1.5-1 3-1 4.5 0s3 1 4.5 0 3-1 4.5 0 3 1 4.5 0"/>',
    "Family holiday": '<circle cx="6.5" cy="6.5" r="2.5"/><path d="M3 20v-5a3.5 3.5 0 0 1 7 0v5"/><circle cx="14" cy="6.5" r="2.5"/><path d="M10.5 20v-5a3.5 3.5 0 0 1 7 0v5"/><circle cx="20" cy="11.5" r="1.6"/><path d="M18 20v-3a2 2 0 0 1 4 0v3"/>',
    "Multi-city": '<path d="M3 21h18"/><path d="M5 21V9h5v12"/><path d="M10 21V4h5v17"/><path d="M15 21v-9h4v9"/><path d="M12 8h1M12 11h1M12 14h1M7 12h1M7 15h1"/>',
    "Umrah hotels": '<path d="M12 3v2"/><path d="M7 13c0-3.2 2.6-4.6 5-7 2.4 2.4 5 3.8 5 7"/><path d="M5 13h14v8H5z"/><path d="M10.5 21v-3a1.5 1.5 0 0 1 3 0v3"/>',
    "Business travel": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7"/><path d="M3 12.5h18"/>',
    "Hotel only": '<path d="M3 6v14"/><path d="M3 15h18v5"/><path d="M21 15v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="12" r="1.8"/>',
    "Something else": '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M12 8.5v5M9.5 11h5"/>',
    "transfers": '<path d="M5 11l1.6-4.2A1.5 1.5 0 0 1 8 6h8a1.5 1.5 0 0 1 1.4.8L19 11"/><rect x="3" y="11" width="18" height="6" rx="1.5"/><path d="M6 17v2M18 17v2"/>',
    "guides": '<path d="M5 21V4"/><path d="M5 4h11l-2 3.5L16 11H5"/>',
    "excursions": '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    "hotel": '<path d="M6 4h3l1.5 4.5-2 1.5a10 10 0 0 0 5.5 5.5l1.5-2L20 15v3a2 2 0 0 1-2 2A15 15 0 0 1 4 6a2 2 0 0 1 2-2z"/>',
    "chat": '<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M7 9h10M7 12h6"/>',
    "flights": '<path d="M2.5 13.5 10 11V5.5a2 2 0 0 1 4 0V11l7.5 2.5V15L14 13.5V18l2 1.5V21l-4-1-4 1v-1.5L10 18v-4.5L2.5 15z"/>',
    "team": '<circle cx="6" cy="8" r="2.2"/><circle cx="12" cy="7" r="2.4"/><circle cx="18" cy="8" r="2.2"/><path d="M2.5 19a3.5 3.5 0 0 1 7 0M8 19a4 4 0 0 1 8 0M14.5 19a3.5 3.5 0 0 1 7 0"/>',
    "invoice": '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 11h6M9 14h6M9 17h4"/>',
    "people": '<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M15 4.5h5.5a1 1 0 0 1 1 1V9a1 1 0 0 1-1 1H18l-2 1.6V10h-1a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1z"/>',
    "fee": '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.4"/><path d="M10 16l6-6"/>',
    "paylater": '<rect x="3" y="5" width="13" height="13" rx="2"/><path d="M3 9.5h13M7 3v4M12 3v4"/><circle cx="17" cy="16.5" r="4.5"/><path d="M17 14.5v2.2l1.4 1"/>',
    "shield": '<path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6z"/><path d="m9 12 2 2 4-4"/>',
    "compass": '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    "pin": '<path d="M12 21s-6-5.3-6-11a6 6 0 0 1 12 0c0 5.7-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>'
  };
  function svg(n) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[n] || "") + '</svg>'; }
  document.querySelectorAll("[data-ico]").forEach(function (el) { el.outerHTML = svg(el.getAttribute("data-ico")); });

  /* images fade in over their blurred placeholder */
  document.querySelectorAll("img.fade").forEach(function (im) {
    function done() { im.classList.add("loaded"); }
    if (im.complete && im.naturalWidth) done(); else im.addEventListener("load", done, { once: true });
  });

  /* ATOL: short line, full approved wording on tap */
  var more = document.querySelector("#why .more");
  if (more) more.addEventListener("click", function () { var f = document.getElementById("atolFull"), open = f.hidden; f.hidden = !open; more.setAttribute("aria-expanded", String(open)); more.textContent = open ? "Hide details" : "How protection works"; });

  /* header slims down after the top; bottom bar shows after the hero and hides near the form and footer */
  var hdr = document.getElementById("hdr"), sticky = document.getElementById("sticky"), hero = document.getElementById("hero");
  var nearEnd = { form: false, footer: false };
  var endIO = new IntersectionObserver(function (es) { es.forEach(function (e) { nearEnd[e.target.id === "footer" ? "footer" : "form"] = e.isIntersecting; }); update(); }, { rootMargin: "0px 0px -15% 0px" });
  ["enquire", "footer"].forEach(function (id) { var el = document.getElementById(id); if (el) endIO.observe(el); });
  function update() {
    var y = window.scrollY;
    hdr.classList.toggle("slim", y > 8);
    var past = hero ? hero.getBoundingClientRect().bottom < 0 : y > 420;
    var on = past && !nearEnd.form && !nearEnd.footer && window.innerWidth < 1024;
    hdr.classList.toggle("bar-on", on);
    if (sticky) { sticky.classList.toggle("on", on); sticky.querySelectorAll("a").forEach(function (a) { a.tabIndex = on ? 0 : -1; }); }
  }

  /* hotel names: tap or click pauses and resumes */
  var mq = document.querySelector(".marquee"); if (mq) mq.addEventListener("click", function () { mq.classList.toggle("paused"); });

  /* Trips dropdown: opens on hover and click, closes on Escape, outside click or when focus leaves */
  var dd = document.querySelector(".dd"), ddBtn = dd.querySelector(".dd-btn"), ddT;
  function ddSet(v) { if (v) dd.querySelectorAll("img[data-src]").forEach(function (im) { im.src = im.getAttribute("data-src"); im.removeAttribute("data-src"); }); dd.classList.toggle("open", v); ddBtn.setAttribute("aria-expanded", String(v)); }
  if (window.matchMedia("(hover: hover)").matches) {
    dd.addEventListener("mouseenter", function () { clearTimeout(ddT); ddSet(true); });
    dd.addEventListener("mouseleave", function () { ddT = setTimeout(function () { ddSet(false); }, 200); });
  }
  ddBtn.addEventListener("click", function () { ddSet(ddBtn.getAttribute("aria-expanded") !== "true"); });
  dd.addEventListener("focusout", function (e) { if (!dd.contains(e.relatedTarget)) ddSet(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && dd.classList.contains("open")) { ddSet(false); ddBtn.focus(); } });
  document.addEventListener("click", function (e) { if (!dd.contains(e.target)) ddSet(false); });
  dd.querySelectorAll(".dd-tile").forEach(function (t) { t.addEventListener("click", function () { ddSet(false); }); });

  /* reveals: fade and rise once, with a short stagger inside grids */
  var revealIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
  var groups = new Map();
  /* text under each section headline follows it in, one line after another (round 4) */
  if (!reduce) document.querySelectorAll(".band .intro > p, .band .intro > .actions, .band .intro > .pc-k, .band .intro > .chips, .band .intro > .biz-list").forEach(function (el) { if (!el.closest(".rv")) el.classList.add("rv", "rv-text"); });
  document.querySelectorAll(".rv").forEach(function (el) {
    var key = el.parentNode, n = groups.get(key) || 0; groups.set(key, n + 1);
    el.style.setProperty("--i", Math.min(n, 5));
    if (reduce || el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in"); else revealIO.observe(el);
  });

  /* pay later card: card rises, £0, then the steps in turn; once, skipped for reduced motion (15 Nov) */
  var pl2 = document.querySelector("[data-pl2]");
  if (pl2 && !reduce && "IntersectionObserver" in window) {
    pl2.classList.add("pl2-anim");
    var plIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { pl2.classList.add("in"); plIO.disconnect(); } }); }, { threshold: .25 });
    requestAnimationFrame(function () { plIO.observe(pl2); });
  }

  if (!reduce) {
    root.classList.add("js-motion");
    /* headlines rise word by word */
    var wIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("words-in"); wIO.unobserve(e.target); } }); }, { rootMargin: "0px 0px -10% 0px" });
    document.querySelectorAll(".band .intro > h2.display").forEach(function (h) {
      if (h.getBoundingClientRect().top < window.innerHeight) return;
      var n = 0; h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
      (function walk(node) { Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3) { var frag = document.createDocumentFragment(); ch.textContent.split(/([ \t\n\r]+)/).forEach(function (p) { if (!p) return; if (/^[ \t\n\r]+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; } var w = document.createElement("span"); w.className = "w"; w.setAttribute("aria-hidden", "true"); var s = document.createElement("span"); s.textContent = p; s.style.setProperty("--wi", n++); w.appendChild(s); frag.appendChild(w); }); node.replaceChild(frag, ch); }
        else if (ch.nodeType === 1) walk(ch); }); })(h);
      h.classList.add("words"); wIO.observe(h);
    });
    /* worked example: prices count up from £0, once */
    var cIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; cIO.unobserve(e.target);
      e.target.querySelectorAll("[data-count]").forEach(function (el, k) { var to = +el.getAttribute("data-count"), t0 = 0, dur = 800;
        function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - p, 3))); el.textContent = "£" + v.toLocaleString("en-GB"); if (p < 1) requestAnimationFrame(step); }
        setTimeout(function () { requestAnimationFrame(step); }, 200 + k * 100); }); }); }, { threshold: .35 });
    document.querySelectorAll(".pcx-home").forEach(function (box) { box.querySelectorAll("[data-count]").forEach(function (el) { el.setAttribute("aria-label", el.textContent); el.textContent = "£0"; }); cIO.observe(box); });
    /* coloured bands (price check, business) ease in as they arrive */
    var bandIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("band-in"); bandIO.unobserve(e.target); } }); }, { rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".pc-band, .biz-band").forEach(function (b) { if (b.getBoundingClientRect().top < window.innerHeight * .94) b.classList.add("band-in"); else bandIO.observe(b); });
    /* step lines draw across */
    var sIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("drawn"); sIO.unobserve(e.target); } }); }, { rootMargin: "0px 0px -10% 0px" });
    document.querySelectorAll(".steps li").forEach(function (li, i) { li.style.setProperty("--i", i); sIO.observe(li); });
    /* message bubbles appear one by one */
    var bIO = new IntersectionObserver(function (es) { es.forEach(function (e) { if (!e.isIntersecting) return; bIO.unobserve(e.target); e.target.querySelectorAll(".bub").forEach(function (b, i) { setTimeout(function () { b.classList.remove("wait"); }, 250 + i * 850); }); }); }, { threshold: .4 });
    document.querySelectorAll("[data-bubbles]").forEach(function (w) { w.querySelectorAll(".bub").forEach(function (b) { b.classList.add("wait"); }); bIO.observe(w); });
  }

  /* scroll loop: progress line, hero softening, gentle photo movement (parallax only on large screens with a mouse) */
  var progress = document.getElementById("progress"), heroPic = hero && hero.querySelector("picture"), heroCol = hero && hero.querySelector(".col");
  /* hero video: load after the page, the right size for the screen; not for reduced motion or data saver */
  var heroVid = hero && hero.querySelector(".hero-video");
  if (heroVid) {
    var saveData = navigator.connection && navigator.connection.saveData;
    if (!saveData && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var startVid = function () {
        heroVid.src = matchMedia("(min-width: 768px)").matches ? heroVid.dataset.d : heroVid.dataset.m;
        heroVid.addEventListener("playing", function () { heroVid.classList.add("on"); }, { once: true });
        var p = heroVid.play(); if (p && p.catch) p.catch(function () {});
      };
      if (document.readyState === "complete") startVid(); else window.addEventListener("load", startVid, { once: true });
    }
  }
  var ring = document.querySelector(".badge-spin svg.ring");
  var bigMouse = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
  var movers = [];
  if (!reduce) document.querySelectorAll("[data-move]").forEach(function (el) { var im = el.querySelector("img"); if (im) movers.push({ el: el, img: im, on: false }); });
  var mIO = new IntersectionObserver(function (es) { es.forEach(function (e) { movers.forEach(function (m) { if (m.el === e.target) m.on = e.isIntersecting; }); }); }, { rootMargin: "15% 0px 15% 0px" });
  movers.forEach(function (m) { mIO.observe(m.el); });
  var ticking = false, vh = window.innerHeight;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function frame() {
    ticking = false; update();
    if (reduce) return;
    var y = window.scrollY, docH = document.documentElement.scrollHeight - vh;
    if (progress) progress.style.transform = "scaleX(" + (docH > 0 ? clamp(y / docH, 0, 1) : 0).toFixed(4) + ")";
    var hh = hero ? hero.offsetHeight : 1, hp = clamp(y / hh, 0, 1);
    if (hero && heroPic && hp < 1) { heroPic.style.transform = "scale(" + (1 + hp * .04).toFixed(4) + ")"; if (heroVid) heroVid.style.transform = heroPic.style.transform; heroCol.style.opacity = (1 - hp * .8).toFixed(3); }
    if (ring) ring.style.rotate = (y * .1).toFixed(1) + "deg";
    var par = bigMouse.matches;
    movers.forEach(function (m) {
      /* Phones and tablets: photos stay still (mobile audit 22 Nov 2026). The scale-on-scroll made every card photo grow and shrink while you scrolled or swiped. LOCKED: parallax in photo cards is for desktop with a mouse only. */
      if (!m.on || !par) return;
      var r = m.el.getBoundingClientRect();
      var c = clamp(((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
      m.img.style.transform = par ? "translate3d(0," + (c * r.height * .06).toFixed(1) + "px,0) scale(1.14)" : "scale(" + (1 + Math.abs(c) * .06).toFixed(4) + ")";
    });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener("resize", function () { vh = window.innerHeight; frame(); });
  frame();

  /* links to other pages load ahead on hover or tap (for the guide pages in the build) */
  function prefetch(e) { var a = e.target.closest && e.target.closest("a[href]"); if (!a || a.dataset.pf || a.origin !== location.origin || a.hash && a.pathname === location.pathname) return; a.dataset.pf = 1; var l = document.createElement("link"); l.rel = "prefetch"; l.href = a.href; document.head.appendChild(l); }
  document.addEventListener("pointerover", prefetch, { passive: true }); document.addEventListener("touchstart", prefetch, { passive: true });

  /* ---------- enquiry flow: check-in with a live trip request pass (only where the form is on the page) ---------- */
  if (document.getElementById("flow")) {
  var NIGHT = ["Under £150", "£150 to £300", "£300 to £500", "£500 and over", "Not sure"];
  var TRIP = ["Under £2,000", "£2,000 to £4,000", "£4,000 to £7,000", "£7,000 and over", "Not sure"];
  var BOARDS = ["Room only", "Breakfast", "Half board", "Full board", "All inclusive", "Not sure"];
  var TYPES = ["Honeymoon", "Beach and island", "Family holiday", "Multi-city", "Umrah hotels", "Business travel", "Hotel only", "Something else"];
  var ARRANGE = [["Hotels", "Hotel only"], ["Airport transfers", "transfers"], ["Tour guides", "guides"], ["Excursions", "excursions"], ["Something else", "Something else"]];
  /* real IATA codes for places we're asked about; otherwise the country or place name */
  var PLACES = [["zanzibar","ZNZ","Zanzibar"],["maldives","MLE","Maldives"],["male","MLE","Maldives"],["doha","DOH","Doha"],["qatar","DOH","Doha, Qatar"],["salwa","DOH","Doha, Qatar"],["dubai","DXB","Dubai"],["abu dhabi","AUH","Abu Dhabi"],["ras al khaimah","RKT","Ras Al Khaimah"],["makkah","JED","Jeddah for Makkah"],["mecca","JED","Jeddah for Makkah"],["madinah","MED","Madinah"],["medina","MED","Madinah"],["jeddah","JED","Jeddah"],["riyadh","RUH","Riyadh"],["oman","MCT","Muscat, Oman"],["muscat","MCT","Muscat, Oman"],["seychelles","SEZ","Seychelles"],["mauritius","MRU","Mauritius"],["langkawi","LGK","Langkawi"],["kuala lumpur","KUL","Kuala Lumpur"],["malaysia","KUL","Kuala Lumpur"],["singapore","SIN","Singapore"],["phuket","HKT","Phuket"],["bali","DPS","Bali"],["lombok","LOP","Lombok"],["istanbul","IST","Istanbul"],["oludeniz","DLM","Dalaman for Ölüdeniz"],["ölüdeniz","DLM","Dalaman for Ölüdeniz"],["dalaman","DLM","Dalaman"],["antalya","AYT","Antalya"],["marrakech","RAK","Marrakech"],["agadir","AGA","Agadir"],["sarajevo","SJJ","Sarajevo"],["bosnia","SJJ","Sarajevo"],["cape town","CPT","Cape Town"],["bahrain","BAH","Bahrain"],["japan","TYO","Tokyo"],["tokyo","TYO","Tokyo"],["sri lanka","CMB","Colombo"],["malta","MLA","Malta"],["amsterdam","AMS","Amsterdam"]];
  var st = { type: null, flights: null, arrange: [], month: null, adults: 2, children: 0, budget: null, board: null };
  var REF = "STG-" + String(Math.floor(1000 + Math.random() * 9000));
  var flow = document.getElementById("flow"), stage = document.getElementById("stage");
  var steps = {}; flow.querySelectorAll(".fstep").forEach(function (s) { steps[s.getAttribute("data-step")] = s; });
  var current = "type", backBtn = document.getElementById("back"), countEl = document.getElementById("count"), sizeTimer;
  var routeFill = document.getElementById("routeFill"), routePlane = document.getElementById("routePlane"), routeTo = document.getElementById("routeTo");
  var pass = document.getElementById("pass"), passWrap = document.getElementById("passWrap"), passCol = document.getElementById("passCol");
  var desk = window.matchMedia("(min-width: 1024px)");
  function seq() { var s = ["type"]; if (st.type !== "Hotel only") s.push("flights"); if (st.type !== "Hotel only" && st.flights === "yes") s.push("arrange"); s.push("wherewhen", "who"); if (st.type !== "Business travel") s.push("budget", "board"); s.push("name"); return s; }
  function perNight() { return st.type === "Hotel only" || st.type === "Umrah hotels" || (st.type !== "Hotel only" && st.flights === "yes"); }
  function needFlights() { return st.type && st.type !== "Hotel only" && st.flights === "no"; }
  function hotelMode() { return st.type === "Hotel only" || (st.type !== "Hotel only" && st.flights === "yes"); }
  function dest() {
    var w = (document.getElementById("f-where").value || "").trim(), lw = w.toLowerCase();
    for (var i = 0; i < PLACES.length; i++) if (lw.indexOf(PLACES[i][0]) > -1) return { code: PLACES[i][1], name: PLACES[i][2] };
    if (w && !/not sure|no idea|anywhere|somewhere|don't know|dont know/i.test(w)) { var words = w.split(/[,\s]+/).filter(Boolean); if (words.length <= 2 && words[0].length <= 9) return { code: words[0].toUpperCase(), name: w }; return { code: "?", name: w }; }
    if (w) return { code: "?", name: w };
    if (st.type === "Umrah hotels") return { code: "JED", name: "Jeddah for Makkah" };
    return null;
  }
  function travellers() { return st.adults + " adult" + (st.adults > 1 ? "s" : "") + (st.children ? ", " + st.children + " child" + (st.children > 1 ? "ren" : "") : ""); }
  function shortMonth() { if (!st.month) return ""; if (st.month === "not sure yet") return "Not sure"; var p = st.month.split(" "); return p[0].slice(0, 3) + " " + p[1]; }
  var lastVals = {};
  function setField(f, v) {
    pass.querySelectorAll('[data-f="' + f + '"]').forEach(function (el) {
      el.textContent = v || ""; el.classList.toggle("empty", !v);
      if (v && lastVals[f] !== v && !reduce) { el.classList.remove("stamp"); void el.offsetWidth; el.classList.add("stamp"); }
    });
    lastVals[f] = v;
  }
  function barcode() {
    var g = document.getElementById("barcode"), x = 0, h = 0, out = "";
    for (var i = 0; i < REF.length; i++) h = (h * 31 + REF.charCodeAt(i)) >>> 0;
    while (x < 120) { h = (h * 1103515245 + 12345) >>> 0; var w = 1 + (h >> 16) % 3; if (w > 0) out += '<rect x="' + x + '" y="0" width="' + w + '" height="36"/>'; /* a width of 0 or less draws nothing anyway (and logs an error), so skip it; the spacing maths below is unchanged */ x += w + 1 + ((h >> 20) % 2); }
    g.innerHTML = out;
  }
  function flip(toKey) {
    if (pass.classList.contains("key") === toKey) return;
    if (reduce) { pass.classList.toggle("key", toKey); return; }
    pass.animate([{ transform: "rotateY(0deg)", opacity: 1 }, { transform: "rotateY(90deg)", opacity: .4 }], { duration: 240, easing: "cubic-bezier(.5,0,.75,0)" }).onfinish = function () {
      pass.classList.toggle("key", toKey);
      pass.animate([{ transform: "rotateY(-90deg)", opacity: .4 }, { transform: "rotateY(0deg)", opacity: 1 }], { duration: 380, easing: "cubic-bezier(.2,.7,.2,1)" });
    };
  }
  function updatePass(final) {
    var d = dest(), touched = seq().indexOf(current) > seq().indexOf("wherewhen") || current === "preview" || current === "sent";
    setField("to", d ? d.code : ""); setField("toName", d ? d.name : (touched ? "Somewhere we'll suggest" : ""));
    pass.querySelectorAll('[data-f="to"]').forEach(function (el) { var n = d ? d.code.length : 1; el.style.fontSize = n <= 3 ? "" : n <= 5 ? "48px" : n <= 7 ? "38px" : "30px"; });
    if (!d) pass.querySelectorAll('[data-f="to"]').forEach(function (el) { el.textContent = "?"; el.classList.remove("empty"); });
    if (routeTo) routeTo.textContent = d ? (d.code.length > 5 ? d.code.slice(0, 5) : d.code) : "?"; if (routeTo) routeTo.classList.toggle("pending", !d);
    setField("when", shortMonth() ? shortMonth() + (document.getElementById("f-flex").checked ? " · Flex" : "") : "");
    var whoDone = seq().indexOf(current) > seq().indexOf("who") || current === "preview" || current === "sent";
    setField("travellers", whoDone ? travellers() : "");
    setField("board", st.type === "Business travel" ? "" : (st.board || (final ? "Not sure" : "")));
    setField("trip", st.type || "");
    setField("budget", st.type === "Business travel" ? "" : (st.budget || (final ? "Not sure" : "")));
    setField("flights", st.type === "Hotel only" ? "Not needed" : st.flights === "yes" ? "Booked" : st.flights === "no" ? (st.type === "Umrah hotels" ? "Itinerary help" : "Needed") : "");
    setField("nights", final ? "TBC" : "");
    setField("ref", REF); setField("route", "Home → " + (d ? d.code : "?"));
    flip(hotelMode());
  }
  function routeProgress() {
    /* 21 Nov 2026 (Huzaifa): the moving plane strip was removed from the forms; the step count stays */
    if (!routeFill) return;
    var s = seq(), i = s.indexOf(current), frac = (current === "preview" || current === "sent") ? 1 : Math.max(0, i) / s.length;
    routeFill.style.width = (frac * 100) + "%";
    if (routePlane) routePlane.style.left = "calc(" + (frac * 100) + "% - " + (frac * (routePlane.offsetWidth || 24)) + "px)";
  }
  function updateTop() {
    var s = seq(), i = s.indexOf(current);
    countEl.textContent = (current === "preview" || current === "sent") ? "Ready to send" : "Step " + (i + 1) + " of " + s.length;
    backBtn.disabled = current === "type" || current === "sent";
    routeProgress(); updatePass(current === "preview" || current === "sent");
  }
  function placePass() {
    /* phones: the full pass appears on the last steps; desktop: it stays beside the form */
    var slot = current === "preview" ? document.getElementById("passSlot") : current === "sent" ? document.getElementById("passSlot2") : null;
    if (!desk.matches && slot) { if (passWrap.parentNode !== slot) slot.appendChild(passWrap); }
    else if (passWrap.parentNode !== passCol) passCol.appendChild(passWrap);
  }
  desk.addEventListener ? desk.addEventListener("change", placePass) : desk.addListener(placePass);
  function scrollToFlow(focusEl) {
    var top = flow.getBoundingClientRect().top + window.scrollY - (hdr.offsetHeight + 16);
    if (Math.abs(window.scrollY - top) > 4) window.scrollTo({ top: top, behavior: reduce ? "auto" : "smooth" });
    if (focusEl) focusEl.focus({ preventScroll: true });
  }
  /* between steps the form stays where it is: focus moves without scrolling, and the page only
     scrolls (smoothly) if the new question would be hidden under the header or below the screen */
  function keepInView(el) {
    if (!el) return;
    el.focus({ preventScroll: true });
    var hh = hdr.offsetHeight, r = el.getBoundingClientRect();
    if (r.top < hh + 8 || r.top > window.innerHeight - 160) {
      window.scrollTo({ top: flow.getBoundingClientRect().top + window.scrollY - hh - 16, behavior: reduce ? "auto" : "smooth" });
    }
  }
  function show(name, dir) {
    if (name === "wherewhen") document.getElementById("fromWrap").hidden = !needFlights();
    if (name === current) return;
    var from = steps[current], to = steps[name], h0 = stage.offsetHeight;
    from.classList.remove("on"); to.classList.add("on");
    current = name; placePass();
    if (!reduce) {
      var h1 = to.offsetHeight; clearTimeout(sizeTimer);
      stage.classList.remove("sizing"); stage.style.height = h0 + "px"; void stage.offsetHeight; stage.classList.add("sizing"); stage.style.height = h1 + "px";
      sizeTimer = setTimeout(function () { stage.classList.remove("sizing"); stage.style.height = ""; }, 460);
      from.classList.add("leave"); from.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateX(" + (dir < 0 ? 24 : -24) + "px)" }], { duration: 260, easing: "cubic-bezier(.2,.7,.2,1)" }).onfinish = function () { from.classList.remove("leave"); };
      to.animate([{ opacity: 0, transform: "translateX(" + (dir < 0 ? -24 : 24) + "px)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" });
    }
    updateTop();
    if (name === "preview") {
      var d = dest();
      document.getElementById("passSummary").textContent = "Your trip request, ref " + REF + ": " + (st.type || "trip") + (d ? " to " + d.name : "") + ", " + (st.month || "dates not sure yet") + ", " + travellers() + (st.board ? ", " + st.board : "") + ".";
    }
    keepInView(to.querySelector(".fstep-q, h3"));
  }
  function next() {
    if (current === "name") { var n = document.getElementById("f-name"); if (!n.value.trim()) { document.getElementById("e-name").hidden = false; n.setAttribute("aria-invalid", "true"); n.focus(); return; } document.getElementById("e-name").hidden = true; n.removeAttribute("aria-invalid"); buildPreview(); show("preview", 1); return; }
    var s = seq(), nxt = s[s.indexOf(current) + 1]; if (!nxt) return;
    if (nxt === "budget") buildBudget();
    if (nxt === "wherewhen") document.getElementById("umrahNote").hidden = !(st.type === "Umrah hotels" && st.flights === "no");
    show(nxt, 1);
  }
  function back() { if (current === "preview") { show("name", -1); return; } var s = seq(), i = s.indexOf(current); if (i > 0) show(s[i - 1], -1); }
  backBtn.addEventListener("click", back);
  flow.querySelectorAll("[data-next]").forEach(function (b) { b.addEventListener("click", next); });
  function auto(fn) { setTimeout(fn, reduce ? 0 : 380); }
  function pressOnly(c, btn) { c.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === btn)); }); }
  function tile(label, icon, id) { var b = document.createElement("button"); b.type = "button"; b.className = "opt-tile"; b.id = id; b.setAttribute("aria-pressed", "false"); b.setAttribute("data-label", label); b.innerHTML = (icon ? svg(icon) : "") + "<span>" + label.replace(/-/g, "\u2011") + "</span>"; return b; }
  var typeTiles = document.getElementById("typeTiles");
  TYPES.forEach(function (t, i) { var b = tile(t, t, "tile-" + i); b.addEventListener("click", function () { st.type = t; pressOnly(typeTiles, b); updatePass(); auto(next); }); typeTiles.appendChild(b); });
  steps.flights.querySelectorAll("[data-fl]").forEach(function (b) { b.addEventListener("click", function () { st.flights = b.getAttribute("data-fl"); pressOnly(b.parentNode, b); b.parentNode.setAttribute("data-v", st.flights); updatePass(); auto(next); }); });
  var arrangeTiles = document.getElementById("arrangeTiles");
  ARRANGE.forEach(function (a, i) { var b = tile(a[0], a[1], "ar-" + i); b.addEventListener("click", function () { b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true")); st.arrange = Array.prototype.filter.call(arrangeTiles.children, function (x) { return x.getAttribute("aria-pressed") === "true"; }).map(function (x) { return x.getAttribute("data-label"); }); }); arrangeTiles.appendChild(b); });
  var boardTiles = document.getElementById("boardTiles");
  BOARDS.forEach(function (bd, i) { var b = tile(bd, null, "board-" + i); b.addEventListener("click", function () { st.board = bd; pressOnly(boardTiles, b); updatePass(); auto(next); }); boardTiles.appendChild(b); });
  var monthsEl = document.getElementById("months"), MN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"], now = new Date();
  for (var k = 0; k < 12; k++) (function (k) { var d = new Date(now.getFullYear(), now.getMonth() + k, 1); var b = document.createElement("button"); b.type = "button"; b.className = "month"; b.id = "m-" + k; b.setAttribute("aria-pressed", "false"); b.setAttribute("aria-label", FULL[d.getMonth()] + " " + d.getFullYear()); b.innerHTML = MN[d.getMonth()] + "<small>" + d.getFullYear() + "</small>"; b.addEventListener("click", function () { st.month = FULL[d.getMonth()] + " " + d.getFullYear(); pressOnly(monthsEl, b); updatePass(); }); monthsEl.appendChild(b); })(k);
  var ns = document.createElement("button"); ns.type = "button"; ns.className = "month wide"; ns.id = "m-unsure"; ns.textContent = "Not sure yet"; ns.setAttribute("aria-pressed", "false"); ns.addEventListener("click", function () { st.month = "not sure yet"; pressOnly(monthsEl, ns); updatePass(); }); monthsEl.appendChild(ns);
  document.getElementById("f-where").addEventListener("input", function () { updatePass(); });
  steps.wherewhen.addEventListener("focusin", function () { document.getElementById("fromWrap").hidden = !needFlights(); });
  document.getElementById("f-flex").addEventListener("change", function () { updatePass(); });
  document.querySelectorAll("[data-step-n]").forEach(function (b) { b.addEventListener("click", function () {
    var key = b.getAttribute("data-step-n"), min = key === "adults" ? 1 : 0; st[key] = Math.max(min, Math.min(12, st[key] + +b.getAttribute("data-d")));
    var out = document.getElementById("o-" + key); out.textContent = st[key]; if (!reduce) { out.classList.remove("bump"); void out.offsetWidth; out.classList.add("bump"); }
    document.querySelectorAll('[data-step-n="' + key + '"][data-d="-1"]').forEach(function (m) { m.disabled = st[key] <= min; }); document.getElementById("whoLive").textContent = "Adults: " + st.adults + ", children: " + st.children;
    document.getElementById("agesWrap").hidden = st.children === 0; }); });
  function buildBudget() { var el = document.getElementById("budgetTiles"), r = perNight() ? NIGHT : TRIP; document.getElementById("budgetSub").textContent = (perNight() ? "Per night for the hotel." : "For the whole trip.") + " Optional."; el.innerHTML = ""; st.budget = null;
    r.forEach(function (x, i) { var b = tile(x, null, "bud-" + i); if (x === "Not sure") { b.classList.add("center"); b.style.gridColumn = "1 / -1"; } b.addEventListener("click", function () { st.budget = x; pressOnly(el, b); auto(next); }); el.appendChild(b); }); }
  function buildPreview() {
    var val = function (id) { return document.getElementById(id).value.trim(); };
    var when = val("f-dates") || (st.month === "not sure yet" || !st.month ? "Not sure yet" : st.month);
    if (document.getElementById("f-flex").checked) when += " (flexible)";
    var ages = val("f-ages"), hotelOnly = st.type === "Hotel only", L = [
      "Salaams, I'd like to enquire about a trip.",
      "Name: " + val("f-name"),
      "Destination: " + val("f-where"),
      "Dates: " + when,
      "Trip type: " + (st.type || "")
    ];
    if (!hotelOnly && st.flights) L.push("Flights already booked: " + (st.flights === "yes" ? "Yes" : "No"));
    if (!hotelOnly && st.flights === "yes") L.push("Please arrange: " + (st.arrange.length ? st.arrange.join(", ") : "Not sure yet"));
    if (st.type === "Umrah hotels" && st.flights === "no") L.push("Help with a flight itinerary: Yes please");
    if (needFlights()) L.push("Flying from: " + val("f-from"));
    L.push("Travellers: " + travellers() + (ages ? " (ages " + ages + ")" : ""));
    if (st.type !== "Business travel") { L.push("Budget" + (perNight() ? " per night" : "") + ": " + (st.budget || "Not sure")); L.push("Meal plan: " + (st.board || "Not sure")); }
    L.push("Notes: " + val("f-notes"));
    L.push("Email: " + val("f-email"));
    L.push("Ref: " + REF);
    document.getElementById("preview").textContent = L.join("\n");
  }
  var showMsg = document.getElementById("showMsg");
  showMsg.addEventListener("click", function () { var pv = document.getElementById("preview"), open = pv.hidden; pv.hidden = !open; showMsg.setAttribute("aria-expanded", String(open)); showMsg.textContent = open ? "Hide the message" : "Show the message"; });
  var WA_NUMBER = "447887353457";
  function message() { return document.getElementById("preview").textContent; }
  function waLink() { return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message()); }
  document.getElementById("send").addEventListener("click", function () {
    /* WhatsApp opens straight from the tap (a new tab on desktop, the app on phones); the stub tears off meanwhile */
    var url = waLink(), win = window.open(url, "_blank");
    if (win) { try { win.opener = null; } catch (err) {} }
    var finish = function () { pass.classList.add("sent"); show("sent", 1); if (!win) window.location.href = url; };
    if (reduce) { finish(); return; }
    if (pass.classList.contains("key")) {
      pass.querySelector(".kc").animate([{ transform: "none" }, { transform: "translateY(10px) scale(.98)" }, { transform: "none" }], { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" }).onfinish = finish;
    } else {
      document.getElementById("stub").animate([{ transform: "none", opacity: 1, offset: 0 }, { transform: "translateY(-3px) rotate(-1.5deg)", opacity: 1, offset: .18, easing: "cubic-bezier(.4,0,1,1)" }, { transform: "translate(10px, 56px) rotate(9deg)", opacity: 0, offset: 1 }], { duration: 600, fill: "forwards" }).onfinish = finish;
    }
  });

  /* in-app browsers (Instagram, Facebook) can block WhatsApp links: show a short tip */
  if (/Instagram|FBAN|FBAV/i.test(navigator.userAgent)) document.querySelectorAll(".inapp-tip").forEach(function (t) { t.hidden = false; });

  /* if WhatsApp didn't open: copy the message, or email it */
  document.getElementById("copyMsg").addEventListener("click", function () {
    var b = this, done = function () { b.textContent = "Copied"; document.getElementById("copyStatus").textContent = "Message copied. Paste it into WhatsApp or an email."; setTimeout(function () { b.textContent = "Copy message"; }, 2500); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(message()).then(done, fallbackCopy); else fallbackCopy();
    function fallbackCopy() { var t = document.createElement("textarea"); t.value = message(); t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0"; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); done(); } catch (err) {} t.remove(); }
  });
  document.getElementById("emailMsg").addEventListener("click", function () {
    window.location.href = "mailto:hello@sapharatravel.co.uk?subject=" + encodeURIComponent("Trip request " + REF) + "&body=" + encodeURIComponent(message());
  });

  /* every Plan my trip goes smoothly to the form and focuses the first question; trip shortcuts pre-select the type */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-plan], a[data-trip]"); if (!a) return;
    e.preventDefault();
    var t = a.getAttribute("data-trip");
    if (t) { st.type = t; var b = Array.prototype.find.call(typeTiles.children, function (x) { return x.getAttribute("data-label") === t; }); if (b) pressOnly(typeTiles, b); show(seq()[1], 1); return; }
    if (current === "type") scrollToFlow(typeTiles.querySelector("button")); else scrollToFlow(steps[current].querySelector("button:not([disabled]), input"));
  });
  /* arriving from a destination page (?dest=Doha): the destination is filled in */
  var qd = new URLSearchParams(window.location.search).get("dest");
  if (qd) { document.getElementById("f-where").value = qd.slice(0, 120); updatePass(); }
  /* arriving from a trip page (?trip=Honeymoon): that trip type is already chosen */
  var qt = new URLSearchParams(window.location.search).get("trip");
  if (qt) { var qb = Array.prototype.find.call(typeTiles.children, function (x) { return x.getAttribute("data-label") === qt; }); if (qb) { st.type = qt; pressOnly(typeTiles, qb); updatePass(); current = "type"; show(seq()[1], 1); } }
  barcode();
  window.sbFlow = { st: st, show: show, next: next, ref: REF, waLink: waLink, message: message, seq: seq, hotelMode: hotelMode };
  updateTop();
  }
  /* calm accordion: animate details open and closed, one open at a time per group */
  (function () {
    var rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    Array.prototype.forEach.call(document.querySelectorAll(".faq"), function (group) {
      var items = Array.prototype.slice.call(group.querySelectorAll(":scope > details"));
      var sums = items.map(function (d) { return d.querySelector("summary"); });
      function anim(d, from, to, done) {
        if (rm.matches || !d.animate) { done && done(); return; }
        d.style.overflow = "hidden";
        var a = d.animate({ height: [from + "px", to + "px"] }, { duration: 320, easing: "cubic-bezier(.2,.7,.2,1)" });
        a.onfinish = function () { d.style.height = ""; done && done(); };
      }
      function close(d) { if (!d.open) return; var h = d.offsetHeight, s = d.querySelector("summary").offsetHeight + 2; anim(d, h, s, function () { d.open = false; }); if (rm.matches || !d.animate) d.open = false; }
      function open(d) { var s = d.offsetHeight; d.open = true; var h = d.offsetHeight; anim(d, s, h); }
      items.forEach(function (d, i) {
        sums[i].addEventListener("click", function (e) {
          e.preventDefault();
          if (d.open) { close(d); return; }
          items.forEach(function (o) { if (o !== d) close(o); });
          open(d);
        });
        sums[i].addEventListener("keydown", function (e) {
          var j = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: sums.length - 1 }[e.key];
          if (j === undefined) return; e.preventDefault(); sums[(j + sums.length) % sums.length].focus();
        });
      });
    });
  })();
  /* expanding trip cards: desktop with a mouse only */
  (function () {
    var t = document.querySelector(".trips"); if (!t) return;
    var mq = window.matchMedia("(min-width: 1024px) and (hover: hover)"), cards = Array.prototype.slice.call(t.querySelectorAll(".trip"));
    function on(c) { cards.forEach(function (x) { x.classList.toggle("on", x === c); }); }
    function setup() { t.classList.toggle("xp", mq.matches); if (mq.matches && !t.querySelector(".trip.on")) on(cards[0]); }
    cards.forEach(function (c) { c.addEventListener("mouseenter", function () { if (mq.matches) on(c); }); c.addEventListener("focusin", function () { if (mq.matches) on(c); }); });
    if (mq.addEventListener) mq.addEventListener("change", setup); setup();
  })();
  /* phone and tablet menu: dialog sheet, Escape closes, focus stays inside */
  (function () {
    var btn = document.getElementById("mbtn"), m = document.getElementById("mmenu"); if (!btn || !m) return;
    var close = m.querySelector(".mm-close");
    function focusables() { return Array.prototype.filter.call(m.querySelectorAll("a[href], button"), function (e) { return e.offsetParent !== null; }); }
    function open() { m.hidden = false; document.documentElement.classList.add("mm-open"); btn.setAttribute("aria-expanded", "true"); requestAnimationFrame(function () { m.classList.add("on"); }); close.focus(); }
    function shut(back) { m.classList.remove("on"); document.documentElement.classList.remove("mm-open"); btn.setAttribute("aria-expanded", "false"); m.hidden = true; if (back !== false) btn.focus(); }
    btn.addEventListener("click", open);
    close.addEventListener("click", function () { shut(); });
    m.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); shut(); return; }
      if (e.key !== "Tab") return;
      var f = focusables(), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) shut(false); });
    var mq = window.matchMedia("(min-width: 1024px)"); if (mq.addEventListener) mq.addEventListener("change", function () { if (mq.matches && !m.hidden) shut(false); });
  })();
  /* blur-up safety net: never leave a photo hidden behind its placeholder */
  (function () {
    var imgs = Array.prototype.slice.call(document.querySelectorAll("img.fade"));
    function show(im) { im.classList.add("loaded"); }
    imgs.forEach(function (im) { im.addEventListener("error", function () { show(im); }, { once: true }); });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var im = e.target; io.unobserve(im); setTimeout(function () { show(im); }, 1500); } }); }, { rootMargin: "200px" });
      imgs.forEach(function (im) { io.observe(im); });
    }
    window.addEventListener("load", function () { setTimeout(function () { imgs.forEach(show); }, 2500); });
    setTimeout(function () { imgs.forEach(show); }, 6000);
  })();
  /* guide titles shrink to fit if the font is wider than expected */
  function fitTitles() {
    Array.prototype.forEach.call(document.querySelectorAll(".gtitle, .ghero h1"), function (t) {
      t.style.fontSize = ""; var box = t.parentElement.clientWidth * .9, w = t.scrollWidth, n = 0;
      while (w > box && n < 30) { var fs = parseFloat(getComputedStyle(t).fontSize); t.style.fontSize = (fs * .94) + "px"; w = t.scrollWidth; n++; }
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitles); else fitTitles();
  window.addEventListener("resize", function () { clearTimeout(fitTitles.t); fitTitles.t = setTimeout(fitTitles, 200); });
  /* Share button on guide heroes: the phone share sheet, or copy the link */
  document.querySelectorAll("[data-share]").forEach(function (b) {
    var lab = b.querySelector(".split-label"), orig = lab.textContent;
    b.addEventListener("click", function () {
      var url = location.href.split("#")[0], t = document.title;
      if (navigator.share) { navigator.share({ title: t, url: url }).catch(function () {}); return; }
      var done = function () { lab.textContent = "Link copied"; setTimeout(function () { lab.textContent = orig; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { prompt("Copy this link", url); });
      else prompt("Copy this link", url);
    });
  });
  window.__siteok = true; /* QA marker: the shared script ran to the end */
})();

/* Homepage price check card: reveal once it is in view. Without JS or with reduced motion it simply shows. */
(function () {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var els = document.querySelectorAll(".hd-calm");
  if (!els.length) return;
  document.documentElement.classList.add("rv");
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: .35 });
  Array.prototype.forEach.call(els, function (el) { io.observe(el); });

})();

(function () {
  /* Editorial preview (21 Nov 2026): big photos drift gently as you scroll. Off for reduced motion. */
  var px = document.querySelectorAll("[data-parallax]");
  if (px.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ticking = false;
    function drift() {
      ticking = false;
      var vh = window.innerHeight;
      Array.prototype.forEach.call(px, function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var off = ((r.top + r.height / 2) - vh / 2) * -0.08;
        el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0)";
      });
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(drift); } }, { passive: true });
    window.addEventListener("resize", drift);
    drift();
  }
})();

/* Homepage hero slider: automatic rotation; pauses while focused or when the tab is hidden. */
(function () {
  var hero = document.querySelector(".hero.hd"); if (!hero) return;
  var slides = hero.querySelectorAll(".hs-slide"), dots = hero.querySelectorAll(".hs-dot");
  if (slides.length < 2) return;
  var i = 0, timer = null, reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var focusPaused = false;
  function load() {
    hero.querySelectorAll("source[data-srcset]").forEach(function (s) { s.srcset = s.getAttribute("data-srcset"); s.removeAttribute("data-srcset"); });
    hero.querySelectorAll("img[data-src]").forEach(function (im) { im.src = im.getAttribute("data-src"); im.removeAttribute("data-src"); });
  }
  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("is-on", k === i); if (k === i) s.removeAttribute("aria-hidden"); else s.setAttribute("aria-hidden", "true"); });
    dots.forEach(function (d, k) { d.classList.toggle("is-on", k === i); d.setAttribute("aria-pressed", k === i ? "true" : "false"); });
  }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function sync() {
    stop();
    if (!reduce && !focusPaused && !document.hidden) {
      timer = setInterval(function () { show(i + 1); }, 6000);
    }
  }
  dots.forEach(function (d, k) { d.addEventListener("click", function () { load(); show(k); sync(); }); });
  hero.addEventListener("focusin", function () { focusPaused = true; sync(); });
  hero.addEventListener("focusout", function (e) { if (!hero.contains(e.relatedTarget)) { focusPaused = false; sync(); } });
  document.addEventListener("visibilitychange", sync);
  if (document.readyState === "complete") { load(); sync(); }
  else window.addEventListener("load", function () { load(); sync(); });
})();
