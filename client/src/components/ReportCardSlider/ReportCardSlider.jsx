import React, { useRef } from "react";
import styles from "./ReportCardSlider.module.css";
import ReportCard from "../ReportCard/ReportCard";
import 'primeicons/primeicons.css';

const ReportCardSlider = ({ reports }) => {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current.scrollLeft -= 290; // Adjust the scroll distance as needed
  };

  const scrollRight = () => {
    sliderRef.current.scrollLeft += 290; // Adjust the scroll distance as needed
  };

  return (
    <div className={styles.sliderContainer}>
      <button onClick={scrollLeft} className={styles.navButton}><i className="pi pi-arrow-left"></i></button>
      <div className={styles.slider} ref={sliderRef}>
        {reports.map((report) => (
          <ReportCard key={report.rid} report={report} />
        ))}
      </div>
      <button onClick={scrollRight} className={styles.navButton}><i className="pi pi-arrow-right"></i></button>
    </div>
  );
};

export default ReportCardSlider;
