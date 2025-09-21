const MY_ACCESS_TOKEN =
  "AQBwyEyyQXq22MKKgt8wPlJPx6PaRKhUoeVfGdO7QWtTfLLGnDSOY6bzCRk8FOxPH57TLi6gjdPEHOLxuIOoBvEAehxDGQ-NtNb-qEbGCfSo0vzsRI2yHoSUOwhf6LUqKDDfxsQbA8dNOdBouopSoa00NzY6Ccj-QzpqD-NNxEaMYPLD8g6xbYuDJ-AQoM29VuRAiNDmbiD-btO8txf4a8CWBj2neg";


// 🎵 Canzoni recentemente ascoltate
export const getRecentTracks = async (limit = 20) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${MY_ACCESS_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Errore ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
    
  } catch (error) {
    console.error('❌ Errore canzoni recenti:', error);
    throw error;
  }
};

// 🔥 Canzoni più ascoltate dell'ultimo mese
export const getTopTracks = async (limit = 20) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=short_term`,
      {
        headers: {
          'Authorization': `Bearer ${MY_ACCESS_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Errore ${response.status}`);
    }

    const data = await response.json();
    return data.items || [];
    
  } catch (error) {
    console.error('❌ Errore top tracks:', error);
    throw error;
  }
};