import React, { useState, useEffect, useRef } from "react";
import styles from "./ReportCard.module.css";
import { reportSubscribeEmail, checkEmailForGuestUser, saveReportLogs } from "../../Services/Api";

const ReportCard = ({ report }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState("");
  const popupRef = useRef(null);

  const authors = Array.isArray(report.author)
    ? report.author.join(", ")
    : report.author;


  const handleCardClick = (rid, title) => async (e) => {
    try {
      const guestId = localStorage.getItem('guestUserId');
      const emailExists = await checkEmailForGuestUser(guestId);
      if (emailExists.emailExists) {
        const reportPayload = {
          rid,
          title,
          guestId,
          email: emailExists.email
        }
        saveReportLogs(reportPayload);
        window.open(report.link, "_blank", "noopener,noreferrer");
      } else {
        setIsPopupOpen(true);
      }
    } catch (error) {
      console.error("Error checking email for guest user:", error);
    }
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleClosePopup();
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  return (
    <>
      <div
        onClick={handleCardClick(report.rid, report.title)}
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
          <div className={styles.popupContent} ref={popupRef}>
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
              <p>Ayush requests your action to complete</p>
              <form onSubmit={handleFormSubmit}>
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  placeholder="Enter your official email"
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
