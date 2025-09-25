/* eslint-env node */
/* global fetch, Request, Response, Headers */
import { basicAuth } from './spotify-helpers.js';

export default async function handler(req, res) {
  try {
    const { code } = req.query || {};
    const { SPOTIFY_REDIRECT_URI } = process.env;

    if (!code) return res.status(400).send('Missing ?code');
    if (!SPOTIFY_REDIRECT_URI) return res.status(500).send('Missing SPOTIFY_REDIRECT_URI');

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    });

    const r = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: basicAuth(),
      },
      body: body.toString(),
    });

    const data = await r.json();
    if (!r.ok) return res.status(500).json(data);

    console.log('ACCESS TOKEN:', data.access_token);
    console.log('REFRESH TOKEN:', data.refresh_token);

    return res
      .status(200)
      .send('OK. Controlla i log di Vercel e imposta SPOTIFY_REFRESH_TOKEN nelle env del progetto.');
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'callback_error', message: String(e) });
  }
}