import React from "react";
import "../css/BlogsPageStyle.css";
import { useNavigate } from "react-router-dom";
import "../css/Components/BlogCard.css";

const BlogCard = ({ blogData, onEditBlog, onViewMore }) => {
  const { title, content, tags, createdAt, author, mainImageUrl, id } =
    blogData;
  const navigate = useNavigate();

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("sk-SK", {
        day: "2-digit",
        month: "2-digit",
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
        {author || "Unknown"}, {formattedDate}
      </p>

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
      <div className="blog-tags">
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <span key={index} className="blog-tag">
              {tag.name}
              {index !== tags.length - 1 ? ", " : ""}
            </span>
          ))
        ) : (
          <span className="blog-tag blog-tag-placeholder">No tags</span>
        )}
      </div>
      <div className="blog-card-buttons-container">
        {/* <button
          className="blog-card-edit-button"
          onClick={() => {
            handleClick("edit");
          }}
        >
          Upraviť
        </button> */}
        <button
          className="blog-card-view-button"
          onClick={() => {
            handleClick("blog");
          }}
        >
          Zobraziť
        </button>
      </div>
      <hr />
    </section>
  );
};

export default BlogCard;
