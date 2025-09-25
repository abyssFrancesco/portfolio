import React from "react";
import "./Navbar.css";
import lighticon from "../../assets/icons8-sun.svg";
import pfp from "../../assets/pfp.png";

function Navbar() {
  const handleDownload = () => {
    const fileName = "Francesco Maria Gragnaniello cv.pdf"; // si trova in /public
    const href = `${import.meta.env.BASE_URL}${encodeURIComponent(fileName)}`;
    const a = document.createElement("a");
    a.href = href;
    a.download = "Francesco_Maria_Gragnaniello_CV.pdf"; // nome del file salvato
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <>
      <div className="navbar-box B">
        <div className="pfp IB">
          <img src={pfp} alt="" />
        </div>

        <div className="navbar IB">
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
          </div>{" "}
{/*           <div className="light-icon IB">
            <img src={lighticon} alt="" />
          </div> */}
{/*           <div className="resume">
            <button type="button" onClick={handleDownload}>
              Resume
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Navbar;
