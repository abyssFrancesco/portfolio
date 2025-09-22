import React from "react";
import "./Home.css";
import Navbar from "../../Components/Navbar/Navbar";
import { getRecentTracks, getTopTracks } from "../../spotify/SpotifyService";
import { useState, useEffect } from "react";
function Home() {


  const [recentTracks, setRecentTracks] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSpotifyData();
  }, []);
  // Funzione per caricare tutti i dati Spotify
  const loadSpotifyData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📡 Caricamento dati Spotify...");
      // Chiamate parallele per velocizzare
      const [recentData, topData] = await Promise.all([
        getRecentTracks(10), // Ultime 10 canzoni
        getTopTracks(10), // Top 10 dell'ultimo mese
      ]);
      // Salva i dati negli stati
      setRecentTracks(recentData);
      setTopTracks(topData);
      // 📊 Console.log dei dati (come richiesto)
      console.log("🎵 CANZONI RECENTI:", recentData);
      console.log("🔥 TOP TRACKS ULTIMO MESE:", topData);
      // Esempio di come accedere ai dati specifici
      console.log("\n📋 DETTAGLI CANZONI RECENTI:");
      recentData.forEach((item, index) => {
        const track = item.track;
        console.log(`${index + 1}. ${track.name} - ${track.artists[0].name}`);
      });
      console.log("\n📋 DETTAGLI TOP TRACKS:");
      topData.forEach((track, index) => {
        console.log(`${index + 1}. ${track.name} - ${track.artists[0].name}`);
      });
    } catch (err) {
      console.error("❌ Errore nel caricamento:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="home-box B">
        <Navbar />
        <div className="home IB">
          <div className="grid-box IB">
            <div className="profile-main IB">
              <h2>hello, Francesco here</h2>
              <p>
                I'm a front-end developer based in Naples, helping companies
                build meaningful products.
              </p>
              <div className="work">
                <button>View My Work</button>
              </div>
            </div>
            <div className="side-col">
              <div className="profile-card IB">
                <p className="Bold B">👋​</p>
                <div className="desc">
                  <h4>Thinker & Designer</h4>
                  <p>Crafting exepriences</p>
                </div>
              </div>
              <div className="profile-card IB">
                <p className="Bold">​🚀​</p>
                <div className="desc">
                  <h4>Based in IT</h4>
                  <p>Naples</p>
                </div>
              </div>
            </div>
          </div>
          <div className="small-grid-box B">
            <div className="main-tab"></div>
            <div className="small-tab IB">
              <iframe
                data-testid="embed-iframe"
                src="https://open.spotify.com/embed/track/1Q7EgiMOuwDcB0PJC6AzON?utm_source=generator"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
            <div className="small-tab">
              <iframe
                data-testid="embed-iframe"
                src="https://open.spotify.com/embed/track/1Q7EgiMOuwDcB0PJC6AzON?utm_source=generator"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
            <div className="small-tab">
              <iframe
                data-testid="embed-iframe"
                src="https://open.spotify.com/embed/track/1Q7EgiMOuwDcB0PJC6AzON?utm_source=generator"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
