const API_BASE = "https://api1.adsterra.com/api/v1";
const API_KEY = "754c3555a75e97640d7d9cfccbabb99b"; // নিজের token বসাও (GitHub-এ push কোরো না)

const DEFAULTS = {
enabled: true,
frequencyMinutes: 0.1667, // ~10 sec
categories: ["mainstream"],
blockedDomains: [
"mail.google.com",
"docs.google.com",
"drive.google.com",
"paypal.com",
"bank"
],
lastShownAt: 0,
stats: { impressions: 0, clicks: 0 },
liveAds: []
};

const FALLBACK_ADS = [
{
title: "Sponsored: Recommended Offer",
body: "Check this verified partner offer.",
cta: "Open",
url: "https://www.effectivegatecpm.com/mmpvw5zb4?key=ea9d9a7cde04fb72010c9e4b497d320f",
category: "mainstream"
}
];

async function fetchSmartlinksFromAPI() {
if (!API_KEY || API_KEY.includes("PASTE_YOUR_NEW_ADSTERRA_TOKEN_HERE")) return [];

try {
const url = `${API_BASE}/user/smart-links.json?status=active`;
const res = await fetch(url, {
method: "GET",
headers: {
"Accept": "application/json",
"X-API-Key": API_KEY
}
});

if (!res.ok) return [];
const json = await res.json();
const items = (json?.data?.items || []).filter(Boolean);

return items
.map((x) => ({
title: x.title || "Sponsored: Recommended Offer",
body: "Check this verified partner offer.",
cta: "Open",
url: x.url,
category: "mainstream"
}))
.filter((x) => typeof x.url === "string" && x.url.startsWith("http"));
} catch (e) {
return [];
}
}

async function refreshLiveAds() {
const live = await fetchSmartlinksFromAPI();
if (live.length > 0) {
await chrome.storage.sync.set({ liveAds: live });
}
}

chrome.runtime.onInstalled.addListener(async () => {
const data = await chrome.storage.sync.get(null);
if (!Object.keys(data).length) {
await chrome.storage.sync.set(DEFAULTS);
}
await refreshLiveAds();
});

chrome.runtime.onStartup?.addListener(async () => {
await refreshLiveAds();
});

// প্রতি 10 মিনিটে API refresh
setInterval(() => {
refreshLiveAds().catch(() => {});
}, 10 * 60 * 1000);

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

const pool = (s.liveAds && s.liveAds.length) ? s.liveAds : FALLBACK_ADS;
const ad = pool[Math.floor(Math.random() * pool.length)];

await chrome.storage.sync.set({
lastShownAt: now,
stats: {
...(s.stats || { impressions: 0, clicks: 0 }),
impressions: (s.stats?.impressions || 0) + 1
}
});

return sendResponse({ ok: true, ad });
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
