// VeriChecker – the checking logic for check.html
(function () {
  const $ = id => document.getElementById(id);
  const inst = $("inst"), kind = $("kind"), val = $("val"), out = $("out"), hint = $("hint");

  const LABEL = { account:"account number", phone:"phone number", code:"payment code", holder:"account holder name" };
  const HINTS = {
    account:"Digits only. Spaces and dashes are ignored.",
    phone:"Start with 0 or +260, for example 097… or +26097…",
    code:"The paybill, merchant or till code.",
    holder:"The name shown when you pay, as written."
  };
  const NETWORKS = { "95":"Zamtel","55":"Zamtel","96":"MTN","76":"MTN","97":"Airtel","77":"Airtel" };

  // fill the institution list, grouped by type
  const groups = {};
  INSTITUTIONS.forEach(i => (groups[i.type] = groups[i.type] || []).push(i));
  Object.keys(groups).forEach(t => {
    const g = document.createElement("optgroup"); g.label = t;
    groups[t].forEach(i => g.appendChild(new Option(i.name, i.id)));
    inst.appendChild(g);
  });

  function setHint() { hint.textContent = HINTS[kind.value]; val.inputMode = kind.value === "holder" ? "text" : "tel"; }
  kind.addEventListener("change", setHint); setHint();

  function norm(k, v) {
    v = String(v).trim();
    if (k === "holder") return v.toLowerCase().replace(/\s+/g, " ");
    if (k === "phone") {
      let d = v.replace(/\D/g, "");
      if (d.startsWith("260")) d = d.slice(3); else if (d.startsWith("0")) d = d.slice(1);
      return d;                       // the 9 digits after the country code
    }
    return v.replace(/[\s-]/g, "").toUpperCase();
  }
  function dist(a, b) {
    if (!a.length) return b.length; if (!b.length) return a.length;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++)
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
  function marked(given, official) {
    let h = "";
    for (let i = 0; i < given.length; i++) h += given[i] === official[i] ? esc(given[i]) : "<mark>" + esc(given[i]) + "</mark>";
    return h;
  }
  function show(cls, verdict, body) {
    out.innerHTML = '<div class="result ' + cls + '"><p class="verdict">' + verdict + "</p>" + body + "</div>";
  }
  function pretty(k, v) { return k === "phone" ? "+260" + v : v; }

  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const r = INSTITUTIONS.find(x => x.id === inst.value), k = kind.value, raw = val.value.trim();
    if (!r) { show("warn", "Choose an institution", "<p>Pick the institution the detail is supposed to belong to.</p>"); inst.focus(); return; }
    if (!raw) { show("warn", "Enter a detail first", "<p>Type the account number, phone number, code or name you want to check.</p>"); val.focus(); return; }

    const given = norm(k, raw), label = LABEL[k];

    if (k === "phone" && given.length !== 9) {
      show("warn", "That doesn’t look like a Zambian number", "<p>A Zambian number is 10 digits starting with 0, or +260 followed by 9 digits. Check it and try again.</p>");
      return;
    }
    const net = (k === "phone" && NETWORKS[given.slice(0, 2)]) ? "<p>This number is on the " + NETWORKS[given.slice(0, 2)] + " network.</p>" : "";
    const list = (r[k] || []).map(x => norm(k, x));

    if (!list.length) {
      show("warn", "No record to compare", "<p>We have no confirmed " + label + " on file for " + esc(r.name) + ", so we can’t check this one. Ask " + esc(r.name) + " directly.</p>" + net);
      return;
    }
    if (list.includes(given)) {
      show("ok", "Match found", "<p>This " + label + " is on " + esc(r.name) + "’s official record.</p>" + net + '<div class="cmp">' + esc(raw) + "</div>");
      return;
    }
    let best = null, bd = 99;
    list.forEach(o => { const d = dist(given, o); if (d < bd) { bd = d; best = o; } });
    if (bd <= 2) {
      show("bad", "Looks like a fake",
        "<p>This " + label + " is not on " + esc(r.name) + "’s record, but it is only " + bd + " character" + (bd > 1 ? "s" : "") + " different from one that is. Copies like this are a common trick.</p>" +
        "<p>You entered:</p><div class=\"cmp\">" + marked(given, best) + "</div>" +
        "<p>Official:</p><div class=\"cmp\">" + esc(pretty(k, best)) + "</div>" +
        "<p><strong>Don’t pay to the detail you were given.</strong></p>");
      return;
    }
    show("bad", "No match", "<p>This " + label + " is not on " + esc(r.name) + "’s official record. Don’t pay until you have confirmed it with " + esc(r.name) + " directly.</p>" + net);
  });
})();
