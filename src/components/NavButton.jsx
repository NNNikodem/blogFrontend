import "/src/css/BlogHeaderStyle.css";
import { Link } from "react-router-dom";

const NavButton = ({ children, path }) => {
  return (
    <Link to={path}>
      <li className="nav-item">{children} </li>
    </Link>
  );
};
export default NavButton;
