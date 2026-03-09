const DEFAULTS = {
enabled: true,
frequencyMinutes: 0.1667, // ~10 sec
categories: ["mainstream"],
blockedDomains: [
"mail.google.com",
"docs.google.com",
"drive.google.com",
"bank",
"paypal.com"
],
lastShownAt: 0,
stats: { impressions: 0, clicks: 0 }
};

const ADS = {
mainstream: [
{
title: "Sponsored: Recommended Offer",
body: "Check this verified partner offer.",
cta: "Open",
url: "https://www.effectivegatecpm.com/mmpvw5zb4?key=ea9d9a7cde04fb72010c9e4b497d320f"
}
]
};

chrome.runtime.onInstalled.addListener(async () => {
const data = await chrome.storage.sync.get(null);
if (!Object.keys(data).length) {
await chrome.storage.sync.set(DEFAULTS);
}
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
(async () => {
const s = await chrome.storage.sync.get(null);

if (msg?.type === "ADNEST_GET_AD") {
if (!s.enabled) return sendResponse({ ok: false, reason: "disabled" });

const host = msg.host || "";
const blocked = (s.blockedDomains || []).some(
d => host === d || host.endsWith(`.${d}`) || host.includes(d)
);
if (blocked) return sendResponse({ ok: false, reason: "blocked" });

const now = Date.now();
const waitMs = (s.frequencyMinutes || 1) * 60 * 1000;
if ((s.lastShownAt || 0) + waitMs > now) {
return sendResponse({ ok: false, reason: "frequency" });
}

const cats = (s.categories || []).filter(c => ADS[c]?.length);
if (!cats.length) return sendResponse({ ok: false, reason: "no-categories" });

const cat = cats[Math.floor(Math.random() * cats.length)];
const pool = ADS[cat];
const ad = pool[Math.floor(Math.random() * pool.length)];

await chrome.storage.sync.set({
lastShownAt: now,
stats: {
...(s.stats || { impressions: 0, clicks: 0 }),
impressions: (s.stats?.impressions || 0) + 1
}
});

return sendResponse({ ok: true, ad: { ...ad, category: cat } });
}

if (msg?.type === "ADNEST_CLICK") {
const stats = s.stats || { impressions: 0, clicks: 0 };
await chrome.storage.sync.set({
stats: { ...stats, clicks: (stats.clicks || 0) + 1 }
});
return sendResponse({ ok: true });
}

return sendResponse({ ok: false });
})();

return true;
});
