import React from 'react';
import "../css/BlogsPageStyle.css";

const BlogCard = ({ blogData, onEditBlog }) => {
    const { title, content, tags, createdAt, author, mainImageUrl, id } = blogData;
    const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('sk-SK', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
    }) : 'Date unavailable';
    return (
        <section key={id} className="blog-card">
            {mainImageUrl !== null && (
                <div className="blog-image-container">
                    <img src={mainImageUrl}
                            alt={`Image for ${title}`}
                            className="blog-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Available';
                            }}
                    />
                </div>
            )}
            <h2 className="blog-title">{title}</h2>
            <p className="blog-published">{author || 'Unknown'}, {formattedDate}</p>


            <div className="blog-content">
                {content}
            </div>
            <div className="blog-tags">
                {tags.length > 0 ? (
                    tags.map((tag, index) => (
                        <span key={index} className="blog-tag">{tag.name}</span>
                    ))
                ) : (
                    <span className="blog-tag blog-tag-placeholder">No tags</span>
                )}
            </div>
            <button onClick={()=>{onEditBlog(id)}}>Edit</button>

            <hr/>
        </section>
    );
}

export default BlogCard;