/* eslint-env node */
/* global fetch, Request, Response, Headers */
import { Buffer } from 'node:buffer';

export function basicAuth() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET');
  }
  return 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
}

export async function getAccessToken() {
  const { SPOTIFY_REFRESH_TOKEN } = process.env;
  if (!SPOTIFY_REFRESH_TOKEN) throw new Error('Missing SPOTIFY_REFRESH_TOKEN');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: SPOTIFY_REFRESH_TOKEN,
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
  if (!r.ok) throw new Error(`Token error ${r.status}: ${JSON.stringify(data)}`);
  return data.access_token;
} 