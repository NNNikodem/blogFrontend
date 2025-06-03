import React, { useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeading,
  faBold,
  faItalic,
  faStrikethrough,
  faCode,
  faQuoteRight,
  faList,
  faListOl,
  faRuler,
  faLink,
  faUnlink,
  faImage,
  faUndo,
  faRedo,
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
const MenuBar = ({ editor }) => {
  const imageInputRef = useRef(null);

  if (!editor) {
    return null;
  }

  // Handle local file upload with API endpoint
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !editor) return;

    try {
      // Create form data for the image
      const formData = new FormData();
      formData.append("file", file);

      // Show loading state if desired
      // You could add a loading indicator here

      // Upload the image to the API
      const response = await axios.post(
        "http://localhost:8080/api/v1/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Get the image URL from the response
      const imageUrl =
        response.data.url || response.data.imageUrl || response.data;

      // Insert the image into the editor
      editor.chain().focus().setImage({ src: imageUrl }).run();

      console.log("Image uploaded successfully:", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
    // Clear the file input
    e.target.value = "";
  };
  const addYoutubeVideo = (e) => {
    e.preventDefault();
    const url = prompt("Zadaj URL adresu YouTube videa");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

  return (
    <div className="editor-menu-bar">
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
        title="Heading 1"
      >
        <FontAwesomeIcon icon={faHeading} /> <sup>1</sup>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
        title="Heading 2"
      >
        <FontAwesomeIcon icon={faHeading} /> <sup>2</sup>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
        title="Heading 3"
      >
        <FontAwesomeIcon icon={faHeading} /> <sup>3</sup>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={editor.isActive("bold") ? "is-active" : ""}
        title="Bold"
      >
        <FontAwesomeIcon icon={faBold} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={editor.isActive("italic") ? "is-active" : ""}
        title="Italic"
      >
        <FontAwesomeIcon icon={faItalic} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleStrike().run();
        }}
        className={editor.isActive("strike") ? "is-active" : ""}
        title="Strike"
      >
        <FontAwesomeIcon icon={faStrikethrough} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleCodeBlock().run();
        }}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
        title="Code"
      >
        <FontAwesomeIcon icon={faCode} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBlockquote().run();
        }}
        className={editor.isActive("blockquote") ? "is-active" : ""}
        title="Quote"
      >
        <FontAwesomeIcon icon={faQuoteRight} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={editor.isActive("bulletList") ? "is-active" : ""}
        title="Bullet List"
      >
        <FontAwesomeIcon icon={faList} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleOrderedList().run();
        }}
        className={editor.isActive("orderedList") ? "is-active" : ""}
        title="Numbered List"
      >
        <FontAwesomeIcon icon={faListOl} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setHorizontalRule().run();
        }}
        title="Horizontal Line"
      >
        <FontAwesomeIcon icon={faRuler} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          const url = window.prompt("Enter URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        title="Link"
      >
        <FontAwesomeIcon icon={faLink} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().unsetLink().run();
        }}
        title="Unlink"
      >
        <FontAwesomeIcon icon={faUnlink} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          imageInputRef.current.click();
        }}
        title="Upload Image"
      >
        <FontAwesomeIcon icon={faImage} />
      </button>
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: "none" }}
      />
      <button id="add" onClick={addYoutubeVideo} title="Add YouTube video">
        <FontAwesomeIcon icon={faYoutube} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().undo().run();
        }}
        title="Undo"
      >
        <FontAwesomeIcon icon={faUndo} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().redo().run();
        }}
        title="Redo"
      >
        <FontAwesomeIcon icon={faRedo} />
      </button>
    </div>
  );
};

export default MenuBar;
