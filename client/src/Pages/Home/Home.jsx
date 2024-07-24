import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import ImageSlider from "../../components/Slider/ImageSlider";
import { Link } from "react-router-dom";
import ReportCard from "../../components/ReportCard/ReportCard";
import { getReports, subscribeEmail } from "../../Services/Api";
import style from "./Home.css";
import "primeicons/primeicons.css";
import Marquee from "react-fast-marquee";
import Faq from "../../components/Faq/Faq";

const Home = () => {
  const [reports, setReports] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const slides = [
    "https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/1.png",
    "https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/2.png",
    "https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/3.png",
    "https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/4.png",
    "https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/5.png",
    "https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/6.png",
    "https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/7.png",
    "https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/8.png",
    "https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/9.png",
  ];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await subscribeEmail(email);
      if (data.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("An error occurred while subscribing.");
      console.error("Error subscribing:", error);
    }
  };

  const handleClose = () => {
    setMessage("");
  };

  return (
    <>
      <div class="landingPage">
        <div class="left">
          <h1>
            Get all <span>reports</span> about India in one place
          </h1>
          <h4>
            India is booming, we help you make sense of different sectors in its
            multi-country.
          </h4>
          <a href="/reports">
            <button>VIEW REPORTS</button>
          </a>
          <span>Free forever, no sign-up needed</span>
        </div>
        <div class="right">
          <div class="slider">
            <ImageSlider images={slides} />
          </div>
        </div>
      </div>

      <div class="explore-reports">
        <h2>Explore reports by</h2>
        <div class="marque-container">
          <div class="marque-slider">
            <Marquee
              style={{ width: "100%" }}
              className="marquee-container"
              speed={35}
              gradient={true}
              gradientWidth={70}
            >
              <div className="svg-logos">
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/1.png"
                  alt="chiratae"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/2.png"
                  alt="avendus"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/3.png"
                  alt="matrix"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/4.png"
                  alt="mckinsey"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/5.png"
                  alt="peak"
                  className="svg"
                />

                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/6.png"
                  alt="redseer"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/7.png"
                  alt="temasek"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/8.png"
                  alt="yourstory"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/9.png"
                  alt="google"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/10.png"
                  alt="blume"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/11.png"
                  alt="bnc"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/12.png"
                  alt="elevation"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/13.png"
                  alt="bcg"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/14.png"
                  alt="bcg"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/15.png"
                  alt="bcg"
                  className="svg"
                />
                <img
                  src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/Logos/16.png"
                  alt="bcg"
                  className="svg"
                />
              </div>
            </Marquee>
          </div>
        </div>
      </div>

      <div className="why-section">
        <div className="why1">
          <h2>Why do this?</h2>
          <p>
            We know the job of research is not easy. Countless hours, deadends,
            irrelevant material, subpar resources, shady website, $$, wrong
            information, pretty presentations. We want to make the job
            enjoyable: best reports, fast. That's it.
          </p>
        </div>
        <div className="why2">
          <h2>What motivates us?</h2>
          <p>Reading reports, having fun, late nights - in that order</p>
        </div>
      </div>

      <div className="about-section">
        <div className="title">
          <h1>
            How <span>The VC Project</span> can be used
          </h1>
          <p>Tool to research about India and markets within it</p>
        </div>
        <div className="about">
          <div className="left">
            <h3>Understanding sectors in depth</h3>
            <p>
              Collate reports of all sectors, reputed authors, quality over
              quantity.
            </p>
          </div>
          <div className="right">
            <img
              src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/thumbnails/Homepage/1.webp"
              alt=""
            />
          </div>
        </div>
        <div className="about middle">
          <div className="right">
            <img
              src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/thumbnails/Homepage/2.webp"
              alt=""
            />
          </div>
          <div className="left">
            <h3>Industry landscape</h3>
            <p>
              Market sizing, white spaces, key players, sub sectors within
              industries.
            </p>
          </div>
        </div>
        <div className="about">
          <div className="left">
            <h3>PoVs</h3>
            <p>
              Building view on a industry, multiple lens, trends, pattern
              matching... tight!
            </p>
          </div>
          <div className="right">
            <img
              src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/WhatsApp%20Image%202024-05-02%20at%2023.14.13_5c04194f.jpg"
              alt=""
            />
          </div>
        </div>
      </div>

      {/* <div className={styles.featuredReports}>
        <h2>Featured Reports</h2>
        <div className={styles.container}>
        {reports.slice(0, 4).map((report, index) => (
        <ReportCard key={index} report={report} />))}
        </div>
      </div> */}

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <Faq />
      </div>

      <div className="ourMembers">
        <h2>
          Our <span>Team</span>
        </h2>
        <div className="members">
          <div className="member">
            <div className="gridmem">
              <img
                className="memberImg"
                src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/Team_Member/Ayush.webp"
                alt=""
              />
              <h3>Insightful Ayush</h3>
              <p>Consumer Tech at Redseer Strategy</p>
              <p>Product & Growth</p>
              <div className="socials">
                <a  target="_blank" href="https://www.linkedin.com/in/ayushmittal22">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/480px-LinkedIn_logo_initials.png"
                    alt=""
                  />
                </a>
                <a href="mailto:mittalayush740@gmail.com">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="member">
            <div className="gridmem">
              <img
                className="memberImg"
                src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/carousel/Team_Member/Arun.webp"
                alt=""
              />
              <h3>Outgoing Arun</h3>
              <p>Founders office at The Test Tribe</p>
              <p>Community</p>
              <div className="socials">
                <a target="_blank" href="https://www.linkedin.com/in/the-arun-biju">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/480px-LinkedIn_logo_initials.png"
                    alt=""
                  />
                </a>
                <a href="mailto:arun@thetesttribe.com">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="member">
            <div className="gridmem">
              <img className="memberImg" src="/images/sid-image.jpeg" alt="" />
              <h3>Explorer Sidharth</h3>
              <p>SDE1 at Dailyobjects</p>
              <p>Tech</p>
              <div className="socials">
                <a target="_blank" href="https://www.linkedin.com/in/sidharthv17">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/480px-LinkedIn_logo_initials.png"
                    alt=""
                  />
                </a>
                <a href="mailto:sidharthv605@gmail.com">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="member">
            <div className="gridmem">
              <img
                className="memberImg"
                src="https://vc-thumbnails.blr1.cdn.digitaloceanspaces.com/thumbnails/photo.webp"
                alt=""
              />
              <h3>Reliable Chetanya</h3>
              <p>The VC Project</p>
              <p>Research</p>
              <div className="socials">
                <a target="_blank" href="https://www.linkedin.com/in/chetanya-arora-6a854b254">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/480px-LinkedIn_logo_initials.png"
                    alt=""
                  />
                </a>
                <a href="mailto:chetanyaarora009@gmail.com">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="subscribe-section">
        <div className="title">
          <h2>
            Making <span>knowledge</span> accessible
          </h2>
          <p>Get access to exclusive meetups and new reports</p>
        </div>
        <div className="subscribe-form">
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your official email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Let me in!</button>
          </form>
        </div>
      </div>

      {message && (
        <div className="snackbar">
          <p className="message">{message}</p>
          <span className="close-button" onClick={handleClose}>
            &times;
          </span>
        </div>
      )}
    </>
  );
};

export default Home;
