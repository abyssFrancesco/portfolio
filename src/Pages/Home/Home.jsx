import React from "react";
import "./Home.css";
import Navbar from "../../Components/Navbar/Navbar";

function Home() {
  return (
    <>
      <div className="home-box B">
        <Navbar />
        <div className="home IB">
          <div className="main B">
            <div className="grid-box">
              <div className="profile-main">

              </div>
              <div className="profile-card top-card"></div>
              <div className="profile-card bottom-card"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Home;
