import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ marginRight: 50 }}>
          <h3 style={{ fontWeight: "bold" }}>Question not answered?</h3>
          <p>Contact us at firstyeareng@ryerson.ca</p>
        </div>
        <div>
          <h3 style={{ fontWeight: "bold" }}>Are you an FYEO employee? </h3>
          <Link to="/staff">Sign in</Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
