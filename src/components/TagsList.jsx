import React, { useState, useEffect } from "react";
import TagButton from "./TagButton";
import "../css/Components/TagsList.css";

const TagList = ({ activeTag, onSelectTag }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //fetch tags from api/v1/tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/tags", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const tagsData = await response.json();
        setTags(tagsData || []);
      } catch (error) {
        setError("Failed to fetch tags. Please try again later.");
        console.error("Error fetching tags:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, []);
  return (
    <div className="tags-container">
      <h3>Kategórie</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className="tags-list">
          {tags.map((tag, index) => (
            <TagButton
              key={index}
              tagName={tag.name}
              isActive={activeTag === tag.name}
              onSelectTag={onSelectTag}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagList;
