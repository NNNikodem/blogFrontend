import { useState, useEffect } from "react";
import "../css/BlogsPageStyle.css";
import BlogCard from "../components/BlogCard";
import TagList from "../components/TagsList";
import { getRequest } from "../api/apiAccessHelper";

const BlogsPage = ({ onEditBlog, onSelectTag, onSelectBlog }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
  });
  const [tagNames, setTagNames] = useState("");
  const [searchSize] = useState(10);

  const buttons = document.querySelectorAll(".tags-list-button");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
  const handleFetchBlogs = async (page = 0) => {
    if (page < 0 || (page >= pageInfo.totalPages && blogs.length > 0)) return;

    setLoading(true);
    setError(null);

    const data = await getRequest(`blog?page=${page}&size=${searchSize}`);

    if (data) {
      setBlogs(data.content || []);
      setPageInfo({
        currentPage: page,
        totalPages: Math.ceil(data.totalCount / searchSize) || 0,
        totalItems: data.totalCount || 0,
      });

      if (page !== 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setError("Failed to fetch blogs. Please try again later.");
    }

    setLoading(false);
  };
  const handleFetchBlogsByTag = async (page, tagName) => {
    setLoading(true);
    setError(null);
    if (tagNames == "") {
      setPageInfo({ currentPage: 0, totalPages: 0, totalItems: 0 });
      setTagNames([tagName]);
    }

    const data = await getRequest(
      `blog/tags?page=${page}&size=${searchSize}&tagNames=${tagName}`
    );

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

    setLoading(false);
  };

  useEffect(() => {
    handleFetchBlogs(); // initial fetch
  }, []);

  if (loading && blogs.length === 0) return <div>Loading blogs...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="blogs-container">
      <header>
        <h1>Blogs</h1>
      </header>
      <div className="blogs-main">
        <main>
          {blogs.length === 0 ? (
            <p>No blogs found</p>
          ) : (
            <div className="blog-list">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  blogData={blog}
                  onEditBlog={onEditBlog}
                  onViewMore={onSelectBlog}
                />
              ))}
            </div>
          )}

          {loading && blogs.length > 0 && <div>Loading more...</div>}
        </main>
        <aside>
          <nav className="sidebar">
            {/* <h3>Search</h3>
            <input type="text" placeholder="Search blogs..." /> */}
            <hr />
            <TagList onSelectTag={handleFetchBlogsByTag} />
          </nav>
        </aside>
      </div>

      <div className="pagination">
        <button
          onClick={() => {
            if (tagNames === "") {
              handleFetchBlogs(pageInfo.currentPage - 1);
            } else {
              handleFetchBlogsByTag(pageInfo.currentPage - 1, tagNames);
            }
          }}
          hidden={pageInfo.currentPage <= 0 || loading}
        >
          -
        </button>
        <span>
          Page {pageInfo.currentPage + 1} of {pageInfo.totalPages}
        </span>
        <button
          onClick={() => {
            if (tagNames === "") {
              handleFetchBlogs(pageInfo.currentPage + 1);
            } else {
              handleFetchBlogsByTag(pageInfo.currentPage + 1, tagNames);
            }
          }}
          hidden={pageInfo.currentPage >= pageInfo.totalPages - 1 || loading}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default BlogsPage;
