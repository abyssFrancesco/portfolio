/* eslint-env node */
export default function handler(req, res) {
  const SCOPES = ['user-read-recently-played', 'user-top-read'];
  const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
    return res.status(500).send('Missing SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI');
  }

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: SCOPES.join(' '),
    show_dialog: 'true',
  });

  res.redirect('https://accounts.spotify.com/authorize?' + params.toString());
}