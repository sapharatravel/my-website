/* Price check form: builds a WhatsApp message with an STG-PC- reference. Nothing is stored on the website. */
(function () {
  var f = document.getElementById("pcForm"); if (!f) return;
  var ref = "STG-PC-" + String(Math.floor(1000 + Math.random() * 9000));
  var $ = function (id) { return document.getElementById(id); };
  var kids = $("pc-children"), agesWrap = $("pcAgesWrap");
  function syncAges() { agesWrap.hidden = !(+kids.value > 0); }
  kids.addEventListener("input", syncAges); syncAges();
  var required = [["pc-hotel", "Slight delay. Just add the hotel name."], ["pc-in", "Slight delay. Just add your check-in date."], ["pc-out", "Slight delay. Just add your check-out date."], ["pc-price", "Slight delay. Just add the price you found."]];
  function fmtDate(v) { if (!v) return ""; var d = new Date(v + "T12:00:00"); return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
  function nights() { var a = $("pc-in").value, b = $("pc-out").value; if (!a || !b) return ""; var n = Math.round((new Date(b) - new Date(a)) / 864e5); return n > 0 ? " (" + n + (n === 1 ? " night)" : " nights)") : ""; }
  // 21 Nov 2026: "£2,340" rather than "GBP 2340" when the price is a plain number
  function money(cur, raw) { var sym = { GBP: "£", USD: "$", EUR: "€" }[cur]; var n = Number(String(raw).replace(/[£$€,\s]/g, "")); if (!raw || isNaN(n)) return (cur ? cur + " " : "") + raw; var s = n.toLocaleString("en-GB", { maximumFractionDigits: 2 }); return sym ? sym + s : cur + " " + s; }
  // check-in can't be in the past; check-out follows check-in
  (function () { var t = new Date(); var iso = new Date(t.getTime() - t.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); $("pc-in").min = iso; $("pc-out").min = iso; $("pc-in").addEventListener("change", function () { if ($("pc-in").value) $("pc-out").min = $("pc-in").value; }); })();
  function message() {
    var v = function (id) { return ($(id).value || "").trim(); };
    var L = ["Salaams, could you check this hotel price for me?", "Ref: " + ref, "Hotel: " + v("pc-hotel") + (v("pc-dest") ? " · " + v("pc-dest") : ""), "Dates: " + fmtDate(v("pc-in")) + " to " + fmtDate(v("pc-out")) + nights()];
    var ad = +v("pc-adults") || 0, ch = +v("pc-children") || 0;
    L.push("Guests: " + ad + (ad === 1 ? " adult" : " adults") + (ch ? ", " + ch + (ch === 1 ? " child" : " children") + (v("pc-ages") ? " (" + (/[ ,&]|and/.test(v("pc-ages")) ? "ages " : "age ") + v("pc-ages") + ")" : "") : "") + " · " + (v("pc-rooms") || "1") + (v("pc-rooms") === "1" || !v("pc-rooms") ? " room" : " rooms"));
    if (v("pc-room") || v("pc-board")) L.push((v("pc-room") ? "Room: " + v("pc-room") : "") + (v("pc-room") && v("pc-board") ? " · " : "") + (v("pc-board") ? "Board: " + v("pc-board") : ""));
    L.push("Price found: " + money(v("pc-currency"), v("pc-price")) + (v("pc-where") ? " on " + v("pc-where") : ""));
    if (v("pc-link")) L.push("Link: " + v("pc-link"));
    L.push("I'll send a screenshot in this chat.");
    return L.join("\n");
  }
  function errorFor(el, message) {
    var er = $(el.id + "-e");
    if (!er) {
      er = document.createElement("p"); er.className = "err"; er.id = el.id + "-e"; er.setAttribute("role", "alert"); er.hidden = true;
      el.closest(".fq").appendChild(er);
      var described = (el.getAttribute("aria-describedby") || "").trim();
      el.setAttribute("aria-describedby", (described ? described + " " : "") + er.id);
    }
    er.textContent = message || ""; er.hidden = !message;
    el.setAttribute("aria-invalid", message ? "true" : "false");
    return !!message;
  }
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var first = null;
    required.forEach(function (r) {
      var el = $(r[0]), bad = !el.value.trim();
      errorFor(el, bad ? r[1] : "");
      if (bad && !first) first = el;
    });
    var today = new Date(), todayIso = new Date(today.getTime() - today.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
    var checkin = $("pc-in"), checkout = $("pc-out");
    if (checkin.value && checkin.value < todayIso) {
      errorFor(checkin, "Choose today or a future check-in date.");
      if (!first) first = checkin;
    }
    if (checkin.value && checkout.value && checkout.value <= checkin.value) {
      errorFor(checkout, "Check-out must be after check-in.");
      if (!first) first = checkout;
    } else if (checkout.value && checkout.value < todayIso) {
      errorFor(checkout, "Choose a future check-out date.");
      if (!first) first = checkout;
    } else if (checkout.value) errorFor(checkout, "");
    var price = $("pc-price"), rawPrice = price.value.trim().replace(/[£$€,\s]/g, "");
    if (rawPrice && (!/^\d+(?:\.\d{1,2})?$/.test(rawPrice) || !Number.isFinite(Number(rawPrice)) || Number(rawPrice) <= 0)) {
      errorFor(price, "Enter a valid total price greater than zero.");
      if (!first) first = price;
    } else if (rawPrice) errorFor(price, "");
    [["pc-adults",1,20,"adults"],["pc-children",0,12,"children"],["pc-rooms",1,10,"rooms"]].forEach(function (r) {
      var el = $(r[0]), raw = el.value.trim(), ok = raw !== "" && Number.isInteger(Number(raw)) && Number(raw) >= r[1] && Number(raw) <= r[2];
      if (!ok) {
        errorFor(el, "Enter a whole number from " + r[1] + " to " + r[2] + " " + r[3] + ".");
        if (!first) first = el;
      } else errorFor(el, "");
    });
    if (first) { first.focus(); return; }
    var url = "https://wa.me/447887353457?text=" + encodeURIComponent(message());
    $("pcSent").hidden = false;
    // In-app browsers (Instagram, Facebook) often block new windows: fall back to opening WhatsApp in the same tab
    var w = window.open(url, "_blank"); if (w) { try { w.opener = null; } catch (err) {} } else { location.href = url; }
  });
  window.pcForm = { message: message, ref: ref };
})();
