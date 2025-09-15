import React from "react";
/* note to self, check if the css is connected before troubleshooting */
import "./Navbar.css";
import lighticon from "../../assets/icons8-sun.svg";

function Navbar() {
  return (
    <>
      <div className="navbar-box B">
        <div className="navbar B">
          <div className="nav IB">
            <nav>
              <ul>
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#projects">Projects</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="resume">
            <button>Resume</button>
          </div>
          <div className="light-icon IB">
            <img src={lighticon} alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
export default Navbar;
