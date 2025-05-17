import React, { useState } from "react";
import "../css/BlogHeaderStyle.css";
import NavButtonFeitCITY from "../components/NavButtonFeitCITY.jsx";
import NavDropdown from "../components/NavDropdown.jsx";

const HeaderTry = () => {
  const basePageUrl = "https://feitcity.sk/";

  const handleHomeClick = () => {
    window.location.href = "https://feitcity.sk/";
  };

  return (
    <header className="blog-header">
      <img
        src="/src/assets/feitImages/feit-logo-white.png"
        alt="default-logo"
        className="logo"
        onClick={handleHomeClick}
      />
      <nav>
        <ul className="nav-links">
          <NavButtonFeitCITY path={"#ofakulte"}>O Fakulte</NavButtonFeitCITY>
          <NavButtonFeitCITY path={"#preco"}>Prečo na FEIT?</NavButtonFeitCITY>
          <NavButtonFeitCITY path={"#costudovat"}>
            Čo študovať?
          </NavButtonFeitCITY>
          <NavButtonFeitCITY path={"dod"}>DOD</NavButtonFeitCITY>
          <NavDropdown>Viac</NavDropdown>
          <NavButtonFeitCITY path={"#faq"}>FAQ</NavButtonFeitCITY>
        </ul>
      </nav>
      <button
        onClick={() => (window.location.href = `${basePageUrl}prihlaska`)}
      >
        Podaj Prihlášku
      </button>
    </header>
  );
};

export default HeaderTry;
