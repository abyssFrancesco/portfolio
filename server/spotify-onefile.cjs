// Importa Express (server HTTP minimale)
const express = require("express");

// Crea un'app Express
const app = express();

// Porta su cui ascoltare (http://localhost:3000)
const PORT = 3000;

// >>> METTI QUI LE TUE CHIAVI <<<
const CLIENT_ID = "0c12021489414f568314bb8b6bba530e"; // <-- sostituisci col tuo Client ID
const CLIENT_SECRET = "2ff31d764e804ea99d7d8803536ff0cd"; // <-- sostituisci col tuo Client Secret

// Redirect URI registrata nella tua app Spotify (deve combaciare esattamente)
const REDIRECT_URI = "http://127.0.0.1:3000/callback";

// Scope minimo per “Recently Played”
const SCOPES = ["user-read-recently-played", "user-top-read"];

// Qui salveremo il refresh token una volta ottenuto (per ora vuoto)
// Dopo il primo login, incollalo qui e riavvia il server.
let REFRESH_TOKEN =
  "AQACKdUPgsvkKd9gNrYL1X6PgymXv_ildiWin0MeWiTMuP5GSL9gts0I0OPOqcZ4mtPVZJMxassbhm9ZWYwnKLjptUWdZPIKV4qR-as7KqWfI8HVEb36PffxB3E78RgqN0U";

