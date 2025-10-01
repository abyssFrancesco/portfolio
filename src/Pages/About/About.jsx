import React from "react";
import "./About.css";
import Navbar from "../../Components/Navbar/Navbar";

function About() {
  return (
    <div className="about-box B">
      <Navbar />
      <div className="about IB">
        <div className="grid B">
          <div className="main-des">
            <div className="profile IB">
              {/*                     <img src="" alt="" />
               */}{" "}
            </div>
            <div className="description">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
                veritatis eum commodi tempora magni doloribus quisquam possimus
                et, nobis vel.
              </p>
            </div>
          </div>
          <div className="skill"></div>
        </div>
      </div>
    </div>
  );
}
export default About;
