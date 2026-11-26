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

  /* Client-rendered icons use the same cached JSON library as server-rendered SVGs. */
  var iconTargets = document.querySelectorAll("[data-ico]");
  if (iconTargets.length) {
    fetch("/assets/icons.json")
      .then(function (response) { if (!response.ok) throw new Error("Icon library unavailable"); return response.json(); })
      .then(function (icons) {
        var aliases = {
          "Honeymoon": "honeymoon", "Beach and island": "beach", "Family holiday": "family",
          "Multi-city": "multi-city", "Umrah hotels": "umrah", "Business travel": "business",
          "Hotel only": "hotel", "Something else": "something-else"
        };
        iconTargets.forEach(function (el) {
          var name = el.getAttribute("data-ico");
          var paths = icons[aliases[name] || name];
          if (!paths) return;
          el.outerHTML = '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + paths + '</svg>';
        });
      })
      .catch(function () { /* Keep the page usable if the optional icon asset cannot load. */ });
  }

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
  function update(yValue, heroBottomValue) {
    /* Read geometry before changing classes, so the header update cannot force a synchronous layout. */
    var y = typeof yValue === "number" ? yValue : window.scrollY;
    var heroBottom = typeof heroBottomValue === "number" ? heroBottomValue : (hero ? hero.getBoundingClientRect().bottom : 0);
    var past = hero ? heroBottom < 0 : y > 420;
    var on = past && !nearEnd.form && !nearEnd.footer && window.innerWidth < 1024;
    hdr.classList.toggle("slim", y > 8);
    hdr.classList.toggle("bar-on", on);
    if (sticky) { sticky.classList.toggle("on", on); sticky.querySelectorAll("a").forEach(function (a) { a.tabIndex = on ? 0 : -1; }); }
  }

  /* hotel names: tap or click pauses and resumes */
  /* 22 Nov 2026 (night, Huzaifa): the hotel strip no longer pauses on tap or click */

  /* Desktop navigation disclosures share one open panel. */
  var closeActiveDropdown;
  document.querySelectorAll(".desk-links .dd").forEach(function (dd) {
    var button = dd.querySelector(".dd-btn"), leaveTimer, openedByHover = false;
    function closeDropdown() {
      clearTimeout(leaveTimer);
      dd.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
      openedByHover = false;
      if (closeActiveDropdown === closeDropdown) closeActiveDropdown = null;
    }
    function openDropdown(byHover) {
      clearTimeout(leaveTimer);
      if (closeActiveDropdown && closeActiveDropdown !== closeDropdown) closeActiveDropdown();
      dd.querySelectorAll("img[data-src]").forEach(function (img) {
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
      });
      dd.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      closeActiveDropdown = closeDropdown;
      openedByHover = byHover;
    }
    if (window.matchMedia("(hover: hover)").matches) {
      dd.addEventListener("mouseenter", function () {
        clearTimeout(leaveTimer);
        if (!dd.classList.contains("open")) openDropdown(true);
      });
      dd.addEventListener("mouseleave", function () {
        if (openedByHover && !dd.contains(document.activeElement)) leaveTimer = setTimeout(closeDropdown, 200);
      });
    }
    button.addEventListener("click", function (event) {
      if (dd.classList.contains("open") && (!openedByHover || event.detail === 0)) closeDropdown();
      else openDropdown(false);
    });
    dd.addEventListener("focusout", function (event) {
      if (!dd.contains(event.relatedTarget)) closeDropdown();
    });
    dd.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && dd.classList.contains("open")) {
        closeDropdown();
        button.focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (!dd.contains(event.target)) closeDropdown();
    });
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && closeActiveDropdown) closeActiveDropdown();
  });

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

  /* scroll loop: progress line, gentle hero image zoom, photo movement (parallax only on large screens with a mouse) */
  var progress = document.getElementById("progress"), heroPic = hero && hero.querySelector("picture");
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
    ticking = false;
    /* Collect all layout measurements before the frame's style writes. */
    var y = window.scrollY, docH = document.documentElement.scrollHeight - vh;
    var hh = hero ? hero.offsetHeight : 1, heroBottom = hero ? hero.getBoundingClientRect().bottom : 0;
    var par = bigMouse.matches, moveRects = [];
    if (!reduce && par) movers.forEach(function (m) { if (m.on) moveRects.push({ m: m, r: m.el.getBoundingClientRect() }); });
    update(y, heroBottom);
    if (reduce) return;
    if (progress) progress.style.transform = "scaleX(" + (docH > 0 ? clamp(y / docH, 0, 1) : 0).toFixed(4) + ")";
    var hp = clamp(y / hh, 0, 1);
    if (hero && heroPic && hp < 1) { heroPic.style.transform = "scale(" + (1 + hp * .04).toFixed(4) + ")"; if (heroVid) heroVid.style.transform = heroPic.style.transform; }
    if (ring) ring.style.rotate = (y * .1).toFixed(1) + "deg";
    moveRects.forEach(function (item) {
      /* Phones and tablets: photos stay still (mobile audit 22 Nov 2026). Desktop parallax retains its existing movement. */
      var m = item.m, r = item.r;
      var c = clamp(((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
      m.img.style.transform = "translate3d(0," + (c * r.height * .06).toFixed(1) + "px,0) scale(1.14)";
    });
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  window.addEventListener("resize", function () { vh = window.innerHeight; frame(); });
  frame();

  /* links to other pages load ahead on hover or tap (for the guide pages in the build) */
  function prefetch(e) { var a = e.target.closest && e.target.closest("a[href]"); if (!a || a.dataset.pf || a.origin !== location.origin || a.hash && a.pathname === location.pathname) return; a.dataset.pf = 1; var l = document.createElement("link"); l.rel = "prefetch"; l.href = a.href; document.head.appendChild(l); }
  document.addEventListener("pointerover", prefetch, { passive: true }); document.addEventListener("touchstart", prefetch, { passive: true });

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
  /* Expand on deliberate hover or keyboard focus. */
  (function () {
    var t = document.querySelector(".trips"); if (!t) return;
    var mq = window.matchMedia("(min-width: 1024px) and (hover: hover)");
    var rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    var cards = Array.prototype.slice.call(t.querySelectorAll(".trip"));
    var active = cards[0], pending, frame;
    if (!active) return;
    function cancelHover() {
      cancelAnimationFrame(frame);
      frame = 0;
      pending = null;
    }
    function activate(card, animate) {
      cancelHover();
      if (animate && active !== card) t.classList.add("interacting");
      if (active !== card) active.classList.remove("on");
      active = card;
      active.classList.add("on");
    }
    function setup() {
      cancelHover();
      t.classList.remove("interacting");
      t.classList.toggle("xp", mq.matches);
      if (mq.matches) activate(t.querySelector(".trip:focus-within") || active);
    }
    t.addEventListener("pointermove", function (e) {
      if (!mq.matches || e.pointerType === "touch") return;
      var card = e.target.closest(".trip");
      if (!card || card === active) { cancelHover(); return; }
      if (card === pending || (t.contains(document.activeElement) && document.activeElement.matches(":focus-visible"))) return;
      if (rm.matches) { activate(card, true); return; }
      // Ignore hover changes caused solely by moving card boundaries.
      pending = card;
      if (!frame) frame = requestAnimationFrame(function () { activate(pending, true); });
    });
    t.addEventListener("pointerleave", cancelHover);
    cards.forEach(function (card) {
      card.addEventListener("focusin", function () { if (mq.matches) activate(card, true); });
    });
    if (mq.addEventListener) mq.addEventListener("change", setup); setup();
  })();
  /* phone and tablet menu: dialog sheet, Escape closes, focus stays inside */
  (function () {
    var btn = document.getElementById("mbtn"), m = document.getElementById("mmenu"); if (!btn || !m) return;
    var close = m.querySelector(".mm-close");
    function focusables() { return Array.prototype.filter.call(m.querySelectorAll("a[href], button, summary"), function (e) { return e.offsetParent !== null; }); }
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

/* Homepage hero slider (21 Nov 2026) */
(function () {
  var hero = document.querySelector(".hero.hd"); if (!hero) return;
  var slides = hero.querySelectorAll(".hs-slide"), dots = hero.querySelectorAll(".hs-dot");
  if (slides.length < 2) return;
  var i = 0, timer = null, reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function load() {
    hero.querySelectorAll("source[data-srcset]").forEach(function (s) { s.srcset = s.getAttribute("data-srcset"); s.removeAttribute("data-srcset"); });
    hero.querySelectorAll("img[data-src]").forEach(function (im) { im.src = im.getAttribute("data-src"); im.removeAttribute("data-src"); });
  }
  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("is-on", k === i); if (k === i) s.removeAttribute("aria-hidden"); else s.setAttribute("aria-hidden", "true"); });
    dots.forEach(function (d, k) { d.classList.toggle("is-on", k === i); d.classList.toggle("is-done", k < i); d.setAttribute("aria-pressed", k === i ? "true" : "false"); });
    restartFill();
  }
  // 22 Nov 2026 (Huzaifa): the dots are lines; the current one fills over the slide's time while the slider runs.
  var bar = hero.querySelector(".hs-dots"), DUR = 6000;
  if (bar) bar.style.setProperty("--hs-dur", DUR + "ms");
  function restartFill() { if (!bar) return; bar.classList.remove("is-run"); void bar.offsetWidth; if (timer) bar.classList.add("is-run"); }
  // 22 Nov 2026 (evening): the slider also pauses while anything in the hero has keyboard focus, and while the tab is hidden.
  var focusPaused = false;
  function start() { stop(); if (!reduce && !focusPaused && !document.hidden) timer = setInterval(function () { show(i + 1); }, DUR); restartFill(); }
  function stop() { if (timer) clearInterval(timer); timer = null; if (bar) bar.classList.remove("is-run"); }
  dots.forEach(function (d, k) { d.addEventListener("click", function () { load(); show(k); start(); }); });
  hero.addEventListener("focusin", function () { focusPaused = true; start(); });
  hero.addEventListener("focusout", function (e) { if (!hero.contains(e.relatedTarget)) { focusPaused = false; start(); } });
  document.addEventListener("visibilitychange", start);
  if (document.readyState === "complete") { load(); start(); }
  else window.addEventListener("load", function () { load(); start(); });
})();

/* Homepage reviews: advance on the exact completion of the 6-second progress-line animation.
   Pauses while hovered, focused or while the tab is hidden; no auto-rotation with reduced motion. */
(function () {
  var box = document.querySelector("[data-proof]"); if (!box) return;
  var slides = box.querySelectorAll(".proof-slide"), dots = box.querySelectorAll(".proof-dot");
  if (slides.length < 2) return;
  var i = 0, hover = false, focus = false, seen = false, running = false;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var bar = box.querySelector(".proof-dots"), DUR = 6000;
  if (bar) bar.style.setProperty("--proof-dur", DUR + "ms");
  function restartFill() {
    if (!bar) return;
    bar.classList.remove("is-run");
    void bar.offsetWidth;
    if (running) bar.classList.add("is-run");
  }
  function show(n) {
    i = (n + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle("is-on", k === i); if (k === i) s.removeAttribute("aria-hidden"); else s.setAttribute("aria-hidden", "true"); });
    dots.forEach(function (d, k) {
      d.classList.toggle("is-on", k === i);
      d.classList.toggle("is-done", k < i);
      d.setAttribute("aria-pressed", k === i ? "true" : "false");
    });
    restartFill();
  }
  function sync() {
    running = !reduce && seen && !hover && !focus && !document.hidden;
    if (bar) bar.classList.remove("is-run");
    restartFill();
  }
  if (bar) bar.addEventListener("animationend", function (e) {
    if (e.animationName === "hsFill" && e.pseudoElement === "::after" && running && dots[i] === e.target) show(i + 1);
  });
  dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); sync(); }); });
  box.addEventListener("mouseenter", function () { hover = true; sync(); });
  box.addEventListener("mouseleave", function () { hover = false; sync(); });
  box.addEventListener("focusin", function () { focus = true; sync(); });
  box.addEventListener("focusout", function (e) { if (!box.contains(e.relatedTarget)) { focus = false; sync(); } });
  document.addEventListener("visibilitychange", sync);
  var x0 = null, y0 = null, wrap = box.querySelector(".proof-slides");
  if (wrap) {
    wrap.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    wrap.addEventListener("touchend", function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) { show(i + (dx < 0 ? 1 : -1)); sync(); }
    }, { passive: true });
  }
  /* only start rotating once the reviews have been on screen */
  if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { es.forEach(function (e) { seen = e.isIntersecting; sync(); }); }, { threshold: .4 }).observe(box);
  else { seen = true; sync(); }
})();


