import React, { useState } from "react";
import styles from "./ReportCard.module.css";
import { reportSubscribeEmail } from "../../Services/Api";

const ReportCard = ({ report }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState("");
  const authors = Array.isArray(report.author)
    ? report.author.join(", ")
    : report.author;

  const handleCardClick = (e) => {
    e.preventDefault();
    setIsPopupOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await reportSubscribeEmail(email);
      if (data.ok) {
        setEmail("");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    }
    setIsPopupOpen(false);
    window.open(report.link, "_blank", "noopener,noreferrer");
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={styles.link}
        style={{ cursor: "pointer" }}
      >
        <div className={styles.CardSection}>
          <img src={report.image} alt="Report-Thumbnail" loading="lazy" />
          <div className={styles.cardContent}>
            <div className={styles.titles}>
              <h2>{report.title}</h2>
              <h4>By - {authors}</h4>
            </div>
            <div className={styles.tags}>
              <span>{report.sector}</span>
              <span>{report.subSector}</span>
              <span className={styles.year}>{report.year}</span>
            </div>
            <div className={styles.readBtn}>
              <button>Read More</button>
            </div>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <button className={styles.closeButton} onClick={handleClosePopup}>
              &times;
            </button>
            <div className={styles.bar}>
              <img
                src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/Team_Member/Ayush.webp"
                alt=""
              />
            </div>
            <div className={styles.formSection}>
              <p>Ayush request's your action to complete</p>
              <form onSubmit={handleFormSubmit}>
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Continue</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportCard;
