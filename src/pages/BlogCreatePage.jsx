import React, { useEffect, useState, useRef } from "react";
import { postRequest } from "../api/apiAccessHelper";
import TipTapEditor from "../components/TipTapEditor/TipTapEditor";
import "../css/BlogCreatePageStyle.css";
import { useNavigate } from "react-router-dom";

const BlogCreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [mainImage, setMainImage] = useState(null);
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

  // Add effect to handle navigation after success message and scroll to success message
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
        if (successMessage.blogId) {
          navigate(`/blog/${successMessage.blogId}`);
        }
      }, 3000);
    }

    // Clean up timeout if component unmounts
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [successMessage, navigate]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

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
    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      return; // Stop submission if validation fails
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Create form data object
    const formData = new FormData();

    // Convert tags string to array and create post request DTO
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const postRequestDto = {
      title,
      content,
      tags: tagsArray,
    };

    // Add the post data as JSON string
    formData.append(
      "postRequestDto",
      new Blob([JSON.stringify(postRequestDto)], { type: "application/json" })
    );

    // Add image if present
    if (mainImage) {
      formData.append("mainImage", mainImage);
    }

    try {
      const result = await postRequest("blog", formData);

      if (!result || result.status >= 400) {
        throw new Error("Failed to create blog post");
      }

      // Set success message with blog ID for navigation
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

  return (
    <main>
      <h1>Vytvorenie nového blogu</h1>
      <div className="create-post-container">
        <form className="create-blog-form">
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

          <div>
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

          <div className="form-group">
            <label htmlFor="tags">Tagy (oddelené čiarkou):</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="tag1, tag2, tag3"
            />
          </div>

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
          </div>
          <div className="form-group">
            <button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? "Creating..." : "Vytvoriť blog"}
            </button>
          </div>
        </form>

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
    </main>
  );
};

export default BlogCreatePage;
