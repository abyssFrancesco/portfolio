/* eslint-env node */
/* global fetch, Request, Response, Headers */
import { getAccessToken } from './spotify-helpers.js';

export default async function handler(req, res) {
  try {
    const limit = Math.min(parseInt((req.query && req.query.limit) || '10', 10), 50);
    const access = await getAccessToken();

    const url = new URL('https://api.spotify.com/v1/me/player/recently-played');
    url.searchParams.set('limit', String(limit));

    const r = await fetch(url, { headers: { Authorization: `Bearer ${access}` } });
    const data = await r.json();

    return res.status(r.status).json(data);
  } catch (e) {
    console.error('Errore /recent-json:', e);
    return res.status(500).json({ error: 'server_error', message: String(e) });
  }
}