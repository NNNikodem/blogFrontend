import React, { useState } from "react";

const NavDropdown = ({ children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const basePageUrl = "https://feitcity.sk/";
  return (
    <li
      className="nav-item dropdown"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <span className="dropdown-toggle">{children}</span>
      <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
        <li className="dropdown-menu-item arrow">
          <a href={`${basePageUrl}#zivot`}>Študentský život</a>
        </li>
        <li className="dropdown-menu-item">
          <a href={`${basePageUrl}#poskole`}>Kam po škole?</a>
        </li>
        <li className="dropdown-menu-item">
          <a href={`${basePageUrl}specialne-cvicenia/`} target="_blank">
            Špeciálne cvičenia
          </a>
        </li>
        <li className="dropdown-menu-item">
          <a href={`${basePageUrl}#feitstory`}>FEITstory</a>
        </li>
        <li className="dropdown-menu-item">
          <a href="https://feit.uniza.sk/tmr/" target="_blank">
            Technická myšlienka roka
          </a>
        </li>
        <li className="dropdown-menu-item">
          <a href={`${basePageUrl}blog/`} target="_blank">
            Blog
          </a>
        </li>
        <li className="dropdown-menu-item">
          <a href={`${basePageUrl}#kontakty`}>Kontakt</a>
        </li>
      </ul>
    </li>
  );
};
export default NavDropdown;
