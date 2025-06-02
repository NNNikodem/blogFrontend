import React, { useState } from "react";
import NavDropdownItem from "./NavDropdownItem";

const NavDropdown = ({ children, isMobile, dropdownData }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const basePageUrl = "https://feitcity.sk/";

  // Process URL to handle hash references
  const processUrl = (url) => {
    if (!url) return basePageUrl;

    // If URL starts with #, combine with basePageUrl
    if (url.startsWith("#")) {
      return `${basePageUrl}${url}`;
    }

    // Otherwise return the URL as is
    return url;
  };

  // Create dropdown items list from dropdownData
  const dropdownItems = (
    <>
      {Array.isArray(dropdownData) && dropdownData.length > 0 ? (
        dropdownData.map((item) => (
          <NavDropdownItem
            key={item.id}
            navPath={processUrl(item.url)}
            target={item.url?.startsWith("http") ? "_blank" : undefined}
          >
            {item.text}
          </NavDropdownItem>
        ))
      ) : (
        // Fallback to hardcoded items if no data is available
        <>
          <NavDropdownItem navPath={`${basePageUrl}#zivot`}>
            Študentský život
          </NavDropdownItem>
          <NavDropdownItem navPath={`${basePageUrl}#poskole`}>
            Kam po škole?
          </NavDropdownItem>
          <NavDropdownItem
            navPath={`${basePageUrl}specialne-cvicenia/`}
            target="_blank"
          >
            Špeciálne cvičenia
          </NavDropdownItem>
          <NavDropdownItem navPath={`${basePageUrl}#feitstory`}>
            FEITstory
          </NavDropdownItem>
          <NavDropdownItem
            navPath={`https://feit.uniza.sk/tmr/`}
            target="_blank"
          >
            Technická myšlienka roka
          </NavDropdownItem>
          <NavDropdownItem navPath={`${basePageUrl}blog/`} target="_blank">
            Blog
          </NavDropdownItem>
          <NavDropdownItem navPath={`${basePageUrl}#kontakty`}>
            Kontakt
          </NavDropdownItem>
        </>
      )}
    </>
  );

  // Mobile view - show toggle to expand/collapse
  if (isMobile) {
    return (
      <>
        <li
          className="nav-item dropdown mobile-dropdown"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="dropdown-toggle mobile-toggle">
            {children}
            <span
              className={`mobile-toggle-icon ${dropdownOpen ? "open" : ""}`}
            >
              ▼
            </span>
          </span>
        </li>
        <div className={`mobile-dropdown-items ${dropdownOpen ? "open" : ""}`}>
          {dropdownItems}
        </div>
      </>
    );
  }

  // Desktop view - show on hover
  return (
    <li
      className="nav-item dropdown"
      onMouseEnter={() => setDropdownOpen(true)}
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <span className="dropdown-toggle">{children}</span>
      <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
        {dropdownItems}
      </ul>
    </li>
  );
};

export default NavDropdown;
