import React, { useEffect, useState, useRef } from "react";
import styles from "./Reports.module.css";
import ReportCard from "../../components/ReportCard/ReportCard";
import { getReports } from "../../Services/Api";
import { ThreeCircles } from "react-loader-spinner";

const categoriesData = [
  {
    category: "Agritech",
    subcategories: ["Agritech"],
  },
  {
    category: "Climate & Sustainability",
    subcategories: ["Circular Economy"],
  },
  {
    category: "Consumer Tech",
    subcategories: [
      "Gaming",
      "Marketplaces",
      "Edtech",
      "Indian Consumer",
      "Beauty & Personal care",
      "Ecommerce",
      "Foodtech",
      "B2B",
      "D2C",
    ],
  },
  {
    category: "Content & Media",
    subcategories: ["Creator Economy"],
  },
  {
    category: "Employment",
    subcategories: ["Blue Collar Workforce"],
  },
  {
    category: "EV & Renewables",
    subcategories: ["BatteryTech", "EV"],
  },
  {
    category: "Financial Services",
    subcategories: ["Fintech", "SME Credit"],
  },
  {
    category: "Healthcare",
    subcategories: ["Mental Health", "Chronic Care"],
  },
  {
    category: "Human Resources",
    subcategories: ["Talent Trends"],
  },
  {
    category: "India Stack",
    subcategories: ["DPI"],
  },
  {
    category: "Infrastructure & Security",
    subcategories: ["Dev tools"],
  },
  {
    category: "Insurance",
    subcategories: ["Insurtech"],
  },
  {
    category: "Social & Advertising",
    subcategories: ["Adtech", "Social Media", "Short form video (SFV)"],
  },
  {
    category: "Software",
    subcategories: ["Cybersecurity", "HRTech", "Indian SaaS"],
  },
  {
    category: "Venture Capital & Private Equity",
    subcategories: ["Funding Trends", "VC Returns", "Termsheets"],
  },
];

const authorsData = [
  "Elevation Capital",
  "Tracxn",
  "Blume Ventures",
  "RedSeer",
  "Peak XV",
  "Kalaari Capital",
  "Bain & Company",
  "Yourstory",
  "BCG",
  "Matrix Partners India",
  "1Lattice",
  "Chiratae Ventures",
  "EY",
  "Temasek",
  "Google",
  "Bigbasket",
  "Omidyar Network",
  "Lumikai Fund",
  "GetVantage",
];

