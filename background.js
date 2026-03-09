const DEFAULTS = {
enabled: true,
frequencyMinutes: 5,
categories: ["crypto","tech"],
blockedDomains: ["mail.google.com","docs.google.com","binance.com","bybit.com","okx.com"],
lastShownAt: 0,
stats: { impressions: 0, clicks: 0 }
};

const ADS = {
crypto:[{title:"Sponsored: Hardware Wallet",body:"Secure your assets offline.",cta:"Explore",url:"https://example.com/crypto-1"}],
tech:[{title:"Sponsored: VPS for Builders",body:"Deploy faster with simple pricing.",cta:"See plans",url:"https://example.com/tech-1"}],
finance:[{title:"Sponsored: Expense Tracker",body:"Control spending with smart reports.",cta:"Get started",url:"https://example.com/fin-1"}]
};

chrome.runtime.onInstalled.addListener(async () => {
const data = await chrome.storage.sync.get(null);
if (!Object.keys(data).length) await chrome.storage.sync.set(DEFAULTS);
});

chrome.runtime.onMessage.addListener(async (msg, _sender, sendResponse) => {
const s = await chrome.storage.sync.get(null);

if (msg?.type === "ADNEST_GET_AD") {
if (!s.enabled) return sendResponse({ ok: false });
const host = msg.host || "";
const blocked = (s.blockedDomains || []).some(d => host === d || host.endsWith(`.${d}`));
if (blocked) return sendResponse({ ok: false });

const now = Date.now();
const wait = (s.frequencyMinutes || 5) * 60 * 1000;
if ((s.lastShownAt || 0) + wait > now) return sendResponse({ ok: false });

const cats = (s.categories || []).filter(c => ADS[c]?.length);
if (!cats.length) return sendResponse({ ok: false });

const cat = cats[Math.floor(Math.random() * cats.length)];
const ad = ADS[cat][0];

await chrome.storage.sync.set({
lastShownAt: now,
stats: { ...(s.stats || { impressions: 0, clicks: 0 }), impressions: (s.stats?.impressions || 0) + 1 }
});

return sendResponse({ ok: true, ad: { ...ad, category: cat } });
}

if (msg?.type === "ADNEST_CLICK") {
const stats = s.stats || { impressions: 0, clicks: 0 };
await chrome.storage.sync.set({ stats: { ...stats, clicks: (stats.clicks || 0) + 1 } });
return sendResponse({ ok: true });
}

sendResponse({ ok: false });
});