// Utility: costruisce l'header Basic Auth richiesto da Spotify per /api/token
function basicAuthHeader() {
  return (
    "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")
  );
}

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server avviato: http://127.0.0.1:${PORT}`);
  console.log(
    "Vai su http://127.0.0.1:3000/login per ottenere il refresh token la prima volta."
  );
});
// Questa rotta ti manda alla pagina di login/consenso di Spotify.
// Dopo il login, Spotify ti rimanda al REDIRECT_URI con ?code=...
app.get("/login", (req, res) => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID, // identifica la tua app
    response_type: "code", // vogliamo un "authorization code"
    redirect_uri: REDIRECT_URI, // deve combaciare con la Dashboard
    scope: SCOPES.join(" "), // scope richiesti
    show_dialog: "true", // forza la schermata di consenso
    // state: 'qualcosa-di-random',     // opzionale: protezione CSRF
  });

  // Reindirizza a Spotify per il login/consenso
  res.redirect("https://accounts.spotify.com/authorize?" + params.toString());
});
// Questa rotta riceve ?code= da Spotify e lo scambia per i token.
// Importante: il refresh_token si ottiene qui la prima volta.
app.get("/callback", async (req, res) => {
  const code = req.query.code; // legge il "code" dalla query string
  if (!code) {
    return res.status(400).send('Manca il parametro "code" nella callback.');
  }

  // Corpo della richiesta x-www-form-urlencoded richiesto da /api/token
  const body = new URLSearchParams({
    grant_type: "authorization_code", // tipo di grant
    code, // il code che abbiamo ricevuto
    redirect_uri: REDIRECT_URI, // deve essere identico a quello usato prima
  });

  try {
    // Chiamata al token endpoint di Spotify per ottenere i token
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // formato richiesto
        Authorization: basicAuthHeader(), // Basic base64(client_id:client_secret)
      },
      body: body.toString(), // il form encodato
    });

    const data = await tokenRes.json(); // parsifica la risposta JSON

    if (!tokenRes.ok) {
      console.error("Errore nello scambio code->token:", data);
      return res
        .status(500)
        .send("Errore nello scambio token. Guarda il terminale.");
    }

    // Stampa i token in console per comodità
    console.log("ACCESS TOKEN:", data.access_token); // token breve (scade ~1h)
    console.log("REFRESH TOKEN:", data.refresh_token); // token lungo (da salvare)

    // Salva in memoria il refresh token (temporaneo finché non lo incolli nel codice)
    if (data.refresh_token) {
      REFRESH_TOKEN = data.refresh_token;
    }

    // Messaggio a schermo
    res.send(
      "OK! Guarda il terminale per i token. Copia il REFRESH TOKEN e incollalo nel codice, " +
        "poi riavvia il server. In seguito potrai usare /recent per fare il console.log delle tracce."
    );
  } catch (err) {
    console.error("Eccezione durante lo scambio token:", err);
    res
      .status(500)
      .send("Eccezione durante lo scambio token. Guarda il terminale.");
  }
});
// Usa il REFRESH_TOKEN per ottenere un nuovo ACCESS TOKEN valido (~1h)
async function refreshAccessToken() {
  if (!REFRESH_TOKEN) {
    throw new Error(
      "Manca REFRESH_TOKEN. Fai prima il login su /login e prendi il refresh token."
    );
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token", // diciamo a Spotify che stiamo rinfrescando
    refresh_token: REFRESH_TOKEN, // il nostro refresh token salvato
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // formato richiesto
      Authorization: basicAuthHeader(), // Basic base64(client_id:client_secret)
    },
    body: body.toString(), // il form encodato
  });

  const data = await res.json(); // risposta JSON

  if (!res.ok) {
    throw new Error("Refresh fallito: " + JSON.stringify(data));
  }

  // A volte Spotify potrebbe restituire un nuovo refresh_token: se succede, aggiorniamolo
  if (data.refresh_token) {
    REFRESH_TOKEN = data.refresh_token;
    console.log("Refresh token aggiornato.");
  }

  // Ritorna solo l'access token, che ci serve per le API
  return data.access_token;
}
// Chiama l'endpoint delle tracce ascoltate di recente
async function getRecentlyPlayed(accessToken, limit = 10) {
  const url = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`, // Bearer token valido
    },
  });

  const data = await res.json(); // parsifica la risposta JSON

  if (!res.ok) {
    throw new Error("Errore Spotify API: " + JSON.stringify(data));
  }

  return data; // struttura: { items: [...], next: ..., ... }
}

// Chiama "Get User's Top Tracks"
async function getTopTracks(
  accessToken,
  { time_range = "medium_term", limit = 20, offset = 0 } = {}
) {
  const url = new URL("https://api.spotify.com/v1/me/top/tracks");
  url.searchParams.set("time_range", time_range); // 'short_term' (~4 settimane), 'medium_term' (~6 mesi), 'long_term' (anni)
  url.searchParams.set("limit", Math.min(limit, 50)); // max 50
  url.searchParams.set("offset", offset);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error("Errore Spotify Top Tracks: " + JSON.stringify(data));
  return data; // { items: [...], total, limit, offset }
}
// Rotta /recent: refresha il token, chiama le API e fa console.log
app.get("/recent", async (req, res) => {
  try {
    const accessToken = await refreshAccessToken(); // ottieni un token fresco
    const data = await getRecentlyPlayed(accessToken, 10); // prendi 10 elementi

    // Console.log semplice e leggibile
    console.log("--- Tracce ascoltate recentemente ---");
    data.items.forEach((item, i) => {
      const track = item.track;
      const artists = track.artists.map((a) => a.name).join(", ");
      console.log(
        `${i + 1}. ${track.name} — ${artists} | Album: ${
          track.album.name
        } | Played at: ${item.played_at}`
      );
    });

    // Risposta minima: conferma di successo (niente dati resi)
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});
app.get("/recent-json", async (req, res) => {
  try {
    const accessToken = await refreshAccessToken();
    const data = await getRecentlyPlayed(accessToken, 10);
    res.json(data);
  } catch (err) {
    console.error("Errore /recent-json:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});
// Ritorna le top tracks come JSON, con query opzionali
app.get("/top-tracks-json", async (req, res) => {
  try {
    const time_range = req.query.time_range || "medium_term"; // short_term | medium_term | long_term
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 50);
    const offset = parseInt(req.query.offset || "0", 10);

    const accessToken = await refreshAccessToken();
    const data = await getTopTracks(accessToken, { time_range, limit, offset });
    res.json(data);
  } catch (err) {
    console.error("Errore /top-tracks-json:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});
