export async function GET() {
try {
const upstream = await fetch("https://www.growtopiagame.com/detail", {
headers: {
"User-Agent": "Mozilla/5.0 (compatible; GTMonitor/1.0)",
Accept: "application/json,text/plain,*/*",
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
const players = Number(raw?.online_user || 0);

return Response.json({
ok: true,
source: "https://www.growtopiagame.com/detail",
players,
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
