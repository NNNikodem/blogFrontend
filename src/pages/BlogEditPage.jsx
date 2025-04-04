import { useState, useEffect } from "react";
import TipTapEditor from "../components/TipTapEditor/TipTapEditor";
import axios from 'axios';

const BlogEditPage = ({ onEdit, blogId }) => {
  const [blogData, setBlogData] = useState(null);
  const [originalTags, setOriginalTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/v1/blog/${blogId}`, {method: 'GET'});
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Convert any object tags to strings for consistency with create blog
        const normalizedTags = (data.tags || []).map(tag => 
          typeof tag === 'object' ? tag.name || tag.tagName || tag.value || '' : tag
        );
        
        // Set blogData with normalized string tags
        setBlogData({
          ...data,
          tags: normalizedTags
        });
        
        // Store original tags for later comparison
        setOriginalTags(normalizedTags);
        console.log("Fetched blog data:", data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [blogId]);
  
  const handleEditorUpdate = (html) => {
    setBlogData(prev => ({
      ...prev,
      content: html
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of the blog data for the update
      const updatedBlog = { ...blogData };
      
      // Always send tags with the update
      console.log("Sending blog update with tags:", updatedBlog.tags);
      
      console.log("Updated blog:", updatedBlog);
      const response = await axios.put(
        `http://localhost:8080/api/v1/blog/${blogId}`,
        updatedBlog
      );
      
      if (onEdit && typeof onEdit === 'function') {
        onEdit(response.data);
      }
      
      alert('Blog post updated successfully!');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog post. Please try again.');
    }
  };
  
  // Extract tag names for display
  const getTagString = (tags) => {
    if (!tags || !Array.isArray(tags)) return '';
    
    // Since we're now always working with string tags, this is simpler
    return tags.join(', ');
  };
  
  // Parse tag input and convert to simple string tags like in BlogCreate
  const handleTagChange = (e) => {
    const tagInput = e.target.value;
    // Split by comma, trim whitespace, and filter out empty tags
    const tags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    // Update blogData with plain string tags (not objects)
    setBlogData({
      ...blogData,
      tags: tags
    });
  };
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!blogData) return <div>No blog data found</div>;
  
  return (
    <div className="edit-post-container">
      <h1>Edit Blog</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={blogData.title || ''}
            onChange={(e) => setBlogData({...blogData, title: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <TipTapEditor 
            content={blogData.content} 
            onUpdate={handleEditorUpdate} 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">Tags (comma separated):</label>
          <input
            type="text"
            id="tags"
            value={getTagString(blogData.tags)}
            onChange={handleTagChange}
          />
        </div>
        
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
};

export default BlogEditPage;