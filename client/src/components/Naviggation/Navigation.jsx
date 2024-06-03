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

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.hamburger} onClick={toggleMobileMenu}>
          &#9776;
        </div>
        <div className={styles.logo}>
          <Link style={brandStyle} to="/" onClick={closeMobileMenu}>
            <img src="https://svgshare.com/i/14d2.svg" alt="" />
          </Link>
          <h1>
            <Link style={brandStyle} to="/" onClick={closeMobileMenu}>
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
            <Link style={brandStyle} to="/" onClick={closeMobileMenu}>
              Home
            </Link>
          </span>
          <span>
            <Link style={brandStyle} to="/contact" onClick={closeMobileMenu}>
              Contact
            </Link>
          </span>
          <span>
            <Link style={brandStyle} to="/faq" onClick={closeMobileMenu}>
              FAQs
            </Link>
          </span>
        </div>
        <div className="btn">
          <Link style={btnStyle} to="/reports" onClick={closeMobileMenu}>
            <button>Reports</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
