import React from "react";
/* note to self, check if the css is connected before troubleshooting */
import "./Navbar.css";
import reactsvg from "../../Assets/react.svg";

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
          <div className="light-icon IB">
            <img src={reactsvg} alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
export default Navbar;
