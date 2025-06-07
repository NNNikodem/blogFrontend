import React, { useEffect, useState, useRef } from "react";
import { getRequest, postRequest } from "../api/apiAccessHelper";
import TipTapEditor from "../components/TipTapEditor/TipTapEditor";
import "../css/BlogCreatePageStyle.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const BlogCreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [availableTags, setAvailableTags] = useState([]); // Renamed from tags
  const [selectedTags, setSelectedTags] = useState([]); // This will store the actual tag array
  const [customTagInput, setCustomTagInput] = useState(""); // For new custom tags
  const [mainImage, setMainImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    title: false,
    content: false,
    mainImage: false,
  });
  const navigate = useNavigate();
  const successMessageRef = useRef(null);

  // Effect for handling navigation remains the same
  useEffect(() => {
    let timeoutId;
    if (successMessage) {
      if (successMessageRef.current) {
        successMessageRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      timeoutId = setTimeout(() => {
        if (successMessage.blogId) {
          navigate(`/blog/${successMessage.blogId}-${getSlug(title)}`);
        }
      }, 1500);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [successMessage, navigate]);
  const getSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };
  // Updated fetch tags function
  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      setError(null);

      try {
        const tagsData = await getRequest("tags");
        if (tagsData) {
          setAvailableTags(tagsData);
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

  // Extract tag names for display (like in EditPage)
  const getTagString = (tags) => {
    if (!tags || !Array.isArray(tags)) return "";
    return tags.join(", ");
  };

  // Handle tag input change
  const handleTagChange = (e) => {
    const tagInput = e.target.value;
    // Split by comma, trim whitespace, and filter out empty tags
    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    setSelectedTags(tags);
  };

  // Handle adding custom tags
  const handleAddCustomTag = () => {
    const newTag = customTagInput.trim();

    // Validate the tag is not empty and not already in the list
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
      setCustomTagInput(""); // Clear input after adding
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setMainImage(selectedFile);

      // Create preview URL for the image
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    } else {
      // Clear the image and preview if no file is selected
      setMainImage(null);
      setImagePreview(null);
    }
  };

  useEffect(() => {
    // Cleanup function to revoke object URL when component unmounts or when preview changes
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleEditorUpdate = (html) => {
    setContent(html);
  };

  const validateForm = () => {
    const errors = {
      title: !title.trim(),
      content: !content.trim(),
      mainImage: !mainImage,
    };

    setValidationErrors(errors);
    return !Object.values(errors).some((isError) => isError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();

    const postRequestDto = {
      title,
      content,
      tags: selectedTags,
    };

    formData.append(
      "postRequestDto",
      new Blob([JSON.stringify(postRequestDto)], { type: "application/json" })
    );

    if (mainImage) {
      formData.append("mainImage", mainImage);
    }

    try {
      const result = await postRequest("blog", formData);

      if (!result || result.status >= 400) {
        throw new Error("Failed to create blog post");
      }

      if (result.data) {
        setSuccessMessage({
          message: "Blog bol úspešne vytvorený!",
          blogId: result.data.id,
        });
      } else if (result.id) {
        setSuccessMessage({
          message: "Blog bol úspešne vytvorený!",
          blogId: result.id,
        });
      }
    } catch (err) {
      setError(err.message || "An error occurred while creating the post");
    } finally {
      setLoading(false);
    }
  };

  // Replace the tags section in the return
  return (
    <>
      <h1>Vytvorenie nového blogu</h1>
      <div className="create-post-container">
        <form className="create-blog-form">
          {/* Title and content sections remain the same */}
          <div className="form-group">
            <label htmlFor="title">Nadpis:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={
                validationErrors.title ? "blogCreation-input-error" : ""
              }
              required
            />
            {validationErrors.title && (
              <p className="blogCreation-error-text">
                Nadpis nemôže byť prázdny
              </p>
            )}
          </div>

          <div className="form-group-editor">
            <TipTapEditor
              content={content}
              onUpdate={handleEditorUpdate}
              className={
                validationErrors.content ? "blogCreation-editor-error" : ""
              }
            />
            {validationErrors.content && (
              <p className="blogCreation-error-text">
                Obsah nemôže byť prázdny
              </p>
            )}
          </div>

          {/* Updated tag section to match BlogEditPage */}
          <div className="form-group">
            {availableTags.length > 0 && (
              <div className="blogForm-tags-list">
                <p>Dostupné kategórie:</p>
                <div className="blogForm-tags-container">
                  {availableTags.map((tag, index) => {
                    const tagName = typeof tag === "object" ? tag.name : tag;
                    const isSelected = selectedTags.includes(tagName);

                    return (
                      <div
                        key={index}
                        className={`blogForm-tag-item ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={() => {
                          // Toggle tag selection
                          const updatedTags = isSelected
                            ? selectedTags.filter((t) => t !== tagName)
                            : [...selectedTags, tagName];

                          setSelectedTags(updatedTags);
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
            {selectedTags.length > 0 && (
              <div className="blogForm-selected-tags">
                <p>Vybrané kategórie:</p>
                <div className="blogForm-tags-container">
                  {selectedTags.map((tag, index) => (
                    <div
                      key={index}
                      className="blogForm-tag-item selected"
                      onClick={() => {
                        // Remove tag when clicked
                        setSelectedTags(
                          selectedTags.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      {tag} ×
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main image upload section */}
          <div className="form-group">
            <label htmlFor="mainImage">Hlavný obrázok:</label>
            <input
              type="file"
              id="mainImage"
              name="mainImage"
              onChange={handleImageChange}
              accept="image/*"
              className={
                validationErrors.mainImage ? "blogCreation-input-error" : ""
              }
            />
            {validationErrors.mainImage && (
              <p className="blogCreation-error-text">Obrázok je povinný</p>
            )}

            {/* image preview */}
            {imagePreview && (
              <div className="blogForm-image-preview-container">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="blogForm-image-preview"
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? "Vytváram..." : "Vytvoriť"}
            </button>
          </div>
        </form>

        {/* Error and success messages*/}
        {error && (
          <div className="blogCreation-error-message">
            <h3>Error:</h3>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}

        {successMessage && (
          <div ref={successMessageRef} className="blogCreation-success-message">
            <h3>{successMessage.message}</h3>
            <p>Váš príspevok bol úspešne publikovaný.</p>
            <p>Presmerovanie na stránku blogu...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogCreatePage;
