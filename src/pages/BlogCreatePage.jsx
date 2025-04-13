import React, { useState } from "react";
import axios from "axios";
import TipTapEditor from "../components/TipTapEditor/TipTapEditor";
import "../css/BlogCreatePageStyle.css"; // Import your CSS file for styling

const BlogCreatePage = ({ onBlogCreated }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };

  const handleEditorUpdate = (html) => {
    setContent(html);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

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
    for (let pair of formData.entries()) {
      if (pair[0] === "postRequestDto") {
        const reader = new FileReader();
        reader.readAsText(pair[1]);
      }
    }
    try {
      const result = await axios.post(
        "http://localhost:8080/api/v1/blog",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(result.data);
      onBlogCreated(result.data.id);
    } catch (err) {
      setError(
        err.response?.data || "An error occurred while creating the post"
      );
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
              required
            />
          </div>

          <div>
            <TipTapEditor content={content} onUpdate={handleEditorUpdate} />
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
            />
          </div>
          <div className="form-group">
            <button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading ? "Creating..." : "Vytvoriť blog"}
            </button>
          </div>
        </form>
        <h1>Náhľad</h1>
        <div className="content-preview">
          {mainImage && (
            <div className="preview-image-container">
              <img
                className="preview-image"
                src={URL.createObjectURL(mainImage)}
                alt="Main"
              />
            </div>
          )}
          <h2 className="preview-title">{title || "Nadpis"}</h2>
          <div className="preview-tags">
            {tags.split(",").map(
              (tag, index) =>
                tag.trim() && (
                  <span key={index} className="preview-tag">
                    {tag.trim()}
                  </span>
                )
            )}
          </div>
          <div
            className="preview-content"
            dangerouslySetInnerHTML={{
              __html: content || "<p>Obsah...</p>",
            }}
          />
        </div>

        {error && (
          <div className="error-message">
            <h3>Error:</h3>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogCreatePage;
