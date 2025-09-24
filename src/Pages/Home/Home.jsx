import React, { useEffect, useState } from "react";
import "./Home.css";
import Navbar from "../../Components/Navbar/Navbar";
import sptf from "../../Assets/spotify.png.png";

function Home() {
  const [view, setView] = useState("top"); // 'top' | 'recent'
  const [topTracks, setTopTracks] = useState([]); // array di track
  const [recentTracks, setRecentTracks] = useState([]); // array di track
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} - ${text.slice(0, 200)}…`);
    }
    return res.json();
  }

  function dedupeById(arr) {
    const seen = new Set();
    const out = [];
    for (const t of arr) {
      const id = t?.id;
      if (id && !seen.has(id)) {
        seen.add(id);
        out.push(t);
      }
    }
    return out;
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [recentRes, topRes] = await Promise.allSettled([
          fetchJSON("/recent-json"),
          fetchJSON("/top-tracks-json?time_range=long_term&limit=10"),
        ]);

        if (!cancelled) {
          if (recentRes.status === "fulfilled") {
            const items = recentRes.value?.items || [];
            const tracksOnly = items.map((i) => i?.track).filter(Boolean);
            setRecentTracks(dedupeById(tracksOnly));
          } else {
            setError(
              recentRes.reason?.message || "Errore caricamento 'recent'"
            );
          }

          if (topRes.status === "fulfilled") {
            setTopTracks(topRes.value?.items || []);
          } else {
            setError(topRes.reason?.message || "Errore caricamento 'top'");
          }
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const embedUrlFromTrack = (track) =>
    track?.id ? `https://open.spotify.com/embed/track/${track.id}` : null;

  const dataToShow = view === "top" ? topTracks : recentTracks;

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

          {/* Griglia: main-tab = contiene il toggle */}
          <div className="small-grid-box B">
            <div className="main-tab B">
              <div className="text-img IB">
                <img src={sptf} alt="" />
                <h3>My Vibe</h3>
              </div>
              <p>What I'm listening to on Spotify</p> 
              <div
                className="toggle"
                role="tablist"
                aria-label="Seleziona elenco tracce"
              >
                <button
                  type="button"
                  onClick={() => setView("top")}
                  aria-pressed={view === "top"}
                  className={`toggle__btn ${
                    view === "top" ? "toggle__btn--active" : ""
                  }`}
                >
                  Most Listened
                </button>

                <button
                  type="button"
                  onClick={() => setView("recent")}
                  aria-pressed={view === "recent"}
                  className={`toggle__btn ${
                    view === "recent" ? "toggle__btn--active" : ""
                  }`}
                >
                  Recently Played
                </button>
              </div>
            </div>

            {loading && <div className="status"></div>}
            {!loading && error && (
              <div className="status status--error">Errore: {error}</div>
            )}

            {!loading &&
              !error &&
              dataToShow.slice(0, 3).map((t, idx) => {
                const src = embedUrlFromTrack(t);
                return (
                  <div className="small-tab IB" key={t?.id || idx}>
                    {src ? (
                      <iframe
                        className="embed"
                        data-testid="embed-iframe"
                        src={src}
                        title={`spotify-embed-${t?.name || "track"}-${
                          t?.id || idx
                        }`}
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    ) : (
                      <div className="placeholder">Traccia non disponibile</div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
