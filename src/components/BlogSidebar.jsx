import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../css/SidebarStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNewspaper,
  faPlus,
  faPuzzlePiece,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import BlogSidebarItem from "./BlogSidebarItem";
import { useAuth } from "../context/AuthContext";

const BlogSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, isAuthenticated, isAdmin } = useAuth();

  // Function to close sidebar - will be passed to sidebar items
  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

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
          <BlogSidebarItem
            navPath={"/blogs"}
            faIcon={faNewspaper}
            onClick={closeSidebar}
          >
            Blogy
          </BlogSidebarItem>
          {isAuthenticated && (
            <BlogSidebarItem
              navPath={"/create"}
              faIcon={faPlus}
              onClick={closeSidebar}
            >
              Vytvoriť Blog
            </BlogSidebarItem>
          )}
          {isAdmin && (
            <BlogSidebarItem
              navPath={"/components"}
              faIcon={faPuzzlePiece}
              onClick={closeSidebar}
            >
              Komponenty
            </BlogSidebarItem>
          )}
        </ul>
      </aside>
    </>
  );
};

export default BlogSidebar;
