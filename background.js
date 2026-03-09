async function fetchSmartlinksFromAPI() {
if (!API_KEY || API_KEY.includes("754c3555a75e97640d7d9cfccbabb99b")) {
console.log("ADSTERRA_APIKEY_MISSING");
return [];
}

try {
const url = `${API_BASE}/user/smart-links.json?status=active`;
const res = await fetch(url, {
method: "GET",
headers: {
"Accept": "application/json",
"X-API-Key": API_KEY
}
});

console.log("ADSTERRA_STATUS", res.status);

let json = null;
try {
json = await res.json();
} catch (e) {
console.log("ADSTERRA_JSON_PARSE_ERROR", String(e));
return [];
}

console.log("ADSTERRA_JSON", json);

if (!res.ok) return [];

const items = (json?.data?.items || []).filter(Boolean);

const mapped = items
.map((x) => ({
title: x.title || "Sponsored: Recommended Offer",
body: "Check this verified partner offer.",
cta: "Open",
url: x.url,
category: "mainstream"
}))
.filter((x) => typeof x.url === "string" && x.url.startsWith("http"));

console.log("ADSTERRA_MAPPED_COUNT", mapped.length);
return mapped;
} catch (e) {
console.log("ADSTERRA_FETCH_ERROR", String(e));
return [];
}
}
