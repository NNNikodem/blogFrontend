import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
const BlogSidebarFooter = ({ handleLogout }) => {
  return (
    <div className="sidebar-footer">
      <button className="logout-button" onClick={handleLogout}>
        <FontAwesomeIcon icon={faSignOutAlt} className="sidebar-nav-icon" />
        <span>Odhlásiť sa</span>
      </button>
    </div>
  );
};
export default BlogSidebarFooter;
