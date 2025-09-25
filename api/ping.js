// api/ping.js (ESM)
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).end(JSON.stringify({ ok: true, now: Date.now() }));
}