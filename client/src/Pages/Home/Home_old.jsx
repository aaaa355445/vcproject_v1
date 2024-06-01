import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import ImageSlider from "../../components/Slider/ImageSlider";
import { Link } from "react-router-dom";
import ReportCard from "../../components/ReportCard/ReportCard";
import { getReports } from "../../Services/Api";


const Home = () => {
  const [reports, setReports] = useState([]);
  const images = ["images/graph1.png"];


  const brandStyle = {
    color: "#000",
    textDecoration: "none",
  };

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };
  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <>
      <div className={styles.landingPage}>
        <div className={styles.container}>
          <div className={styles.effectWrap}>
            <div className={`${styles.effect} ${styles.effect1}`}></div>
            <div className={`${styles.effect} ${styles.effect2}`}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className={`${styles.effect} ${styles.effect3}`}></div>
            <div className={`${styles.effect} ${styles.effect4}`}></div>
            <div className={`${styles.effect} ${styles.effect5}`}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className={styles.left}>
            <h1>All Indian Startup Ecosystem Reports Collated at One Place</h1>
            <button>
              <Link style={brandStyle} to="/reports">
                All Reports
              </Link>
            </button>
          </div>
          <ImageSlider images={images} />
        </div>
      </div>

      <div className={styles.featuredReports}>
        <h1>Featured Reports</h1>
        <div className={styles.container}>
        {reports.slice(0, 4).map((report, index) => (
      <ReportCard key={index} report={report} />
    ))}
        </div>
      </div>

      {/* <div className={styles.ourMembers}>
        <h1>Our Members</h1>
        <div className={styles.members}>
          <div className={styles.member}>
            <div className={styles.gridmem}>
              <img
                src="https://www.peakxv.com/wp-content/uploads/sites/2/2022/10/Audrey-Adeline-Inside.png?resize=920,920"
                alt=""
              />
              <h3>Audery Adeline</h3>
              <p>Analyst</p>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Home;
