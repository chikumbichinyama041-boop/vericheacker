// Fills the "Get your business page" box on any page that has <div id="reqAction"></div>.
(function () {
  var el = document.getElementById("reqAction");
  if (!el) return;
  var number = (typeof WHATSAPP_NUMBER === "string" ? WHATSAPP_NUMBER : "").replace(/\D/g, "");
  var msg = "Hello, I would like to get a VeriChecker business page. My business name is: ";
  if (number) {
    var a = document.createElement("a");
    a.className = "btn";
    a.target = "_blank"; a.rel = "noopener";
    a.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(msg);
    a.textContent = "Get your business page on WhatsApp";
    el.appendChild(a);
    return;
  }
  var p = document.createElement("p");
  p.textContent = "Our WhatsApp number is coming soon. For now, copy this message:";
  var box = document.createElement("textarea");
  box.readOnly = true; box.rows = 4; box.value = msg; box.setAttribute("aria-label", "Message to copy");
  box.style.cssText = "width:100%;max-width:520px;font:inherit;padding:10px;border:1px solid var(--line);border-radius:8px";
  var b = document.createElement("button");
  b.type = "button"; b.className = "btn"; b.textContent = "Copy message";
  b.style.cssText = "border:0;cursor:pointer;margin-top:10px;display:block;font:inherit;font-weight:700";
  b.addEventListener("click", function () {
    box.select();
    var done = function () { b.textContent = "Copied"; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(done, function () { document.execCommand("copy"); done(); });
    else { document.execCommand("copy"); done(); }
  });
  el.appendChild(p); el.appendChild(box); el.appendChild(b);
})();
