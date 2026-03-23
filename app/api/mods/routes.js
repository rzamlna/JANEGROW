export async function GET() {
try {
const up = await fetch("https://bvaaweb.vercel.app/api/mods", {
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

const online = Array.isArray(raw?.online) ? raw.online : [];
const undercover = Array.isArray(raw?.undercover) ? raw.undercover : [];
const offline = Array.isArray(raw?.offline) ? raw.offline : [];

return Response.json({
ok: true,
total: online.length + undercover.length,
online,
undercover,
offline,
ts: Date.now(),
});
} catch (e) {
return Response.json(
{ ok: false, error: e.message || "Unknown error", ts: Date.now() },
{ status: 500 }
);
}
}
