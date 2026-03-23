export async function GET() {
try {
const up = await fetch("https://bvaaweb.vercel.app/api/players", {
cache: "no-store",
headers: {
"User-Agent": "Mozilla/5.0",
Accept: "application/json,text/plain,*/*",
},
});

if (!up.ok) {
return Response.json(
{ ok: false, error: `Upstream ${up.status}`, ts: Date.now() },
{ status: 502 }
);
}

const raw = await up.json();

return Response.json({
ok: true,
players: Number(raw?.count || 0),
change: Number(raw?.change || 0),
percentage: Number(raw?.percentage || 0),
status: raw?.status || "unknown",
ts: Date.now(),
});
} catch (e) {
return Response.json(
{ ok: false, error: e.message || "Unknown error", ts: Date.now() },
{ status: 500 }
);
}
}
