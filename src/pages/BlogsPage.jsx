import {useState, useEffect} from 'react';
import '/src/css/BlogsPageStyle.css';
import BlogCard from '../components/BlogCard';
import TagList from '../components/TagsList';
const BlogsPage = ({onEditBlog, onSelectTag}) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 0,
        totalPages: 0,
        totalItems: 0
    });
    const [searchSize, setSearchSize] = useState(10);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/blog?page=0&size=${searchSize}`, {method: 'GET'});

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const pageData = await response.json();
                setBlogs(pageData.content || []);
                setPageInfo({
                    currentPage: pageData.pageNumber || 0,
                    totalPages: Math.ceil(pageData.totalCount / searchSize) || 0,
                    totalItems: pageData.totalCount || 0
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
            const response = await fetch(`http://localhost:8080/api/v1/blog?page=${page}&size=${searchSize}`, {method: 'GET'});

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const pageData = await response.json();
            setBlogs(pageData.content || []);
            setPageInfo({
                currentPage: page,
                totalPages: pageInfo.totalPages || 0,
                totalItems: pageInfo.totalItems || 0
            });
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top after loading more posts
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
        <div className="blogs-container">
            <main>
                <h1>Blogs</h1>

                {blogs.length === 0 ? (
                    <p>No blogs found</p>
                ) : (
                    <>
                        <div className="blog-list">
                            {blogs.map(blog => (
                                <BlogCard key={blog.id} blogData={blog} onEditBlog={onEditBlog} />
                            ))}
                        </div>
                    </>
                )}
                {loading && blogs.length > 0 && <div>Loading more...</div>}
            </main>
            <aside>
                <nav className="sidebar">
                    <h3>Search</h3>
                    <input type="text" placeholder="Search blogs..." />
                    <hr />
                    <TagList onSelectTag={onSelectTag} />   
                </nav>

            </aside>
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
        </div>
        
    );
};

export default BlogsPage;
