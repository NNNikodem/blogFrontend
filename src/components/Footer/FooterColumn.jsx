import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import FooterLink from "./FooterLink";
import feather from "feather-icons";
import { useEffect } from "react";

const FooterColumn = ({ title, items, type, iconMap }) => {
  if (!items || items.length === 0) return null;

  const renderItem = (item) => {
    switch (type) {
      case "location":
        return (
          // <FooterLink path={item.url} key={item.id} type="text">
          //   {/* <FontAwesomeIcon icon={faMapMarkerAlt} />  */}
          //   {item.text}
          // </FooterLink>
          <>
            <p style={{ color: "var(--text-secondary-color)" }}>{item.text}</p>
            <FooterLink path={item.url} key={item.id} type="maps">
              GOOGLE MAPS
            </FooterLink>
          </>
        );
      case "contact":
        return (
          <FooterLink
            key={item.id}
            path={item.url}
            type={item.text.includes("@") ? "email" : "phone"}
          >
            {/* <FontAwesomeIcon
              icon={item.text.includes("@") ? faEnvelope : faPhone}
            />{" "} */}
            {item.text}
          </FooterLink>
        );
      case "social":
        return (
          <li key={item.id}>
            <FooterLink path={item.url} type="icon">
              <FontAwesomeIcon icon={iconMap[item.icon]} size="lg" />
            </FooterLink>
          </li>
        );
      case "shop":
        return (
          <FooterLink key={item.id} path={item.url} type="text">
            {item.url}
          </FooterLink>
        );
      default:
        return (
          <FooterLink key={item.id} path={item.url} type="text">
            {item.text}
          </FooterLink>
        );
    }
  };
  useEffect(() => {
    feather.replace(); // nahradí všetky <i data-feather="..."> za SVG
  }, []);

  return (
    <div className="footer-column">
      <div className="footer-column-header">
        {type === "shop" && <i className="ti-shopping-cart"></i>}
        {type === "location" && <i data-feather="map-pin"></i>}
        {type === "contact" && <i data-feather="phone-call"></i>}
        {type === "social" && <i data-feather="wifi"></i>}
        {type === "navigation" && <i className="ti-menu"></i>}
        <h3>{title}</h3>
      </div>

      {type === "social" ? (
        <div className="footer-socials">
          <ul>{items.map((item) => renderItem(item))}</ul>
        </div>
      ) : type === "navigation" ? (
        <ul>{items.map((item) => renderItem(item))}</ul>
      ) : (
        items.map((item) => renderItem(item))
      )}
    </div>
  );
};

export default FooterColumn;
