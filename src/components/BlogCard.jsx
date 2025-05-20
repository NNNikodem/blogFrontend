import React from "react";
import "../css/BlogsPageStyle.css";
import { useNavigate } from "react-router-dom";
import "../css/Components/BlogCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faUser,
  faTags,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

const BlogCard = ({ blogData, onEditBlog, onViewMore, onClickTag }) => {
  const { title, content, tags, createdAt, author, mainImageUrl, id } =
    blogData;
  const navigate = useNavigate();

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("sk-SK", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Date unavailable";
  const handleClick = (viewORedit) => {
    navigate(`/${viewORedit}/${id}`);
  };
  return (
    <section key={id} className="blog-card">
      {mainImageUrl !== null && (
        <div className="blog-image-container">
          <img
            src={mainImageUrl}
            alt={`Image for ${title}`}
            className="blog-image"
            onClick={() => {
              handleClick("blog");
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/400x200?text=Image+Not+Available";
            }}
          />
        </div>
      )}
      <h2
        className="blog-title"
        onClick={() => {
          handleClick("blog");
        }}
      >
        {title}
      </h2>
      <p className="blog-published">
        <FontAwesomeIcon icon={faUser} className="blog-icon" />{" "}
        {author || "Unknown"},
        <FontAwesomeIcon icon={faCalendarAlt} className="blog-icon" />{" "}
        {formattedDate}
      </p>

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      <div className="blog-tags">
        <FontAwesomeIcon icon={faTags} className="blog-icon" />
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <span
              key={index}
              className="blog-tag"
              onClick={() => onClickTag(tag.name)}
            >
              {tag.name}
            </span>
          ))
        ) : (
          <span className="blog-tag-placeholder">žiadne kategórie</span>
        )}
      </div>
      <div className="blog-card-buttons-container">
        <button
          className="blog-card-view-button"
          onClick={() => {
            handleClick("blog");
          }}
        >
          <FontAwesomeIcon icon={faEye} /> Zobraziť
        </button>
      </div>
      <hr />
    </section>
  );
};

export default BlogCard;
