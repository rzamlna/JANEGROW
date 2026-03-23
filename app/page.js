"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
const [players, setPlayers] = useState(null);
const [status, setStatus] = useState("Loading...");
const [updated, setUpdated] = useState(null);

function fmt(n) {
return Number(n || 0).toLocaleString("id-ID");
}

async function refresh() {
try {
const res = await fetch("/api/players", { cache: "no-store" });
const data = await res.json();

if (!data.ok) throw new Error(data.error || "Request failed");

setPlayers(data.players);
setStatus(`Server status: ${String(data.status || "unknown").toUpperCase()}`);
setUpdated(data.ts || Date.now());
} catch (e) {
setStatus(`Error: ${e.message}`);
}
}

useEffect(() => {
refresh();
const id = setInterval(refresh, 10000);
return () => clearInterval(id);
}, []);

return (
<main
style={{
margin: 0,
minHeight: "100vh",
display: "grid",
placeItems: "center",
background: "radial-gradient(circle at top, #1b2435, #0d1117 55%)",
color: "#e6edf3",
fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
padding: 16,
}}
>
<section
style={{
width: "min(92vw, 560px)",
border: "1px solid #30363d",
borderRadius: 16,
padding: 22,
background: "rgba(22, 27, 34, 0.9)",
boxShadow: "0 10px 30px rgba(0,0,0,.35)",
}}
>
<h1 style={{ fontSize: 20, margin: "0 0 12px", color: "#7ee787" }}>
🎮 Growtopia Player Monitor (Created By JANE)
</h1>

<div style={{ fontSize: 48, fontWeight: 800, margin: "6px 0" }}>
{players === null ? "..." : fmt(players)}
</div>

<div style={{ color: "#8b949e", fontSize: 14 }}>{status}</div>

<div
style={{
display: "flex",
gap: 12,
alignItems: "center",
justifyContent: "space-between",
marginTop: 12,
color: "#8b949e",
fontSize: 14,
}}
>
<div>⏱️ Auto refresh 10s</div>
<div>{updated ? new Date(updated).toLocaleTimeString("id-ID") : ""}</div>
</div>

<p style={{ marginTop: 14, color: "#8b949e", fontSize: 13 }}>
API: <code style={{ color: "#79c0ff" }}>/api/players</code>
</p>

<p style={{ marginTop: 8, color: "#8b949e", fontSize: 13 }}>
Contact JANE:{" "}
<span style={{ color: "#8b949e" }}>
If you can’t use API, contact me:{" "}
</span>
<span style={{ color: "#79c0ff" }}>jane_username</span>
</p>
</section>
</main>
);
}
