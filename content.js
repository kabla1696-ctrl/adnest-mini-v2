(function () {
var old = document.getElementById("adnest-mini");
if (old) old.remove();

var box = document.createElement("div");
box.id = "adnest-mini";
box.style.position = "fixed";
box.style.right = "16px";
box.style.bottom = "16px";
box.style.zIndex = "2147483647";
box.style.background = "#111827";
box.style.color = "#fff";
box.style.padding = "10px 12px";
box.style.borderRadius = "10px";
box.style.fontFamily = "Arial,sans-serif";
box.style.fontSize = "12px";
box.style.maxWidth = "280px";
box.style.border = "1px solid #374151";

var meta = document.createElement("div");
meta.textContent = "Sponsored · test";
meta.style.fontSize = "10px";
meta.style.color = "#9ca3af";
meta.style.marginBottom = "6px";

var title = document.createElement("div");
title.textContent = "AdNest test widget";
title.style.fontSize = "13px";
title.style.fontWeight = "700";
title.style.marginBottom = "4px";

var body = document.createElement("div");
body.textContent = "If you see this, content script is working.";
body.style.fontSize = "12px";
body.style.color = "#d1d5db";
body.style.marginBottom = "8px";

var link = document.createElement("a");
link.href = "https://example.com";
link.target = "_blank";
link.rel = "noopener noreferrer";
link.textContent = "Open";
link.style.display = "inline-block";
link.style.background = "#2563eb";
link.style.color = "#fff";
link.style.textDecoration = "none";
link.style.padding = "6px 9px";
link.style.borderRadius = "7px";
link.style.fontSize = "11px";

box.appendChild(meta);
box.appendChild(title);
box.appendChild(body);
box.appendChild(link);
document.body.appendChild(box);
})();
