import "/src/css/BlogHeaderStyle.css";
import { Link } from "react-router-dom";

const NavButtonFeitCITY = ({ children, path }) => {
  const basePageUrl = "https://feitcity.sk/";
  const handleClick = () => {
    window.location.href = `${basePageUrl}${path}`;
  };
  return (
    <li className="nav-item" onClick={handleClick}>
      {children}
    </li>
  );
};
export default NavButtonFeitCITY;
