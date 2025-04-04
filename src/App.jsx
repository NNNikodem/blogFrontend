import "/src/css/App.css"
import LoginPage from './pages/LoginPage.jsx'
import BlogsPage from "./pages/BlogsPage.jsx";
import BlogCreatePage from "./pages/BlogCreatePage.jsx";
import BlogHeader from "./components/BlogHeader.jsx";
import {useState} from "react";
import BlogEditPage from "./pages/BlogEditPage.jsx";

function App() {
    const [pageToDisplay, setPageToDisplay] = useState(0);
    const [blogId, setBlogId] = useState(null);
    const handleEditBlog = (blogId) => {
        setBlogId(blogId);
        setPageToDisplay(3);
    }
    const handleSelectTag = (tagName) => {
        console.log(tagName);
        // Here you can implement the logic to filter blogs based on the selected tag
        // For example, you can call an API to fetch blogs with the selected tag
    }
    const handleSelect = (selectedValue) => {
        if (selectedValue === "home") {
            window.location.href = "https://feitcity.sk/";
        }
        else if (selectedValue === "blogs") {
            setPageToDisplay(0);
        } else if (selectedValue === "createBlog") {
            setPageToDisplay(1);
        } else if (selectedValue === "login") {
            setPageToDisplay(2);
        }
    }
    const pages = [<BlogsPage key={0} onEditBlog={handleEditBlog} onSelectTag={handleSelectTag}/>,
        <BlogCreatePage key={1}/>,
        <LoginPage key={2}/>,
        <BlogEditPage key={3} blogId={blogId}/>,
    ];
    let content = pages[pageToDisplay];
    return (
        <div>
            <BlogHeader onSelect={handleSelect} />
            {content}
        </div>

    )
}

export default App
