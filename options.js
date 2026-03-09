(async () => {
const s = await chrome.storage.sync.get(['frequencyMinutes','categories','blockedDomains']);
document.getElementById('freq').value = s.frequencyMinutes || 5;
document.getElementById('cats').value = (s.categories || ['crypto','tech']).join(',');
document.getElementById('domains').value = (s.blockedDomains || []).join('\n');
})();
document.getElementById('save').onclick = async () => {
const frequencyMinutes = Math.max(1, parseInt(document.getElementById('freq').value || '5', 10));
const categories = document.getElementById('cats').value.split(',').map(x=>x.trim()).filter(Boolean);
const blockedDomains = document.getElementById('domains').value.split('\n').map(x=>x.trim()).filter(Boolean);
await chrome.storage.sync.set({ frequencyMinutes, categories, blockedDomains });
document.getElementById('msg').textContent = 'Saved';
};
