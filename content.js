(async () => {
const BOX_ID = "adnest-mini";

function ensureBox() {
let box = document.getElementById(BOX_ID);
if (!box) {
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
}
return box;
}

function renderAd(ad) {
const box = ensureBox();
box.querySelector("#ad-meta").textContent = "Sponsored · " + (ad.category || "mainstream");
box.querySelector("#ad-title").textContent = ad.title || "Sponsored";
box.querySelector("#ad-body").textContent = ad.body || "";
const link = box.querySelector("#ad-link");
link.textContent = ad.cta || "Open";
link.href = ad.url || "https://example.com";
link.onclick = () => {
try { chrome.runtime.sendMessage({ type: "ADNEST_CLICK" }); } catch (_) {}
};
}

async function tick() {
try {
const resp = await chrome.runtime.sendMessage({
type: "ADNEST_GET_AD",
host: location.hostname
});
if (resp?.ok && resp?.ad) renderAd(resp.ad);
} catch (_) {}
}

await tick();
setInterval(tick, 10000);
})();
