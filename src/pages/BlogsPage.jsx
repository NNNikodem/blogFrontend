import { useState, useEffect } from "react";
import "../css/BlogsPageStyle.css";
import BlogCard from "../components/BlogCard";
import TagList from "../components/Sidebar/TagsList";
import Pagination from "../components/Pagination";
import { getRequest } from "../api/apiAccessHelper";
import { useSearchParams, useNavigate } from "react-router-dom";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
  });
  const [searchSize] = useState(5);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get the tag or author from URL query parameters
  const tagParam = searchParams.get("tag");
  const authorParam = searchParams.get("author");

  // Handle tag selection
  const handleTagSelect = (tagName) => {
    // Reset to page 0 when changing tags
    navigate(`/blogs?tag=${tagName}`);
  };
  // Clear tag filter
  const clearTagFilter = () => {
    navigate("/blogs");
  };
  // Handle author selection
  const handleAuthorSelect = (authorName) => {
    // Reset to page 0 when changing author
    navigate(`/blogs?author=${authorName}`);
  };
  // Clear author filter
  const clearAuthorFilter = () => {
    navigate("/blogs");
  };

  const fetchBlogs = async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      let data;

      if (tagParam) {
        // Fetch blogs by tag
        data = await getRequest(
          `blog/tags?page=${page}&size=${searchSize}&tagNames=${tagParam}`
        );
      } else if (authorParam) {
        // Fetch blogs by author
        data = await getRequest(
          `blog/author/${authorParam}?page=${page}&size=${searchSize}`
        );
      } else {
        // Fetch all blogs
        data = await getRequest(`blog?page=${page}&size=${searchSize}`);
      }

      if (data) {
        setBlogs(data.content || []);
        setPageInfo({
          currentPage: page,
          totalPages: Math.ceil(data.totalCount / searchSize) || 0,
          totalItems: data.totalCount || 0,
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError("Failed to fetch blogs. Please try again later.");
      }
    } catch (err) {
      setError("An error occurred while fetching blogs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch blogs when page changes
  const handlePageChange = (newPage) => {
    if (newPage < 0 || (newPage >= pageInfo.totalPages && blogs.length > 0))
      return;

    const url = new URL(window.location);
    url.searchParams.set("page", newPage);
    navigate(`${url.pathname}${url.search}`);

    fetchBlogs(newPage);
  };

  useEffect(() => {
    // Get page from URL or default to 0
    const page = parseInt(searchParams.get("page") || "0", 10);
    fetchBlogs(page);
  }, [tagParam, authorParam, searchParams.get("page")]);

  return (
    <>
      {tagParam && (
        <h1>
          <span>
            Kategória: <strong>{tagParam}</strong>{" "}
            <button onClick={clearTagFilter} className="clear-tag">
              ×
            </button>
          </span>
        </h1>
      )}
      {authorParam && (
        <h1>
          <span>
            Autor: <strong>{authorParam}</strong>{" "}
            <button onClick={clearAuthorFilter} className="clear-tag">
              ×
            </button>
          </span>
        </h1>
      )}
      <div className="blogs-main">
        {loading && blogs.length === 0 ? (
          <div>Načítavam blogy...</div>
        ) : error ? (
          <div>{error}</div>
        ) : blogs.length === 0 ? (
          <p>
            Žiadne blogy nenájdené {tagParam && `pre kategóriu "${tagParam}"`}{" "}
            {authorParam && `podľa autora "${authorParam}"`}
          </p>
        ) : (
          <div className="blog-list">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blogData={blog}
                onClickTag={handleTagSelect}
                onClickAuthor={handleAuthorSelect}
              />
            ))}
          </div>
        )}

        {loading && blogs.length > 0 && <div>Loading more...</div>}
      </div>

      <Pagination
        currentPage={pageInfo.currentPage}
        totalPages={pageInfo.totalPages}
        loading={loading}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default BlogsPage;
