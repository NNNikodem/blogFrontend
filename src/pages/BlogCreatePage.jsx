import React, { useState } from 'react';
import axios from 'axios';

const BlogCreatePage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [mainImage, setMainImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setMainImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);

        // Create form data object
        const formData = new FormData();

        // Convert tags string to array and create post request DTO
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        const postRequestDto = {
            title,
            content,
            tags: tagsArray
        };

        // Add the post data as JSON string
        formData.append(
            'postRequestDto',
            new Blob([JSON.stringify(postRequestDto)], { type: 'application/json' })
        );

        // Add image if present
        if (mainImage) {
            formData.append('mainImage', mainImage);
        }

        try {
            const result = await axios.post('http://localhost:8080/api/v1/blog', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResponse(result.data);
        } catch (err) {
            setError(err.response?.data || 'An error occurred while creating the post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-post-container">
            <h2>Create New Blog Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="10"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tags">Tags (comma separated):</label>
                    <input
                        type="text"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="tag1, tag2, tag3"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mainImage">Main Image:</label>
                    <input
                        type="file"
                        id="mainImage"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    <h3>Error:</h3>
                    <pre>{JSON.stringify(error, null, 2)}</pre>
                </div>
            )}

            {response && (
                <div className="success-message">
                    <h3>Post Created Successfully:</h3>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};
export default BlogCreatePage;