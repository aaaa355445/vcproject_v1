import React, { useState } from "react";
import styles from "./Navigation.module.css";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandStyle = {
    color: "#000",
    textDecoration: "none",
  };
  const btnStyle = {
    color: "white",
    textDecoration: "none",
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.hamburger} onClick={toggleMobileMenu}>
          &#9776;
        </div>
        <div className={styles.logo}>
          <img src="https://svgshare.com/i/14d2.svg" alt="" />
          <h1>
            <Link style={brandStyle} to="/">
              The VC Project
            </Link>
          </h1>
        </div>
        <div
          className={`${styles.nav} ${
            isMobileMenuOpen ? styles.mobileNav : ""
          }`}
        >
          <span>
            <Link style={brandStyle} to="/">
              Home
            </Link>
          </span>
          <span>
            <Link style={brandStyle} to="/contact">
              Contact
            </Link>
          </span>
          <span>
            <Link style={brandStyle} to="/faq">
              FAQs
            </Link>
          </span>
        </div>
        <div className="btn">
        <button>
          <Link style={btnStyle} to="/reports">
            Reports
          </Link>
        </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
