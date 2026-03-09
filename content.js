cat >/home/sheikhzidan3/adnest-mini-v2/content.js <<'EOF'
(() => {
const old = document.getElementById('adnest-mini');
if (old) old.remove();

const box = document.createElement('div');
box.id = 'adnest-mini';
box.style.cssText =
'position:fixed;right:16px;bottom:16px;z-index:2147483647;background:#111827;color:#fff;padding:10px 12px;border-radius:10px;font-family:Arial,sans-serif;font-size:12px;max-width:280px;box-shadow:0 10px 30px rgba(0,0,0,.35);border:1px solid #374151';
box.innerHTML = `
<div style="font-size:10px;color:#9ca3af;margin-bottom:6px;">Sponsored · test</div>
<div style="font-size:13px;font-weight:700;margin-bottom:4px;">AdNest test widget</div>
<div style="font-size:12px;color:#d1d5db;margin-bottom:8px;">If you see this, content script works.</div>
<a href="https://example.com" target="_blank" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:6px 9px;border-radius:7px;font-size:11px;">Open</a>
`;
document.body.appendChild(box);
})();
EOF