const initialReportsData = [];

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [showAllAuthors, setShowAllAuthors] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reportsToShow, setReportsToShow] = useState(15);
  const [loading, setLoading] = useState(true);
  const reportsRef = useRef(initialReportsData);

  const categoriesSet = new Set();
  const subcategoriesSet = new Set();
  const authorsSet = new Set();

  const handleCategoryClick = (category) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter(
          (prevCategory) => prevCategory !== category
        );
      } else {
        return [...prevCategories, category];
      }
    });
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategories((prevSubcategories) => {
      if (prevSubcategories.includes(subcategory)) {
        return prevSubcategories.filter(
          (prevSubcategory) => prevSubcategory !== subcategory
        );
      } else {
        return [...prevSubcategories, subcategory];
      }
    });
  };

  const handleAuthorClick = (author) => {
    setSelectedAuthors((prevAuthors) => {
      if (prevAuthors.includes(author)) {
        return prevAuthors.filter((prevAuthor) => prevAuthor !== author);
      } else {
        return [...prevAuthors, author];
      }
    });
  };

  const handleViewMoreClick = () => {
    setShowAllCategories((prevShowAllCategories) => !prevShowAllCategories);
  };

  const handleViewMoreAuthorsClick = () => {
    setShowAllAuthors(true);
  };

  const handleShowMoreClick = () => {
    setReportsToShow((prevCount) => prevCount + 15);
  };

  const fetchReports = async (
    selectedCategories,
    selectedSubcategories,
    selectedYear,
    selectedAuthors
  ) => {
    try {
      setLoading(true);
      if (selectedYear === "select") {
        setReports([]);
        return;
      }
      const data = await getReports(
        selectedCategories,
        selectedSubcategories,
        selectedYear,
        selectedAuthors
      );
      setReports(data.reports);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setLoading(false);
      throw error;
    }
  };

  useEffect(() => {
    const fetchInitialReportsData = async () => {
      try {
        const data = await getReports([], [], "", []);
        reportsRef.current = data.reports; // Store initial reports data
        setReports(data.reports);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial reports data:", error);
        setLoading(false);
      }
    };

    fetchInitialReportsData();
  }, []);

  useEffect(() => {
    fetchReports(
      selectedCategories,
      selectedSubcategories,
      selectedYear,
      selectedAuthors
    );
  }, [
    selectedCategories,
    selectedSubcategories,
    selectedYear,
    selectedAuthors,
  ]);

  const filteredReports = reports.filter((report) => {
    const searchTerms = searchQuery.toLowerCase().split(" ");
    const isMatch = searchTerms.every((term) => {
      return (
        report.title.toLowerCase().includes(term) ||
        report.author.some((author) => author.toLowerCase().includes(term))
      );
    });

    if (isMatch && loading) {
      setLoading(false);
    }

    return isMatch;
  });

  const reportsArray = Object.values(reportsRef.current);

  if (reportsArray) {
    reportsArray.forEach((report) => {
      categoriesSet.add(report.category);
      if (selectedCategories.includes(report.category)) {
        subcategoriesSet.add(report.subcategory);
      }
      if (report.author) {
        report.author.forEach((authors) => authorsSet.add(authors));
      }
    });
  }

  const categories = Array.from(categoriesSet);
  const authors = Array.from(authorsSet);



  return (
    <div className={styles.reportSection}>
      {/* <div className={styles.upperSection}></div> */}

      <div className={styles.lowerSection}>
        <div className={styles.filters}>
          <h4>Reports</h4>
          <input
            className={styles.search}
            type="text"
            name="report"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
          />
          <div className={styles.yearFilter}>
            <span className={styles.filterLabel}>Select Year</span>
            <select
              className="filter-dropdown"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Select</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div className={styles.categories}>
            <span className={styles.filterLabel}>Categories</span>

            {showAllCategories
              ? categories.map((category) => (
                  <div key={category}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="category"
                        value={category}
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryClick(category)}
                      />
                      <span>
                        {" "}
                        {category} (
                        {
                          reportsArray.filter(
                            (report) => report.category === category
                          ).length
                        }
                        )
                      </span>
                    </label>
                  </div>
                ))
              : categories.slice(0, 5).map((category) => (
                  <div key={category}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        name="category"
                        value={category}
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryClick(category)}
                      />
                      <span>
                        {" "}
                        {category} (
                        {
                          reportsArray.filter(
                            (report) => report.category === category
                          ).length
                        }
                        )
                      </span>
                    </label>
                  </div>
                ))}
            {categories.length > 5 && (
              <button
                className={styles.viewMoreButton}
                onClick={handleViewMoreClick}
              >
                {showAllCategories ? "View Less" : "View More"}
              </button>
            )}

            {selectedCategories.length > 0 && (
              <div className={styles.subcategories}>
                <span className={styles.filterLabel}>Subcategories</span>
                {categoriesData
                  .filter((cat) => selectedCategories.includes(cat.category))
                  .map((cat) =>
                    cat.subcategories.map((subcategory) => (
                      <label key={subcategory} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          value={subcategory}
                          onChange={() => handleSubcategoryClick(subcategory)}
                        />
                        <span>
                          {" "}
                          {subcategory} (
                          {
                            reportsArray.filter(
                              (report) => report.subcategory === subcategory
                            ).length
                          }
                          )
                        </span>
                      </label>
                    ))
                  )}
              </div>
            )}
          </div>

          <div className={styles.authors}>
            <span className={styles.filterLabel}>Authors</span>
            {/* {showAllAuthors
              ? authorsData.map((author) => (
                  <label key={author} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      value={author}
                      onChange={() => handleAuthorClick(author)}
                    />
                    <span> {author}</span>
                  </label>
                ))
              : authorsData.slice(0, 5).map((author) => (
                  <label key={author} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      value={author}
                      onChange={() => handleAuthorClick(author)}
                    />
                    <span> {author}</span>
                  </label>
                ))}
            {!showAllAuthors && authorsData.length > 5 && (
              <button
                className={styles.viewMoreButton}
                onClick={handleViewMoreAuthorsClick}
              >
                View More
              </button>
            )} */}
            {authors.map((author, index) => (
              <div
                key={author}
                className={index >= 5 && !showAllAuthors ? styles.hidden : ""}
              >
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={author}
                    onChange={() => handleAuthorClick(author)}
                  />
                  <span> {author}</span>
                </label>
              </div>
            ))}
            {!showAllAuthors && authors.length > 5 && (
              <button
                className={styles.viewMoreButton}
                onClick={handleViewMoreAuthorsClick}
              >
                View More
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <>
            <div className={styles.loader}>
              <ThreeCircles
                type="Oval"
                color="#F9C22E"
                height={60}
                width={60}
              />
            </div>
          </>
        ) : (
          <div className={styles.reports}>
            {filteredReports.slice(0, reportsToShow).map((report, index) => (
              <ReportCard key={index} report={report} />
            ))}
          </div>
        )}
      </div>
      <div className={styles.pagination}>
        {filteredReports.length > reportsToShow && (
          <button
            className={styles.showMoreButton}
            onClick={handleShowMoreClick}
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
};

export default Reports;
