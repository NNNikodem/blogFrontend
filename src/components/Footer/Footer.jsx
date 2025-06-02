import React, { useState, useEffect, useRef, forwardRef } from "react";
import { getRequest, isLoading, getError } from "../../api/apiAccessHelper.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
  faDiscord,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import "../../css/Components/Footer.css";
import FooterColumn from "./FooterColumn.jsx";
import FooterNavigation from "./FooterNavigation.jsx";

const Footer = forwardRef((props, ref) => {
  const basePageUrl = "https://feitcity.sk/";
  const [footerData, setFooterData] = useState([]);
  const iconMap = {
    "fa-facebook-f": faFacebookF,
    "fa-instagram": faInstagram,
    "fa-tiktok": faTiktok,
    "fa-discord": faDiscord,
    "fa-youtube": faYoutube,
  };

  //Effect to fetch header items from backend
  useEffect(() => {
    const fetchFooterItems = async () => {
      try {
        const response = await getRequest(`components/footer`);
        if (response) {
          console.log("Footer items fetched successfully:", response);
          setFooterData(response);
        } else {
          console.error("Failed to fetch footer items");
        }
      } catch (error) {
        console.error("Error fetching footer items:", error);
      }
    };
    fetchFooterItems();
  }, []);

  if (isLoading() == true) {
    return <div className="loading-indicator">Loading...</div>;
  }
  if (getError() != null) {
    return (
      <div className="error-indicator">
        Error: {getError().message || "Failed to load footer data"}
      </div>
    );
  }
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Adresa */}
        {footerData.locationColumn && (
          <FooterColumn
            title="Kde nás nájdeš"
            items={footerData.locationColumn}
            type="location"
          />
        )}
        {/* Kontakt */}
        {footerData.contactColumn && (
          <FooterColumn
            title="Kontakty"
            items={footerData.contactColumn}
            type="contact"
          />
        )}
        {/* Sociálne siete */}
        {footerData.socialColumn && (
          <FooterColumn
            title="Sociálne siete"
            items={footerData.socialColumn}
            type="social"
            iconMap={iconMap}
          />
        )}
        {/* E-shop */}
        {footerData.shopColumn && (
          <FooterColumn
            title="FEIT Shop"
            items={footerData.shopColumn}
            type="shop"
          />
        )}
      </div>
      {/* Copyright alebo extra info */}
      {footerData.navigationColumn && (
        <FooterNavigation
          navigationItems={footerData.navigationColumn}
          basePageUrl={basePageUrl}
        />
      )}
    </footer>
  );
});

export default Footer;
