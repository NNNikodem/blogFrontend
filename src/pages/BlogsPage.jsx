import {useState, useEffect} from 'react';

const BlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 0,
        totalPages: 0,
        totalItems: 0
    });

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/blog?page=0&size=10', {method: 'GET'});

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const pageData = await response.json();
                setBlogs(pageData.content || []);
                setPageInfo({
                    currentPage: pageData.pageNumber || 0,
                    totalPages: pageData.totalPages || 0,
                    totalItems: pageData.totalItems || 0
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching blogs:', error);
                setError('Failed to fetch blogs. Please try again later.');
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const loadMorePosts = async (page) => {
        if (page >= pageInfo.totalPages) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/v1/blog?page=${page}&size=10`, {method: 'GET'});

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const pageData = await response.json();
            setBlogs(pageData.content || []);
            setPageInfo({
                currentPage: pageData.pageNumber || 0,
                totalPages: pageData.totalPages || 0,
                totalItems: pageData.totalItems || 0
            });
        } catch (error) {
            console.error('Error fetching more blogs:', error);
            setError('Failed to fetch more blogs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && blogs.length === 0) return <div>Loading blogs...</div>;
    if (error) return <div>{error}</div>;

    return (
        <main>
            <h1>Blogs</h1>

            {blogs.length === 0 ? (
                <p>No blogs found</p>
            ) : (
                <>
                    <div className="blog-list">
                        {blogs.map(blog => (
                            <div key={blog.id} className="blog-card">
                                <h2 className="blog-title">{blog.title}</h2>
                                <p className="blog-author">By: {blog.author || 'Unknown'}</p>
                                {blog.mainImageUrl !== null && (
                                    <div className="blog-image-container">
                                        <img style={{
                                            width: '100%',          // Makes all images fill the container width
                                            height: '250px',        // Fixed height for all images
                                            objectFit: 'cover'      // This ensures the image covers the area without distortion
                                        }}

                                             src={blog.mainImageUrl}
                                             alt={`Image for ${blog.title}`}
                                             className="blog-image"
                                             onError={(e) => {
                                                 e.target.onerror = null;
                                                 e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Available';
                                             }}
                                        />
                                    </div>

                                )}

                                <div className="blog-content">
                                    {blog.content}
                                </div>
                                <div className="blog-tags">
                                    {blog.tags.length > 0 ? (
                                        blog.tags.map((tag, index) => (
                                            <span key={index} className="blog-tag">{tag.name}</span>
                                        ))
                                    ) : (
                                        <span className="blog-tag blog-tag-placeholder">No tags</span>
                                    )}
                                </div>

                                <hr/>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="pagination">
                        <button
                            onClick={() => loadMorePosts(pageInfo.currentPage - 1)}
                            disabled={pageInfo.currentPage <= 0 || loading}
                        >
                            Previous
                        </button>
                        <span>Page {pageInfo.currentPage + 1} of {pageInfo.totalPages}</span>
                        <button
                            onClick={() => loadMorePosts(pageInfo.currentPage + 1)}
                            disabled={pageInfo.currentPage >= pageInfo.totalPages - 1 || loading}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {loading && blogs.length > 0 && <div>Loading more...</div>}
        </main>
    );
};

export default BlogsPage;
