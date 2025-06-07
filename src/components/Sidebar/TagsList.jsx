import React, { useState, useEffect } from "react";
import TagButton from "./TagButton";
import "../../css/Components/TagsList.css";
import { getRequest } from "../../api/apiAccessHelper";

const TagList = ({ activeTag, onSelectTag }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //fetch tags from api/v1/tags
  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);

      try {
        const tagsData = await getRequest("tags");
        if (tagsData) {
          setTags(tagsData);
        } else {
          setError("Failed to fetch tags. Please try again later.");
        }
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
    <>
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
    </>
  );
};

export default TagList;
