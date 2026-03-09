async function render() {
const s = await chrome.storage.sync.get(['enabled','stats']);
const enabled = s.enabled !== false;
document.getElementById('status').textContent = `Status: ${enabled ? 'Enabled' : 'Disabled'}`;
document.getElementById('toggle').textContent = enabled ? 'Disable' : 'Enable';
document.getElementById('stats').textContent = `Impressions: ${s.stats?.impressions||0} | Clicks: ${s.stats?.clicks||0}`;
document.getElementById('toggle').onclick = async () => { await chrome.storage.sync.set({enabled: !enabled}); render(); };
}
render();
