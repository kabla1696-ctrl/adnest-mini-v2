const DEFAULTS = {
enabled: true,
frequencyMinutes: 0.083, // ~5 seconds
categories: ["crypto", "tech"],
blockedDomains: [
"mail.google.com",
"docs.google.com",
"binance.com",
"bybit.com",
"okx.com"
],
lastShownAt: 0,
stats: { impressions: 0, clicks: 0 }
};

const ADS = {
crypto: [
{
title: "Sponsored: Hardware Wallet",
body: "Secure your assets offline.",
cta: "Explore",
url: "https://example.com/crypto-1"
},
{
title: "Sponsored: Onchain Analytics",
body: "Track smart money in realtime.",
cta: "Open",
url: "https://example.com/crypto-2"
}
],
tech: [
{
title: "Sponsored: VPS for Builders",
body: "Deploy faster with simple pricing.",
cta: "See plans",
url: "https://example.com/tech-1"
},
{
title: "Sponsored: Dev Productivity Tool",
body: "Ship 2x faster with automation.",
cta: "Try now",
url: "https://example.com/tech-2"
}
],
finance: [
{
title: "Sponsored: Expense Tracker",
body: "Control spending with smart reports.",
cta: "Get started",
url: "https://example.com/fin-1"
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
d => host === d || host.endsWith(`.${d}`)
);
if (blocked) return sendResponse({ ok: false, reason: "blocked" });

const now = Date.now();
const waitMs = (s.frequencyMinutes || 5) * 60 * 1000;
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

return sendResponse({ ok: false, reason: "unknown-message" });
})();

return true; // async response
});
