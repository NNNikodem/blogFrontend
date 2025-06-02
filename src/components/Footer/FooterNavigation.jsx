import React from "react";
import FooterLink from "./FooterLink";
import ImageButton from "../ImageButton";

const FooterNavigation = ({ navigationItems, basePageUrl }) => {
  if (!navigationItems || navigationItems.length === 0) return null;

  return (
    <div className="footer-bottom">
      <div className="footer-logo-container">
        <ImageButton
          imageSrc={"/src/assets/feitImages/feit-logo-white.png"}
          altText={"footer-logo"}
          imageClassName={"footer-logo"}
          navPath={basePageUrl}
        />
      </div>

      <ul className="footer-navigation-list">
        {navigationItems.map((item) => (
          <li key={item.id} className="footer-navigation-list-item">
            <FooterLink path={item.url}>{item.text}</FooterLink>
          </li>
        ))}
      </ul>

      <div className="footer-copyright">
        <p>
          &copy; Copyright {new Date().getFullYear()}{" "}
          <a
            href="https://feit.uniza.sk"
            style={{ color: "var(--text-primary-color)" }}
          >
            FEIT UNIZA
          </a>
        </p>
      </div>
    </div>
  );
};

export default FooterNavigation;
