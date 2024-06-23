import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.upperSection}>
        <div className={styles.footerAbout}>
          <h4>The VC Project</h4>
          <p>
            India's largest reports repository for India's top investors
          </p>
        </div>
        <div className={styles.footerCompany}>
          <span>Company</span>
          <div className={styles.cta}>
            <a href="/reports">Reports</a>
            <a href="https://cutt.ly/thevcprojectcommunity" className={styles.join} target="_blank">Join community !</a><p className={styles.new}>New</p>            
          </div>
        </div>
        <div className={styles.footerHelp}>
          <span>Get Help</span>
          <div className={styles.cta}>
            <a href="/contact">Contact us</a>
            <a href="/faq">FAQs</a>
          </div>
        </div>
      </div>
      <div className={styles.lowerSection}>
        <h3>
          *This project in no way intends to benefit by re-distribution or
          copying of author's report. This is purely for informational & ease
          purposes. If you'd rather not have your report listed here, please
          contact us to get it removed within 48 hours.{" "}
        </h3>
        <span>© 2024 The VC Project | All rights reserved</span>
      </div>
    </div>
  );
};

export default Footer;
