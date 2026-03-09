(function () {
try {
var BOX_ID = "adnest-mini";
var ADS = [
{
cat: "crypto",
title: "Sponsored: Hardware Wallet",
body: "Secure assets offline.",
cta: "Explore",
url: "https://example.com/crypto-1"
},
{
cat: "tech",
title: "Sponsored: VPS for Builders",
body: "Deploy faster with simple pricing.",
cta: "See plans",
url: "https://example.com/tech-1"
},
{
cat: "finance",
title: "Sponsored: Expense Tracker",
body: "Control spending smartly.",
cta: "Open",
url: "https://example.com/fin-1"
}
];

var idx = 0;
var timer = null;

function ensureBox() {
var box = document.getElementById(BOX_ID);
if (box) return box;

box = document.createElement("div");
box.id = BOX_ID;
box.style.cssText =
"position:fixed;right:16px;bottom:16px;z-index:2147483647;background:#111827;color:#fff;padding:10px 12px;border-radius:10px;font-family:Arial,sans-serif;font-size:12px;max-width:280px;border:1px solid #374151";

box.innerHTML =
'<div id="ad-meta" style="font-size:10px;color:#9ca3af;margin-bottom:6px;">Sponsored</div>' +
'<div id="ad-title" style="font-size:13px;font-weight:700;margin-bottom:4px;"></div>' +
'<div id="ad-body" style="font-size:12px;color:#d1d5db;margin-bottom:8px;"></div>' +
'<a id="ad-link" href="#" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:6px 9px;border-radius:7px;font-size:11px;">Open</a>';

document.body.appendChild(box);
return box;
}

function renderNextAd() {
var box = ensureBox();
var ad = ADS[idx % ADS.length];
idx++;

box.querySelector("#ad-meta").textContent = "Sponsored · " + ad.cat;
box.querySelector("#ad-title").textContent = ad.title;
box.querySelector("#ad-body").textContent = ad.body;

var link = box.querySelector("#ad-link");
link.textContent = ad.cta;
link.href = ad.url;
link.onclick = null;
}

function safeRender() {
try {
renderNextAd();
} catch (e) {
var msg = String((e && e.message) || e || "");
if (msg.indexOf("Extension context invalidated") !== -1) {
if (timer) clearInterval(timer);
}
}
}

if (window.__ADNEST_TIMER__) {
clearInterval(window.__ADNEST_TIMER__);
window.__ADNEST_TIMER__ = null;
}

safeRender();
timer = setInterval(safeRender, 10000);
window.__ADNEST_TIMER__ = timer;

window.addEventListener("beforeunload", function () {
if (window.__ADNEST_TIMER__) {
clearInterval(window.__ADNEST_TIMER__);
window.__ADNEST_TIMER__ = null;
}
});
} catch (_) {}
})();
