import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home.jsx";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Helper: fetch che lancia un errore con testo utile se non è OK
    async function fetchJSON(url, options = {}) {
      const res = await fetch(url, { credentials: "omit", ...options });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text.slice(0, 300)}…`);
      }
      return res.json();
    }
    (async () => {
      try {
        // Chiamo RECENT e TOP in parallelo
        const [recentResult, topResult] = await Promise.allSettled([
          fetchJSON("/api/recent-json", { credentials: "omit" }), // tracce ascoltate di recente
          fetchJSON("/api/top-tracks-json?time_range=long_term&limit=10", {
            credentials: "omit",
          }), // top tracks personali
        ]);
        // Recently played
        if (recentResult.status === "fulfilled") {
          const recent = recentResult.value;
          console.log("Recently played (raw):", recent);
          recent.items?.forEach((item, i) => {
            const t = item.track;
            const artists = (t?.artists || []).map((a) => a.name).join(", ");
            console.log(
              `${i + 1}. ${t?.name} — ${artists} | Album: ${
                t?.album?.name
              } | Played at: ${item.played_at}`
            );
          });
        } else {
          console.error("Errore /recent-json:", recentResult.reason);
        }
        // Top tracks
        if (topResult.status === "fulfilled") {
          const top = topResult.value;
          console.log("Top tracks (raw):", top);
          top.items?.forEach((t, i) => {
            const artists = (t?.artists || []).map((a) => a.name).join(", ");
            console.log(
              `${i + 1}. ${t?.name} — ${artists} | Album: ${t?.album?.name}`
            );
          });
        } else {
          console.error("Errore /top-tracks-json:", topResult.reason);
        }
      } catch (e) {
        // Catch generale (es. rete down)
        console.error("Errore fetch combinato:", e);
      }
    })();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
