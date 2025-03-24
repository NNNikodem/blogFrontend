import "/src/css/App.css"
import LoginPage from './pages/LoginPage.jsx'
import BlogsPage from "./pages/BlogsPage.jsx";
import BlogCreatePage from "./pages/BlogCreatePage.jsx";
import BlogHeader from "./components/BlogHeader.jsx";
import {useState} from "react";

function App() {
    const [pageToDisplay, setPageToDisplay] = useState(0);
    const pages = [<BlogsPage key={0}/>, <BlogCreatePage key={1}/>, <LoginPage key={2}/>];
    let content = pages[pageToDisplay];
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
    return (
        <div>
            <BlogHeader onSelect={handleSelect} />
            {content}
        </div>

    )
}

export default App
