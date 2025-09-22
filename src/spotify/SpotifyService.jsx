// ⚙️ Config
const CLIENT_ID = "TUO_CLIENT_ID";
const CLIENT_SECRET = "TUO_CLIENT_SECRET"; // solo lato backend in realtà
const REDIRECT_URI = "http://localhost:5173"; // cambia con il tuo redirect
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

// Recupera token da localStorage
let accessToken = localStorage.getItem("spotify_access_token");
let refreshToken = localStorage.getItem("spotify_refresh_token");
let tokenExpiry = localStorage.getItem("spotify_token_expiry");

// 🔑 Salvataggio token
const saveTokens = (access, refresh, expiresIn) => {
  accessToken = access;
  refreshToken = refresh || refreshToken;
  tokenExpiry = Date.now() + expiresIn * 1000;

  localStorage.setItem("spotify_access_token", accessToken);
  if (refresh) localStorage.setItem("spotify_refresh_token", refreshToken);
  localStorage.setItem("spotify_token_expiry", tokenExpiry);
};

// 🔄 Refresh token
const refreshAccessToken = async () => {
  if (!refreshToken) {
    throw new Error("Nessun refresh token disponibile. Devi rifare il login con Spotify.");
  }

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error("Errore durante il refresh del token");
  }

  const data = await response.json();
  saveTokens(data.access_token, data.refresh_token, data.expires_in);
  console.log("🔄 Token Spotify aggiornato");
  return accessToken;
};

// 📡 Wrapper fetch con gestione token scaduto
const spotifyFetch = async (url) => {
  // Se token scaduto → refresh
  if (!accessToken || Date.now() > tokenExpiry) {
    console.log("⚠️ Access token scaduto. Refresh in corso...");
    await refreshAccessToken();
  }

  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (response.status === 401) {
    console.log("⚠️ Token non valido, provo refresh...");
    await refreshAccessToken();
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  if (!response.ok) {
    throw new Error(`Errore Spotify API: ${response.status}`);
  }

  return await response.json();
};

// 🎵 Canzoni recentemente ascoltate
export const getRecentTracks = async (limit = 3) => {
  try {
    const data = await spotifyFetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`
    );
    return data.items || [];
  } catch (error) {
    console.error("❌ Errore canzoni recenti:", error);
    throw error;
  }
};

// 🔥 Canzoni più ascoltate dell'ultimo mese
export const getTopTracks = async (limit = 20) => {
  try {
    const data = await spotifyFetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=short_term`
    );
    return data.items || [];
  } catch (error) {
    console.error("❌ Errore top tracks:", error);
    throw error;
  }
};
