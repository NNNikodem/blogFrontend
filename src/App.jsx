import "../src/css/App.css";
import "./css/SidebarStyle.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import BlogsPage from "./pages/BlogsPage.jsx";
import BlogCreatePage from "./pages/BlogCreatePage.jsx";
import BlogSidebar from "./components/Sidebar/BlogSidebar.jsx";
import Header from "./components/Header.jsx";
import { useState, useEffect, useRef } from "react";
import BlogEditPage from "./pages/BlogEditPage.jsx";
import BlogDetailPage from "./pages/BlogDetailPage.jsx";
import ComponentsManagementPage from "./pages/ComponentsManagementPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import TagList from "./components/Sidebar/TagsList.jsx";
import ComponentSidebar from "./components/ComponentSidebar.jsx";

import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute.jsx";
import Footer from "./components/Footer/Footer.jsx";

function AppLayout() {
  const location = useLocation();
  const [tagsOpen, setTagsOpen] = useState(false);
  const [componentsOpen, setComponentsOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState("footer");
  const searchParams = new URLSearchParams(location.search);
  const activeTag = searchParams.get("tag");

  // Ref for the footer element
  const footerRef = useRef(null);

  // Determine when to show sidebars
  const showTagsSidebar = ["/blogs"].some((path) =>
    location.pathname.startsWith(path)
  );
  const showComponentSidebar = location.pathname === "/components";

  // Component titles for display in sidebar
  const componentsList = [
    { id: "footer", title: "Footer" },
    { id: "faqcomponent", title: "FAQ" },
    { id: "otheractivities", title: "Ostatné Aktivity" },
    { id: "logocomponent", title: "Logo Komponent" },
    { id: "afterschool", title: "Po Škole" },
    { id: "feitstory", title: "FEIT Story" },
    { id: "slider", title: "Slider - Život na FEIT" },
    { id: "featureboxs", title: "Boxy Bc. Programov" },
    { id: "dod", title: "DOD Komponent" },
    { id: "whyfeit", title: "Prečo FEIT" },
    { id: "countdown", title: "Časovač" },
    { id: "video", title: "Video" },
    { id: "menu", title: "Header Menu" },
  ];

  return (
    <div className="app-container">
      <Header />
      <div
        className={`content-container ${
          showTagsSidebar ? "with-tags-sidebar" : ""
        } ${showComponentSidebar ? "with-component-sidebar" : ""}`}
      >
        {/* Left sidebar */}
        <div className="left-sidebar-container">
          <BlogSidebar />
        </div>

        {/* Main content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<BlogsPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route
              path="/auth/feitcity/account/login"
              element={<LoginPage />}
            />
            <Route path="/blog/:blogId" element={<BlogDetailPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/create" element={<BlogCreatePage />} />
              <Route path="/edit/:blogId" element={<BlogEditPage />} />
              <Route
                path="/components"
                element={
                  <ComponentsManagementPage
                    componentList={componentsList}
                    activeComponent={activeComponent}
                  />
                }
              />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Right sidebars */}
        <div className="right-sidebar-container">
          {/* Tags Sidebar */}
          {showTagsSidebar && (
            <>
              <button
                className="tags-sidebar-toggle"
                onClick={() => setTagsOpen(!tagsOpen)}
                aria-label="Toggle tags"
              >
                {tagsOpen ? "×" : "#"}
              </button>

              <aside className={`tags-sidebar ${tagsOpen ? "open" : ""}`}>
                <TagList
                  activeTag={activeTag}
                  onSelectTag={(tag) => {
                    // Handle tag selection
                    if (location.pathname.startsWith("/blogs")) {
                      window.location.href = `/blogs?tag=${tag}`;
                    }
                    // Close sidebar on mobile after selecting
                    if (window.innerWidth <= 768) {
                      setTagsOpen(false);
                    }
                  }}
                />
              </aside>
            </>
          )}

          {/* Component Sidebar */}
          {showComponentSidebar && (
            <>
              <button
                className="component-sidebar-toggle"
                onClick={() => setComponentsOpen(!componentsOpen)}
                aria-label="Toggle components"
              >
                {componentsOpen ? "×" : "⚙️"}
              </button>

              <aside
                className={`component-sidebar ${componentsOpen ? "open" : ""}`}
              >
                <ComponentSidebar
                  components={componentsList}
                  activeComponent={activeComponent}
                  onSelectComponent={(componentId) => {
                    setActiveComponent(componentId);
                    // Close sidebar on mobile after selecting
                    if (window.innerWidth <= 768) {
                      setComponentsOpen(false);
                    }
                  }}
                  isOpen={componentsOpen}
                  toggleSidebar={() => setComponentsOpen(!componentsOpen)}
                />
              </aside>
            </>
          )}
        </div>

        {/* Overlay for mobile when any sidebar is open */}
        {(tagsOpen || componentsOpen) && window.innerWidth <= 768 && (
          <div
            className="sidebar-overlay visible"
            onClick={() => {
              if (tagsOpen) setTagsOpen(false);
              if (componentsOpen) setComponentsOpen(false);
            }}
          />
        )}
      </div>
      <Footer ref={footerRef} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
