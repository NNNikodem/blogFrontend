import React, { useState, useEffect } from "react";
import { getRequest, deleteRequest } from "../api/apiAccessHelper";
import "../css/BlogDetailPageStyle.css";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faUser,
  faTags,
  faArrowLeft,
  faClock,
  faImages,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import BlogTagButton from "../components/BlogTagButton";
import { useAuth } from "../context/AuthContext";

const BlogDetailPage = () => {
  const [blog, setBlog] = useState(null);
  const [open, setOpen] = useState(false);
  const [allImages, setAllImages] = useState([]);
  // Extract blogId and slug from the URL parameters
  const { blogIdAndSlug } = useParams();
  const [blogId, ...slugParts] = blogIdAndSlug.split("-");
  //helpers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, isAdmin, user } = useAuth();
  const canEdit = isAdmin || (isAuthenticated && user.name === blog?.author);
  const navigate = useNavigate();
  // Format the date for display
  let formattedDate = "Dátum neznámy";
  if (blog) {
    formattedDate = blog.createdAt
      ? new Date(blog.createdAt).toLocaleDateString("sk-SK", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "Date unavailable";
  }
  const handleTagSelect = (tagName) => {
    // Reset to page 0 when changing tags
    navigate(`/blogs?tag=${tagName}`);
  };
  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const response = await getRequest(`blog/${blogId}`);
        setBlog(response);
        setError(null);
      } catch (err) {
        console.error("Error fetching blog details:", err);
        setError("Nepodarilo sa načítať blog. Skúste to prosím neskôr.");
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    if (blogId) {
      fetchBlogDetails();
    }
  }, [blogId]);

  const openGallery = () => {
    setOpen(true);
  };
  //collect all image URLs from the blog content and main image
  useEffect(() => {
    if (blog && blog.content) {
      const contentDiv = document.querySelector(".blog-detail-content");
      if (contentDiv) {
        // Collect all image URLs including main image if available
        const imgElements = contentDiv.querySelectorAll("img");
        const imageUrls = Array.from(imgElements).map((img) => img.src);

        if (blog.mainImageUrl) {
          setAllImages([blog.mainImageUrl, ...imageUrls]);
        } else {
          setAllImages(imageUrls);
        }
      }
    }
  }, [blog]);

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };
  const getSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };
  const handleEditClick = () => {
    navigate(`/edit/${blogId}`); // Navigate to the edit page
  };
  const handleDeleteClick = () => {
    if (window.confirm("Ste si istý, že chcete vymazať tento blog?")) {
      // Call the delete API endpoint
      deleteRequest(`blog/${blogId}`)
        .then(() => {
          alert("Blog bol úspešne vymazaný.");
          navigate("/blogs"); // Navigate back to the blogs list
        })
        .catch((err) => {
          console.error("Error deleting blog:", err);
          alert("Nepodarilo sa vymazať blog. Skúste to prosím neskôr.");
        });
    }
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
      {canEdit && (
        <>
          <button
            className="blog-detail-edit-button"
            onClick={() => {
              handleEditClick();
            }}
          >
            <FontAwesomeIcon icon={faEdit} /> Upraviť
          </button>
          <button
            className="blog-detail-delete-button"
            onClick={() => {
              handleDeleteClick();
            }}
          >
            <FontAwesomeIcon icon={faTrash} /> Vymazať
          </button>
        </>
      )}
      <div className="blog-detail-container">
        <div className="blog-detail-image-container">
          <img
            src={blog.mainImageUrl}
            alt="Blog main image"
            className="blog-main-image"
          />
          <span>
            <FontAwesomeIcon icon={faCalendarAlt} /> {formattedDate}
          </span>
        </div>
        <div className="blog-data-container">
          <h1 className="blog-detail-title">{blog.title}</h1>
          <div className="blog-detail-tags">
            <FontAwesomeIcon icon={faTags} className="tag-icon" />
            {blog.tags && blog.tags.length > 0 ? (
              blog.tags.map((tag, index) => (
                <BlogTagButton
                  key={index}
                  tag={tag}
                  onSelectTag={handleTagSelect}
                  blogCard={false}
                />
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
            {allImages.length > 0 && (
              <button className="gallery-button" onClick={openGallery}>
                <FontAwesomeIcon icon={faImages} /> Galéria ({allImages.length}{" "}
                obr.)
              </button>
            )}
          </div>
          {/* BLOG OBSAH */}
          <div
            className="blog-detail-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
          <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={allImages.map((src) => ({ src }))}
            carousel={{ finite: allImages.length <= 1 }}
            render={{
              buttonNext: allImages.length > 1 ? undefined : () => null,
              buttonPrev: allImages.length > 1 ? undefined : () => null,
            }}
            controller={{
              closeOnPullDown: true,
            }}
            plugins={[Zoom]}
            zoom={{
              scrollToZoom: true,
              maxZoomPixelRatio: 5,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default BlogDetailPage;
