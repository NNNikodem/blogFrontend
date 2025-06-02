import React, { useState, useEffect, useRef } from "react";
import "../css/BlogHeaderStyle.css";
import NavButtonFeitCITY from "./NavButtonFeitCITY.jsx";
import NavDropdown from "./NavDropdown.jsx";
import { getRequest, isLoading, getError } from "../api/apiAccessHelper.js";
import ImageButton from "./ImageButton.jsx";

const Header = () => {
  const basePageUrl = "https://feitcity.sk/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const [headerData, setHeaderData] = useState([]);
  const [dropdownItems, setDropdownItems] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const handleHomeClick = () => {
    window.location.href = basePageUrl;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  //Effect to fetch header items from backend
  useEffect(() => {
    const fetchHeaderItems = async () => {
      try {
        const response = await getRequest(`components/menu`);
        if (response) {
          console.log("Header items fetched successfully:", response);
          setHeaderData(response);
          setMenuItems(response.menuItems || []);
          setDropdownItems(
            response.dropdownMenuItems[0].dropdownMenuItems || []
          );
        } else {
          console.error("Failed to fetch header items");
        }
      } catch (error) {
        console.error("Error fetching header items:", error);
      }
    };
    fetchHeaderItems();
  }, []);

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

  if (isLoading() == true) {
    return <div className="loading-indicator">Loading...</div>;
  }
  if (getError() != null) {
    return (
      <div className="error-indicator">
        Error: {getError().message || "Failed to load header data"}
      </div>
    );
  }
  return (
    <header className="blog-header">
      {/* Add both logos with different classes */}
      <ImageButton
        imageSrc="/src/assets/feitImages/feit-logo-white.png"
        altText="default-logo"
        imageClassName="logo logo-desktop"
        navPath={basePageUrl}
      />
      <ImageButton
        imageSrc="/src/assets/feitImages/feit-logo-black.png"
        altText="default-logo"
        imageClassName="logo logo-mobile"
        navPath={basePageUrl}
      />

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        <ul className="nav-links">
          {Array.isArray(menuItems) && menuItems.length > 0 ? (
            menuItems
              .filter((item) => item.url !== "#faq")
              .map((item) => (
                <NavButtonFeitCITY key={item.id} path={item.url}>
                  {item.text}
                </NavButtonFeitCITY>
              ))
          ) : (
            //fallback to hardcoded items if no data is available
            <>
              <NavButtonFeitCITY path={"#ofakulte"}>
                O Fakulte
              </NavButtonFeitCITY>
              <NavButtonFeitCITY path={"#preco"}>
                Prečo na FEIT?
              </NavButtonFeitCITY>
              <NavButtonFeitCITY path={"#costudovat"}>
                Čo študovať?
              </NavButtonFeitCITY>
              <NavButtonFeitCITY path={"dod"}>DOD</NavButtonFeitCITY>
            </>
          )}
          {dropdownItems?.length > 0 && (
            <NavDropdown isMobile={false} dropdownData={dropdownItems}>
              Viac
            </NavDropdown>
          )}
          {/* Check if FAQ exists in menuItems*/}
          {menuItems.some((item) => item.url === "#faq") && (
            <NavButtonFeitCITY path={"#faq"}>FAQ</NavButtonFeitCITY>
          )}
        </ul>
      </nav>

      {/* Header button */}
      {headerData.button && (
        <button
          className="blog-header-button"
          onClick={() =>
            (window.location.href = `${basePageUrl}${headerData.button.url}`)
          }
        >
          {headerData.button.text}
        </button>
      )}

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
          {dropdownItems?.length > 0 && (
            <NavDropdown isMobile={true} dropdownData={dropdownItems}>
              {headerData.dropdownMenuItems[0].text}
            </NavDropdown>
          )}
          <NavButtonFeitCITY path={"#faq"}>FAQ</NavButtonFeitCITY>
        </ul>
      </div>
    </header>
  );
};

export default Header;
