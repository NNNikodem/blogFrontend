import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BlogSidebarItem = ({ children, navPath, faIcon, onClick }) => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onClick) {
      onClick();
    }
  };

  return (
    <li className="sidebar-nav-item">
      <NavLink
        to={navPath}
        onClick={handleClick}
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <FontAwesomeIcon icon={faIcon} className="sidebar-nav-icon" />
        <span>{children}</span>
      </NavLink>
    </li>
  );
};

export default BlogSidebarItem;