/* Homepage: reference-matched tab switcher with a measured sliding pill and timed content swap. */
(function () {
  var root = document.querySelector("[data-how-process]");
  if (!root || root.dataset.motionReady) return;
  root.dataset.motionReady = "true";
  var tabsWrap = root.querySelector(".how-tabs");
  var tabs = Array.prototype.slice.call(root.querySelectorAll("[data-how-step]"));
  var panel = root.querySelector("#how-panel");
  var title = root.querySelector("[data-how-title]");
  var description = root.querySelector("[data-how-description]");
  var number = root.querySelector("[data-how-number]");
  var footnote = root.querySelector("[data-how-footnote]");
  var frame = root.querySelector(".how-image");
  var image = root.querySelector("[data-how-image]");
  var caption = root.querySelector("[data-how-caption]");
  if (!tabsWrap || !tabs.length || !panel || !title || !description || !image || !frame) return;

  var steps = [
    { title:"Tell us your plans", description:"Tell us where you’d like to go, when you want to travel and who’s coming along. If you have a budget, a hotel in mind or a few must-haves, share those too. If you’re still deciding, that’s absolutely fine.", footnote:"It all starts with a conversation.", image:"/img/st-howwework-kl.webp", alt:"Kuala Lumpur skyline in the morning", caption:"01 · Your trip starts here" },
    { title:"Explore your options", description:"We’ll put together a shortlist of hotels and stays that fit your plans. We’ll compare room types, meal plans, cancellation terms and what’s included, so you can choose what works for you.", footnote:"A few good options, clearly compared.", image:"/img/st-chedi-doha-room.webp", alt:"An elegant hotel room to consider for your stay", caption:"02 · A few options to choose from" },
    { title:"Make it yours", description:"Found somewhere you like? We’ll handle the booking and pass your requests to the hotel. We’ll check what’s possible and confirm the details with you.", footnote:"We’ll confirm what the hotel can do.", image:"/img/st-why-door.webp", alt:"A hotel entrance, with the details ready for your arrival", caption:"03 · Getting the details right" },
    { title:"You’re ready to go", description:"We’ll send your booking confirmation and the details you need for your trip. Need us while you’re away? Message us on WhatsApp.", footnote:"We’re here if you need us.", image:"/img/st-dest-seychelles.webp", alt:"A tropical island destination ready to explore", caption:"04 · We're here if you need us" }
  ];
  var active = 0, timer = 0, generation = 0, indicator, motion = [];
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  steps.forEach(function (step) { var preload = new Image(); preload.src = step.image; });

  indicator = document.createElement("span");
  indicator.className = "how-tab-pill";
  indicator.setAttribute("aria-hidden", "true");
  tabsWrap.insertBefore(indicator, tabsWrap.firstChild);

  function positionPill(index, instant) {
    var tab = tabs[index], wrapRect = tabsWrap.getBoundingClientRect(), tabRect = tab.getBoundingClientRect();
    if (instant) indicator.style.transition = "none";
    indicator.style.width = tabRect.width + "px";
    indicator.style.height = tabRect.height + "px";
    indicator.style.transform = "translate3d(" + (tabRect.left - wrapRect.left) + "px," + (tabRect.top - wrapRect.top) + "px,0)";
    if (instant) { indicator.offsetHeight; indicator.style.removeProperty("transition"); }
  }
  function cancelMotion() {
    window.clearTimeout(timer);
    motion.forEach(function (a) { try { a.cancel(); } catch (e) {} });
    motion = [];
    panel.classList.remove("is-out");
    frame.classList.remove("is-out");
    image.style.opacity = "";
  }
  function updateContent(index) {
    var step = steps[index];
    number.innerHTML = "0" + (index + 1) + " <span>/ 04</span>";
    title.textContent = step.title;
    description.textContent = step.description;
    footnote.textContent = step.footnote;
    caption.textContent = step.caption;
    // This image is swapped by the tab switcher. Remove the static responsive
    // srcset added at build time, otherwise the browser may keep showing its
    // original currentSrc even after image.src changes.
    image.removeAttribute("srcset");
    image.removeAttribute("sizes");
    image.src = step.image;
    image.alt = step.alt;
    panel.setAttribute("aria-labelledby", tabs[index].id);
  }
  function enter(el, keyframes, duration, delay) {
    if (!el || !el.animate) return;
    motion.push(el.animate(keyframes, { duration:duration, delay:delay, easing:"cubic-bezier(.22,1,.36,1)", fill:"both" }));
  }
  function select(index, focus) {
    if (index === active) { if (focus) tabs[index].focus(); return; }
    active = index;
    var token = ++generation;
    tabs.forEach(function (tab, i) {
      var on = i === index;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.setAttribute("tabindex", on ? "0" : "-1");
    });
    if (focus) tabs[index].focus();
    cancelMotion();
    positionPill(index, false);

    if (reduce) { updateContent(index); return; }

    // Old copy and photograph clear together. The cards themselves never move.
    panel.classList.add("is-out");
    frame.classList.add("is-out");
    timer = window.setTimeout(function () {
      if (token !== generation) return;
      updateContent(index);
      panel.classList.remove("is-out");
      frame.classList.remove("is-out");

      // Image leads with a restrained rise; the counter and title follow,
      // then the supporting copy and final reassurance.
      enter(image, [
        {opacity:0, transform:"translateY(18px) scale(1.015)"},
        {opacity:1, transform:"translateY(0) scale(1)"}
      ], 450, 0);
      enter(caption, [{opacity:0,transform:"translateY(6px)"},{opacity:1,transform:"translateY(0)"}], 350, 0);
      enter(number, [{opacity:0,transform:"translateY(8px)",color:"#AAA49A"},{opacity:1,transform:"translateY(0)",color:""}], 300, 70);
      enter(title, [{opacity:0,transform:"translateY(8px)",color:"#AAA49A"},{opacity:1,transform:"translateY(0)",color:""}], 300, 70);
      enter(description, [{opacity:0,transform:"translateY(10px)"},{opacity:1,transform:"translateY(0)"}], 340, 150);
      enter(footnote, [{opacity:0,transform:"translateY(8px)"},{opacity:1,transform:"translateY(0)"}], 300, 220);
    }, 240);
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { select(index, false); });
    tab.addEventListener("keydown", function (event) {
      var next = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault(); select(next, true);
    });
  });
  window.addEventListener("resize", function () { positionPill(active, true); }, {passive:true});
  positionPill(0, true);
})();
