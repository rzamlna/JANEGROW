"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
const [players, setPlayers] = useState(null);
const [modsTotal, setModsTotal] = useState(null);
const [modsOnline, setModsOnline] = useState([]);
const [modsUndercover, setModsUndercover] = useState([]);
const [status, setStatus] = useState("Loading...");
const [updated, setUpdated] = useState(null);

function fmt(n) {
return Number(n || 0).toLocaleString("id-ID");
}

function renderMods(arr) {
if (!arr || arr.length === 0) return "Tidak ada";
return arr.map((m) => `${m.name} (${m.duration || "?"})`).join(", ");
}

async function refresh() {
try {
const [pRes, mRes] = await Promise.all([
fetch("/api/players", { cache: "no-store" }),
fetch("/api/mods", { cache: "no-store" }),
]);

const pData = await pRes.json();
const mData = await mRes.json();

if (!pData.ok) throw new Error(pData.error || "Players request failed");
if (!mData.ok) throw new Error(mData.error || "Mods request failed");

setPlayers(pData.players);
setStatus(`Server status: ${String(pData.status || "unknown").toUpperCase()}`);
setUpdated(Date.now());

setModsTotal(mData.total);
setModsOnline(mData.online || []);
setModsUndercover(mData.undercover || []);
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
width: "min(92vw, 700px)",
border: "1px solid #30363d",
borderRadius: 16,
padding: 22,
background: "rgba(22, 27, 34, 0.9)",
boxShadow: "0 10px 30px rgba(0,0,0,.35)",
}}
>
<h1 style={{ fontSize: 20, margin: "0 0 12px", color: "#7ee787" }}>
🎮 Growtopia Monitor (Created By JANE)
</h1>

<div style={{ fontSize: 48, fontWeight: 800, margin: "6px 0" }}>
{players === null ? "..." : fmt(players)}
</div>
<div style={{ color: "#8b949e", fontSize: 14, marginBottom: 10 }}>{status}</div>

<div style={{ color: "#79c0ff", fontSize: 16, fontWeight: 700, marginTop: 8 }}>
🛡️ Mods Active: {modsTotal === null ? "..." : fmt(modsTotal)}
</div>

<p style={{ marginTop: 10, color: "#8b949e", fontSize: 13 }}>
<b>Visible Mods:</b> {renderMods(modsOnline)}
</p>
<p style={{ marginTop: 4, color: "#8b949e", fontSize: 13 }}>
<b>Undercover Mods:</b> {renderMods(modsUndercover)}
</p>

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
Use this for Discord bot or any app:{" "}
<code style={{ color: "#79c0ff" }}>/api/players</code> •{" "}
<code style={{ color: "#79c0ff" }}>/api/mods</code>
</p>
</section>
</main>
);
}
