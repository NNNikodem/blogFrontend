const NavDropdownItem = ({ children, navPath, ...props }) => {
  if (props.target === "_blank") {
    return (
      <li className="dropdown-menu-item">
        <a href={navPath} target="_blank">
          {children}
        </a>
      </li>
    );
  }

  return (
    <li className="dropdown-menu-item arrow">
      <a href={navPath}>{children}</a>
    </li>
  );
};
export default NavDropdownItem;
