import React from "react";

const TagButton = ({ tagName, isActive, onSelectTag }) => {
  return (
    <li>
      <button
        className={`tags-list-button ${isActive ? "active" : ""}`}
        onClick={() => onSelectTag(tagName)}
      >
        {tagName}
      </button>
    </li>
  );
};

export default TagButton;
