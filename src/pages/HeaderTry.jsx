import React, { useState, useEffect, useRef } from "react";
import "../css/BlogHeaderStyle.css";
import NavButtonFeitCITY from "../components/NavButtonFeitCITY.jsx";
import NavDropdown from "../components/NavDropdown.jsx";

const HeaderTry = () => {
  const basePageUrl = "https://feitcity.sk/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  const handleHomeClick = () => {
    window.location.href = "https://feitcity.sk/";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        hamburgerRef.current &&
        !menuRef.current.contains(event.target) &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Effect to disable scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Disable scrolling on the main page
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      // Re-enable scrolling when menu is closed
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="blog-header">
      {/* Add both logos with different classes */}
      <img
        src="/src/assets/feitImages/feit-logo-white.png"
        alt="default-logo"
        className="logo logo-desktop"
        onClick={handleHomeClick}
      />
      <img
        src="/src/assets/feitImages/feit-logo-black.png"
        alt="default-logo"
        className="logo logo-mobile"
        onClick={handleHomeClick}
      />

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <ul className="nav-links">
          <NavButtonFeitCITY path={"#ofakulte"}>O Fakulte</NavButtonFeitCITY>
          <NavButtonFeitCITY path={"#preco"}>Prečo na FEIT?</NavButtonFeitCITY>
          <NavButtonFeitCITY path={"#costudovat"}>
            Čo študovať?
          </NavButtonFeitCITY>
          <NavButtonFeitCITY path={"dod"}>DOD</NavButtonFeitCITY>
          <NavDropdown isMobile={false}>Viac</NavDropdown>
          <NavButtonFeitCITY path={"#faq"}>FAQ</NavButtonFeitCITY>
        </ul>
      </nav>

      {/* Keep button visible always */}
      <button
        onClick={() => (window.location.href = `${basePageUrl}prihlaska`)}
      >
        Podaj Prihlášku
      </button>

      {/* Hamburger Menu Icon */}
      <div
        className="hamburger-menu"
        onClick={toggleMobileMenu}
        ref={hamburgerRef}
      >
        <div className={`hamburger-icon ${mobileMenuOpen ? "open" : ""}`}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}
        ref={menuRef}
      >
        <ul className="mobile-nav-links">
          <NavButtonFeitCITY path={"#ofakulte"}>O fakulte</NavButtonFeitCITY>
          <NavButtonFeitCITY path={"#preco"}>Prečo na FEIT?</NavButtonFeitCITY>
          <NavButtonFeitCITY path={"#costudovat"}>
            Čo študovať?
          </NavButtonFeitCITY>
          <NavButtonFeitCITY path={"dod"}>DOD</NavButtonFeitCITY>
          <NavDropdown isMobile={true}>Viac</NavDropdown>
          <NavButtonFeitCITY path={"#faq"}>FAQ</NavButtonFeitCITY>
        </ul>
      </div>
    </header>
  );
};

export default HeaderTry;
