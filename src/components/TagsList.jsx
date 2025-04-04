import React, { use } from 'react';
import { useState, useEffect } from 'react';
import TagButton from './TagButton.jsx';
const TagList = ({ onSelectTag }) => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //fetch tags from api/v1/tags
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/tags', { method: 'GET' });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const tagsData = await response.json();
                setTags(tagsData || []);
            } catch (error) {
                setError('Failed to fetch tags. Please try again later.');
                console.error('Error fetching tags:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTags();
    }, []);
    return(
        <div className="tags-container">
        <h2>Tags</h2>
        {loading ? (
            <p>Loading...</p>
        ) : error ? (
            <p>{error}</p>
        ) : (
            <ul className="tags-list">
                {tags.map((tag, index) => (
                    <TagButton key={index} tagName={tag.name} onSelect={onSelectTag} />
                ))}
            </ul>
        )}
        </div>
    )
}
export default TagList;