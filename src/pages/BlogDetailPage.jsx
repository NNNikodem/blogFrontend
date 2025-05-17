import React, { useState, useEffect } from "react";
import { getRequest, isLoading, getError } from "../api/apiAccessHelper";
import "../css/BlogDetailPageStyle.css";
import TagList from "../components/TagsList";
import { useParams } from "react-router-dom";
const BlogDetailPage = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    //navigate(-1); // Navigate back to the previous page
    console.log("Back button clicked");
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
          Back
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-container">
        <p>No blog found</p>
        <button className="back-button" onClick={handleBackClick}>
          Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="blog-detail-container">
        <div className="blog-detail-image-container">
          <img src={blog.mainImageUrl} alt="" />
          <span>{formattedDate}</span>
        </div>
        <h1 className="blog-detail-title">{blog.title}</h1>
        <div className="blog-detail-meta">
          <span className="blog-detail-published">By: {blog.author}</span>
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
