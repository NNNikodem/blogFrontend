import React, { useState, useEffect } from "react";
import { getRequest, isLoading, getError } from "../api/apiAccessHelper";
import "../css/BlogDetailPageStyle.css";
import TagList from "../components/TagsList";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faUser,
  faTags,
  faArrowLeft,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BlogDetailPage = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  let formattedDate = "";
  //const navigate = useNavigate();
  const { blogId } = useParams();
  if (blog) {
    formattedDate = blog.createdAt
      ? new Date(blog.createdAt).toLocaleDateString("sk-SK", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "Date unavailable";
  }

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const response = await getRequest(`blog/${blogId}`);
        setBlog(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching blog details:", err);
        setError("Failed to load blog. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlogDetails();
    }
  }, []);

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };
  const handleFetchBlogsByTag = async (tagName = "") => {
    setLoading(true);
    setError(null);

    const data = await getRequest(`blog/tags?tagNames=${tagName}`);

    if (data) {
      setBlogs(data.content || []);
      setPageInfo({
        currentPage: 0,
        totalPages: Math.ceil(data.totalCount / searchSize) || 0,
        totalItems: data.totalCount || 0,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setError("Failed to fetch blogs. Please try again later.");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="blog-detail-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-detail-container">
        <p className="error-message">{error}</p>
        <button className="back-button" onClick={handleBackClick}>
          <FontAwesomeIcon icon={faArrowLeft} /> Späť
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-container">
        <p>Blog nebol nájdený.</p>
        <button className="back-button" onClick={handleBackClick}>
          <FontAwesomeIcon icon={faArrowLeft} /> Späť
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="blog-detail-container">
        <div className="blog-detail-image-container">
          <img src={blog.mainImageUrl} alt="" />
          <span>
            <FontAwesomeIcon icon={faCalendarAlt} /> {formattedDate}
          </span>
        </div>
        <h1 className="blog-detail-title">{blog.title}</h1>
        <div className="blog-detail-tags">
          <FontAwesomeIcon icon={faTags} className="tag-icon" />
          {blog.tags && blog.tags.length > 0 ? (
            blog.tags.map((tag, index) => (
              <span className="blog-detail-tag" key={index}>
                {tag.name}
              </span>
            ))
          ) : (
            <span className="blog-detail-tag-placeholder">
              žiadne kategórie
            </span>
          )}
        </div>
        <div className="blog-detail-meta">
          <span className="blog-detail-published">
            <FontAwesomeIcon icon={faUser} /> Autor: {blog.author}
          </span>
          {blog.readingTime && (
            <span className="blog-detail-reading-time">
              <FontAwesomeIcon icon={faClock} /> {blog.readingTime} min read
            </span>
          )}
        </div>
        <div
          className="blog-detail-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </>
  );
};

export default BlogDetailPage;
