/* eslint-env node */
/* global fetch, Request, Response, Headers */
import { getAccessToken } from './spotify-helpers.js';

export default async function handler(req, res) {
  try {
    const time_range = (req.query && req.query.time_range) || 'medium_term';
    const limit = Math.min(parseInt((req.query && req.query.limit) || '20', 10), 50);
    const offset = parseInt((req.query && req.query.offset) || '0', 10);

    const access = await getAccessToken();

    const url = new URL('https://api.spotify.com/v1/me/top/tracks');
    url.searchParams.set('time_range', time_range);
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('offset', String(offset));

    const r = await fetch(url, { headers: { Authorization: `Bearer ${access}` } });
    const data = await r.json();

    return res.status(r.status).json(data);
  } catch (e) {
    console.error('Errore /top-tracks-json:', e);
    return res.status(500).json({ error: 'server_error', message: String(e) });
  }
}