import NavButton from "./NavButton.jsx";
import "../css/BlogHeaderStyle.css";


const BlogHeader = ({onSelect}) => {
    return (
        <header className="blog-header">
            <img src="/src/assets/feitImages/feit-logo-white.png"
                 alt="default-logo"
                 className="logo"
                 onClick={() => {
                    onSelect("home");
            }}/>
            <nav>
                <ul className="nav-links">
                    <NavButton onSelect={() => {
                                    onSelect("home");
                    }}>Domov</NavButton>
                    <NavButton onSelect={() => {
                                    onSelect("blogs");
                    }}>Blogy</NavButton>
                    <NavButton onSelect={() => {
                                    onSelect("createBlog");
                    }}>Pridaj Blog</NavButton>
                    <NavButton onSelect={() => {
                                    onSelect("components");
                    }}>Komponenty</NavButton>
                </ul>
            </nav>
            <button onClick={() => {
                onSelect("login");
            }}>Prihlásiť sa</button>
        </header>
    )
}
export default BlogHeader;
