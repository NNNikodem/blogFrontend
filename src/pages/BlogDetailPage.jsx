import React, { useState, useEffect } from "react";
//import { useNavigate, useParams } from "react-router-dom";
import { getRequest, isLoading, getError } from "../api/apiAccessHelper";
import "../css/BlogDetailPageStyle.css";
import TagList from "../components/TagsList";

const BlogDetailPage = ({ id }) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //const navigate = useNavigate();
  const [blogId, setBlogId] = useState(id);

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
    <div className="blog-detail-container">
      <header>
        <h1>{blog.title}</h1>
      </header>
      <div className="blog-detail-main">
        <main>
          <div className="blog-detail-image-container">
            <img src={blog.mainImageUrl} alt="" />
          </div>
          <h1 className="blog-detail-title">{blog.title}</h1>
          <div className="blog-detail-meta">
            <span className="blog-detail-published">
              By: {blog.author}, {new Date(blog.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div
            className="blog-detail-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </main>
        <aside>
          <nav className="sidebar">
            {/* <h3>Search</h3>
            <input type="text" placeholder="Search blogs..." /> */}
            <hr />
            <TagList onSelectTag={handleFetchBlogsByTag} />
          </nav>
        </aside>
      </div>
    </div>
  );
};

export default BlogDetailPage;
