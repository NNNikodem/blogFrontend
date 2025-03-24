import "/src/css/BlogHeaderStyle.css"

const NavButton = ({children, onSelect}) => {

    return (
        <li className="nav-item" onClick={onSelect}>
            {children}
        </li>)
}
export default NavButton;