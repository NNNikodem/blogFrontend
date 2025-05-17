import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../css/SidebarStyle.css";
// Import Font Awesome components - make sure you have @fortawesome/react-fontawesome installed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNewspaper,
  faPlus,
  faPuzzlePiece,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const BlogSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !event.target.closest(".blog-sidebar") &&
        !event.target.closest(".sidebar-toggle")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close sidebar when window is resized to larger size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside className={`blog-sidebar ${isOpen ? "open" : ""}`}>
        <ul className="sidebar-nav-links">
          <li className="sidebar-nav-item">
            <NavLink
              to="/blogs"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FontAwesomeIcon
                icon={faNewspaper}
                className="sidebar-nav-icon"
              />
              <span>Blogy</span>
            </NavLink>
          </li>
          <li className="sidebar-nav-item">
            <NavLink
              to="/create"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FontAwesomeIcon icon={faPlus} className="sidebar-nav-icon" />
              <span>Pridaj Blog</span>
            </NavLink>
          </li>
          <li className="sidebar-nav-item">
            <NavLink
              to="/components"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <FontAwesomeIcon
                icon={faPuzzlePiece}
                className="sidebar-nav-icon"
              />
              <span>Komponenty</span>
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default BlogSidebar;
