cat >/home/sheikhzidan3/adnest-mini-v2/content.js <<'EOF'
(async () => {
const BOX_ID = 'adnest-mini';
const ROTATE_CHECK_MS = 30000; // প্রতি 30s check
const FORCE_SHOW = false; // real mode

function ensureBox() {
let box = document.getElementById(BOX_ID);
if (box) return box;

box = document.createElement('div');
box.id = BOX_ID;
box.style.cssText =
'position:fixed;right:16px;bottom:16px;z-index:2147483647;background:#111827;color:#fff;padding:10px 12px;border-radius:10px;font-family:Arial,sans-serif;font-size:12px;max-width:280px;box-shadow:0 10px 30px rgba(0,0,0,.35);border:1px solid #374151';
box.innerHTML = `
<div id="adnest-meta" style="font-size:10px;color:#9ca3af;margin-bottom:6px;">Sponsored</div>
<div id="adnest-title" style="font-size:13px;font-weight:700;margin-bottom:4px;">Loading...</div>
<div id="adnest-body" style="font-size:12px;color:#d1d5db;margin-bottom:8px;">Please wait</div>
<a id="adnest-link" href="#" target="_blank" rel="noopener noreferrer"
style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:6px 9px;border-radius:7px;font-size:11px;">
Open
</a>
`;
document.body.appendChild(box);
return box;
}

function renderAd(ad) {
const box = ensureBox();
box.querySelector('#adnest-meta').textContent = `Sponsored · ${ad.category || 'general'}`;
box.querySelector('#adnest-title').textContent = ad.title || 'Sponsored';
box.querySelector('#adnest-body').textContent = ad.body || '';
const link = box.querySelector('#adnest-link');
link.textContent = ad.cta || 'Open';
link.href = ad.url || 'https://example.com';
link.onclick = () => chrome.runtime.sendMessage({ type: 'ADNEST_CLICK' });
}

async function tryRenderAd() {
if (FORCE_SHOW) {
renderAd({
category: 'demo',
title: 'Sponsored: Demo Ad',
body: 'If you can see this, your widget is working.',
cta: 'Open',
url: 'https://example.com'
});
return;
}

const resp = await chrome.runtime.sendMessage({
type: 'ADNEST_GET_AD',
host: location.hostname
});

if (!resp?.ok || !resp?.ad) return;
renderAd(resp.ad);
}

await tryRenderAd();
setInterval(tryRenderAd, ROTATE_CHECK_MS);
})();
EOF
