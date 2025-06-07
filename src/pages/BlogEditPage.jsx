import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TipTapEditor from "../components/TipTapEditor/TipTapEditor";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getRequest, postRequest } from "../api/apiAccessHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const BlogEditPage = () => {
  const [blogData, setBlogData] = useState(null);
  const [originalTags, setOriginalTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const { blogId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    title: false,
    content: false,
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const successMessageRef = useRef(null);
  const [customTagInput, setCustomTagInput] = useState("");

  const getSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };
  // Add effect to handle navigation after success message
  useEffect(() => {
    let timeoutId;
    if (successMessage) {
      // Scroll to success message
      if (successMessageRef.current) {
        successMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      // Navigate to blog after showing success message
      timeoutId = setTimeout(() => {
        navigate(`/blog/${blogId}-${getSlug(blogData.title)}`);
      }, 1500); // 1.5 sec delay
    }

    // Clean up timeout if component unmounts
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [successMessage, navigate, blogId]);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const data = await getRequest(`blog/${blogId}`);

        if (!data) {
          throw new Error("Failed to fetch blog data");
        }
        // Convert any object tags to strings for consistency with create blog
        const normalizedTags = (data.tags || []).map((tag) =>
          typeof tag === "object"
            ? tag.name || tag.tagName || tag.value || ""
            : tag
        );
        // Set blogData with normalized string tags
        setBlogData({
          ...data,
          tags: normalizedTags,
        });
        // Store original tags for later comparison
        setOriginalTags(normalizedTags);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsData = await getRequest("tags");
        if (tagsData) {
          setAvailableTags(tagsData);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleEditorUpdate = (html) => {
    setBlogData((prev) => ({
      ...prev,
      content: html,
    }));
  };

  const validateForm = () => {
    const errors = {
      title: !blogData.title?.trim(),
      content: !blogData.content?.trim(),
    };

    setValidationErrors(errors);
    return !Object.values(errors).some((isError) => isError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      return; // Stop submission if validation fails
    }

    setLoading(true);
    try {
      // Create a copy of the blog data for the update
      const updatedBlog = { ...blogData };
      const response = await postRequest(`blog/${blogId}`, updatedBlog);

      if (response) {
        setSuccess(true);
        setSuccessMessage({
          message: "Blog bol úspešne aktualizovaný!",
          blogId: blogId,
        });
        console.log("Blog bol úspešne aktualizovaný:", response);
      }
    } catch (error) {
      console.error("Chyba pri aktualizovaní blogu:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Extract tag names for display
  const getTagString = (tags) => {
    if (!tags || !Array.isArray(tags)) return "";
    return tags.join(", ");
  };

  // Parse tag input and convert to simple string tags like in BlogCreate
  const handleTagChange = (e) => {
    const tagInput = e.target.value;
    // Split by comma, trim whitespace, and filter out empty tags
    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    // Update blogData with plain string tags (not objects)
    setBlogData({
      ...blogData,
      tags: tags,
    });
  };

  const handleAddCustomTag = () => {
    const newTag = customTagInput.trim();

    // Validate the tag is not empty and not already in the list
    if (newTag && (!blogData.tags || !blogData.tags.includes(newTag))) {
      // Update blogData with the new tag
      setBlogData({
        ...blogData,
        tags: [...(blogData.tags || []), newTag],
      });

      // Clear the input
      setCustomTagInput("");
    }
  };

  if (loading) return <div>Načítavam...</div>;
  if (error) return <div>Chyba: {error}</div>;
  if (!blogData) return <div>Blog nebol nájdený</div>;

  return (
    <>
      <h1>Úprava blogu</h1>
      <div className="create-post-container">
        <form onSubmit={handleSubmit} className="create-blog-form">
          <div className="form-group">
            <label htmlFor="title">Nadpis:</label>
            <input
              type="text"
              id="title"
              value={blogData.title || ""}
              onChange={(e) =>
                setBlogData({ ...blogData, title: e.target.value })
              }
              className={
                validationErrors.title ? "blogCreation-input-error" : ""
              }
              required
            />
            {validationErrors.title && (
              <p className="blogCreation-error-text">
                Nadpis nemôže byť prázdny.
              </p>
            )}
          </div>
          <div className="form-group-tiptap-editor">
            <label htmlFor="content">Obsah:</label>
            <TipTapEditor
              content={blogData.content}
              onUpdate={handleEditorUpdate}
              className={
                validationErrors.content ? "blogCreation-editor-error" : ""
              }
            />
            {validationErrors.content && (
              <p className="blogCreation-error-text">
                Obsah nemôže byť prázdny.
              </p>
            )}
          </div>
          <div className="form-group">
            {availableTags.length > 0 && (
              <div className="blogForm-tags-list">
                <p>Dostupné kategórie:</p>
                <div className="blogForm-tags-container">
                  {availableTags.map((tag, index) => {
                    const tagName = typeof tag === "object" ? tag.name : tag;
                    const isSelected =
                      blogData.tags && blogData.tags.includes(tagName);

                    return (
                      <div
                        key={index}
                        className={`blogForm-tag-item ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => {
                          // Toggle tag selection
                          const updatedTags = isSelected
                            ? blogData.tags.filter((t) => t !== tagName)
                            : [...(blogData.tags || []), tagName];

                          setBlogData({
                            ...blogData,
                            tags: updatedTags,
                          });
                        }}
                      >
                        {tagName}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="blogForm-custom-tag-section">
              <input
                type="text"
                placeholder="Pridať vlastnú kategóriu"
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                disabled={!customTagInput.trim()}
                className="blogForm-add-tag-button"
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>

            {/* Display selected tags for better visibility */}
            {blogData.tags && blogData.tags.length > 0 && (
              <div className="blogForm-selected-tags">
                <p>Vybrané kategórie:</p>
                <div className="blogForm-tags-container">
                  {blogData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="blogForm-tag-item selected"
                      onClick={() => {
                        // Remove tag when clicked
                        setBlogData({
                          ...blogData,
                          tags: blogData.tags.filter((_, i) => i !== index),
                        });
                      }}
                    >
                      {tag} ×
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="form-group">
            <button type="submit" disabled={loading}>
              {loading ? "Aktualizujem..." : "Aktualizovať"}
            </button>
          </div>
        </form>

        {error && (
          <div className="blogCreation-error-message">
            <h3>Chyba:</h3>
            <pre>{error}</pre>
          </div>
        )}

        {successMessage && (
          <div ref={successMessageRef} className="blogCreation-success-message">
            <h3>{successMessage.message}</h3>
            <p>Blog bol úspešne aktualizovaný.</p>
            <p>Presmerúvavam na stránku blogu...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogEditPage;
