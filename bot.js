// gt-status-monitor.js
// Growtopia status monitor (players + mods)
// Source: bvaaweb API

const WEBHOOK_URL = "https://discord.com/api/webhooks/1485598272302350366/J0ltMKVTfoFzPF8RDgtGJyKq8Ku8BPx8T9ZB__rUaxwskt4P2xcEnxGydPVLB3WJM_fI";
const POLL_INTERVAL = 10_000; // 10 detik

const USERNAME = "JANE";
const AVATAR_URL = "https://imgur.com/kWObrr0.png";

let lastMessageId = null;

async function getJson(url) {
const res = await fetch(url, {
headers: {
"User-Agent": "Mozilla/5.0",
Accept: "application/json,text/plain,*/*",
},
});

if (!res.ok) {
throw new Error(`Request gagal: ${res.status} ${res.statusText}`);
}

return res.json();
}

function fmt(n) {
return Number(n || 0).toLocaleString("id-ID");
}

function formatMods(arr) {
if (!arr || arr.length === 0) return "Tidak ada";
return arr.map((m) => `• ${m.name} (\`${m.duration || "?"}\`)`).join("\n");
}

async function fetchStatus() {
const [playersData, modsData] = await Promise.all([
getJson("https://bvaaweb.vercel.app/api/players"),
getJson("https://bvaaweb.vercel.app/api/mods"),
]);

const onlineMods = Array.isArray(modsData.online) ? modsData.online : [];
const undercoverMods = Array.isArray(modsData.undercover) ? modsData.undercover : [];

return {
players: playersData.count ?? 0,
change: playersData.change ?? 0,
percentage: playersData.percentage ?? 0,
status: playersData.status ?? "unknown",
onlineMods,
undercoverMods,
modsTotal: onlineMods.length + undercoverMods.length,
};
}

function buildPayload(data) {
const isOnline = String(data.status).toLowerCase() === "online";
const color = isOnline ? 0x57f287 : 0xed4245;
const statusEmoji = isOnline ? "🟢" : "🔴";

const changeText =
data.change >= 0 ? `+${fmt(data.change)}` : `-${fmt(Math.abs(data.change))}`;

return {
username: USERNAME,
avatar_url: AVATAR_URL,
embeds: [
{
title: "🎮 Growtopia Live Status",
description:
`${statusEmoji} **Server:** \`${String(data.status).toUpperCase()}\`\n` +
`⏱️ Auto update tiap ${Math.floor(POLL_INTERVAL / 1000)} detik`,
color,
fields: [
{
name: "👥 Player Online",
value: `\`${fmt(data.players)}\``,
inline: true,
},
{
name: "📈 Change",
value: `\`${changeText}\` (\`${data.percentage}%\`)`,
inline: true,
},
{
name: "🛡️ Mods Aktif",
value: `\`${fmt(data.modsTotal)}\``,
inline: true,
},
{
name: "🟢 Visible Mods",
value: formatMods(data.onlineMods),
inline: false,
},
{
name: "🕵️ Undercover Mods",
value: formatMods(data.undercoverMods),
inline: false,
},
{
name: "🕒 Last Update",
value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
inline: false,
},
],
footer: { text: "JANE • Growtopia Tracker" },
timestamp: new Date().toISOString(),
},
],
};
}

async function sendWebhook(payload) {
const res = await fetch(`${WEBHOOK_URL}?wait=true`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});

if (!res.ok) {
const text = await res.text();
throw new Error(`POST webhook gagal: ${res.status} ${text}`);
}

return res.json();
}

async function editWebhookMessage(messageId, payload) {
const res = await fetch(`${WEBHOOK_URL}/messages/${messageId}`, {
method: "PATCH",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});

if (!res.ok) {
const text = await res.text();
throw new Error(`PATCH webhook gagal: ${res.status} ${text}`);
}

return res.json();
}

async function tick() {
try {
const data = await fetchStatus();
const payload = buildPayload(data);

if (!lastMessageId) {
const msg = await sendWebhook(payload);
lastMessageId = msg.id;
console.log("Pesan awal terkirim:", lastMessageId);
} else {
await editWebhookMessage(lastMessageId, payload);
console.log("Pesan diupdate:", new Date().toLocaleTimeString("id-ID"));
}
} catch (err) {
console.error("Error:", err.message);
}
}

(async () => {
if (!WEBHOOK_URL || WEBHOOK_URL.includes("PASTE_WEBHOOK")) {
console.error("Isi WEBHOOK_URL dulu.");
process.exit(1);
}

console.log("Growtopia monitor started...");
await tick();

setInterval(tick, POLL_INTERVAL);
})();
