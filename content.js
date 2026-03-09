
(async () => {
if (document.getElementById('adnest-mini')) return;
const resp = await chrome.runtime.sendMessage({ type: 'ADNEST_GET_AD', host: location.hostname });
if (!resp?.ok || !resp?.ad) return;

const box = document.createElement('div');
box.id = 'adnest-mini';
box.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:2147483647;background:#111827;color:#fff;padding:10px 12px;border-radius:10px;font-family:Arial,sans-serif;font-size:12px;max-width:280px;box-shadow:0 10px 30px rgba(0,0,0,.35);border:1px solid #374151';
box.innerHTML = `
<div style="font-size:10px;color:#9ca3af;margin-bottom:6px;">Sponsored · ${resp.ad.category}</div>
<div style="font-size:13px;font-weight:700;margin-bottom:4px;">${resp.ad.title}</div>
<div style="font-size:12px;color:#d1d5db;margin-bottom:8px;">${resp.ad.body}</div>
<a id="adnest-link" href="${resp.ad.url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:6px 9px;border-radius:7px;font-size:11px;">${resp.ad.cta}</a>
`;
document.body.appendChild(box);
document.getElementById('adnest-link')?.addEventListener('click', () => chrome.runtime.sendMessage({ type: 'ADNEST_CLICK' }));
})();
