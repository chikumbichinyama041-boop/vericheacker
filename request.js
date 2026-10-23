// Fills the contact boxes on a page:
//   <div id="reqAction"></div>     "Get your business page"
//   <div id="reportAction"></div>  "Report this page"
// With a WhatsApp number in config.js each box shows a WhatsApp button.
// Without one, it shows a message to copy.
(function () {
  var number = (typeof WHATSAPP_NUMBER === "string" ? WHATSAPP_NUMBER : "").replace(/\D/g, "");

  function fill(el, msg, buttonText, noNumberText) {
    if (!el) return;
    if (number) {
      var a = document.createElement("a");
      a.className = "btn"; a.target = "_blank"; a.rel = "noopener";
      a.href = "https://wa.me/" + number + "?text=" + encodeURIComponent(msg);
      a.textContent = buttonText;
      el.appendChild(a);
      return;
    }
    var p = document.createElement("p");
    p.textContent = noNumberText;
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
  }

  fill(document.getElementById("reqAction"),
    "Hello, I would like to get a VeriChecker business page. My business name is: ",
    "Get your business page on WhatsApp",
    "Our WhatsApp number is coming soon. For now, copy this message:");

  var rep = document.getElementById("reportAction");
  if (rep) {
    fill(rep,
      "Hello, I want to report a VeriChecker page. The page address is: " + location.href + "\nWhat is wrong: ",
      "Report this page on WhatsApp",
      "Our WhatsApp number is coming soon. For now, copy this report message:");
  }
})();
