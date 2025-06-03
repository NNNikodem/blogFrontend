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
import { useAuth } from "../context/AuthContext";
import BlogTagButton from "./BlogTagButton";

const BlogCard = ({ blogData, onClickAuthor, onClickTag }) => {
  const { title, content, tags, createdAt, author, mainImageUrl, id } =
    blogData;
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user } = useAuth();
  const canEdit = isAdmin || (isAuthenticated && user.name === blogData.author);
  const getSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("sk-SK", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Date unavailable";
  const handleClick = (viewORedit) => {
    if (viewORedit === "blog") {
      navigate(`/blog/${id}-${getSlug(title)}`);
    } else if (viewORedit === "edit") {
      navigate(`/edit/${id}`);
    }
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
      <div className="blog-published">
        <span className="blog-author" onClick={() => onClickAuthor(author)}>
          <FontAwesomeIcon icon={faUser} className="blog-icon" />
          {author || "Neznámy autor"}
        </span>
        <span>
          <FontAwesomeIcon icon={faCalendarAlt} className="blog-icon" />{" "}
          {formattedDate}
        </span>
      </div>

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      <div className="blog-tags">
        <FontAwesomeIcon icon={faTags} className="blog-icon" />
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <BlogTagButton tag={tag} key={index} onSelectTag={onClickTag} />
          ))
        ) : (
          <span className="blog-tag-placeholder">žiadne kategórie</span>
        )}
      </div>
      <div className="blog-card-buttons-container">
        {canEdit && (
          <button
            className="blog-card-edit-button"
            onClick={() => {
              handleClick("edit");
            }}
          >
            <FontAwesomeIcon icon={faEye} /> Upraviť
          </button>
        )}
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
