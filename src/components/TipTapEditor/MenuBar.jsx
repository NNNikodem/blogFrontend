import React, { useRef } from 'react';
import axios from 'axios';

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
        formData.append('file', file);
        
        // Show loading state if desired
        // You could add a loading indicator here
        
        // Upload the image to the API
        const response = await axios.post('http://localhost:8080/api/v1/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Get the image URL from the response
        const imageUrl = response.data.url || response.data.imageUrl || response.data;
        
        // Insert the image into the editor
        editor.chain().focus().setImage({ src: imageUrl }).run();
        
        console.log('Image uploaded successfully:', imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
        
        // Fallback to base64 if API fails (optional)
        /*
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          editor.chain().focus().setImage({ src: imageUrl }).run();
        };
        reader.readAsDataURL(file);
        */
      }
      
      // Reset input so the same file can be selected again
      e.target.value = '';
    };
  
    return (
      <div className="editor-menu-bar">
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          }}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          }}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run();
          }}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          Strike
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCodeBlock().run();
          }}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          Code
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run();
          }}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          Quote
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Bullet List
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          Numbered List
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().setHorizontalRule().run();
          }}
        >
          Horizontal Line
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            const url = window.prompt('Enter URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
        >
          Link
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().unsetLink().run();
          }}
        >
          Unlink
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            imageInputRef.current.click();
          }}
        >
          Upload Image
        </button>
        <input
          type="file"
          ref={imageInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run();
          }}
        >
          Undo
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run();
          }}
        >
          Redo
        </button>
      </div>
    );
};

export default MenuBar;