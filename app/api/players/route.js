export async function GET() {
try {
const upstream = await fetch("https://www.growtopiagame.com/detail", {
headers: {
"User-Agent":
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
"Accept": "application/json,text/plain,*/*",
"Accept-Language": "en-US,en;q=0.9,id;q=0.8",
"Referer": "https://www.growtopiagame.com/",
"Origin": "https://www.growtopiagame.com",
},
cache: "no-store",
});

if (!upstream.ok) {
return Response.json(
{ ok: false, error: `Upstream error ${upstream.status}`, ts: Date.now() },
{ status: 502 }
);
}

const raw = await upstream.json();
return Response.json({
ok: true,
players: Number(raw?.online_user || 0),
ts: Date.now(),
raw,
});
} catch (err) {
return Response.json(
{ ok: false, error: err?.message || "Unknown error", ts: Date.now() },
{ status: 500 }
);
}
}
