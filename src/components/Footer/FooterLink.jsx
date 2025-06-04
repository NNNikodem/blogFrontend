const FooterLink = ({ path, children, type }) => {
  const basePageUrl = "https://feitcity.sk/";
  let className = "footer-link";
  if (type === "icon") {
    className = "footer-icon-link";
  } else if (type === "maps") {
    className = "footer-maps-link";
  }
  return (
    <a
      href={path}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

export default FooterLink;
