import "../src/css/App.css";
import LoginPage from "./pages/LoginPage.jsx";
import BlogsPage from "./pages/BlogsPage.jsx";
import BlogCreatePage from "./pages/BlogCreatePage.jsx";
import BlogHeader from "./components/BlogHeader.jsx";
import { useState } from "react";
import BlogEditPage from "./pages/BlogEditPage.jsx";
import BlogDetailPage from "./pages/BlogDetailPage.jsx";

function App() {
  const [pageToDisplay, setPageToDisplay] = useState(0);
  const [blogId, setBlogId] = useState(null);
  const handleEditBlog = (blogId) => {
    setBlogId(blogId);
    setPageToDisplay(3);
  };
  const handleSelectTag = (tagName) => {
    console.log(tagName);
  };
  const handleSelectBlog = (blogId) => {
    setBlogId(blogId);
    setPageToDisplay(4);
  };
  const handleSelect = (selectedValue) => {
    if (selectedValue === "home") {
      window.location.href = "https://feitcity.sk/";
    } else if (selectedValue === "blogs") {
      setPageToDisplay(0);
    } else if (selectedValue === "createBlog") {
      setPageToDisplay(1);
    } else if (selectedValue === "login") {
      setPageToDisplay(2);
    }
  };
  const pages = [
    <BlogsPage
      key={0}
      onEditBlog={handleEditBlog}
      onSelectTag={handleSelectTag}
      onSelectBlog={handleSelectBlog}
    />,
    <BlogCreatePage key={1} onBlogCreated={handleSelectBlog} />,
    <LoginPage key={2} />,
    <BlogEditPage key={3} blogId={blogId} />,
    <BlogDetailPage key={4} id={blogId} />,
  ];
  let content = pages[pageToDisplay];
  return (
    <div>
      <BlogHeader onSelect={handleSelect} />
      {content}
    </div>
  );
}

export default App;
