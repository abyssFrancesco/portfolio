import React from "react";
import "./Home.css";
import Navbar from "../../Components/Navbar/Navbar";

function Home() {
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
            <div className="small-tab">
              <iframe
                data-testid="embed-iframe"
                src="https://open.spotify.com/embed/track/1Q7EgiMOuwDcB0PJC6AzON?utm_source=generator"
                width="100%"
                height="100%"
                FrameBorder="0"
                allowFullScreen=""
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
            <div className="small-tab"></div>
            <div className="small-tab"></div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
