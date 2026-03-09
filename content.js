cat > content.js <<'EOF'
(async () => {
const BOX_ID = 'adnest-mini';
const ROTATE_CHECK_MS = 30000; // প্রতি 30s এ check করবে

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
<a id="adnest-link" href="#" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:6px 9px;border-radius:7px;font-size:11px;">Open</a>
`;
document.body.appendChild(box);
return box;
}

async function tryRenderAd() {
const resp = await chrome.runtime.sendMessage({
type: 'ADNEST_GET_AD',
host: location.hostname
});

if (!resp?.ok || !resp?.ad) return; // frequency/block/disabled হলে skip

const box = ensureBox();
box.querySelector('#adnest-meta').textContent = `Sponsored · ${resp.ad.category || 'general'}`;
box.querySelector('#adnest-title').textContent = resp.ad.title || 'Sponsored';
box.querySelector('#adnest-body').textContent = resp.ad.body || '';
const link = box.querySelector('#adnest-link');
link.textContent = resp.ad.cta || 'Open';
link.href = resp.ad.url || '#';

link.onclick = () => {
chrome.runtime.sendMessage({ type: 'ADNEST_CLICK' });
};
}

// প্রথম render চেষ্টা
await tryRenderAd();

// refresh ছাড়া auto-rotate check
setInterval(tryRenderAd, ROTATE_CHECK_MS);
})();
EOF
