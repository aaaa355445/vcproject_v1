import React, { useRef, useEffect, useState } from "react";
import ReportCard from "../../components/ReportCard/ReportCard";
import {
  getReports,
  getYearAndCount,
  saveSearchQuery,
  getFilters,
  getAuthorFilters,
  getSectorFilters,
  reportTopicEmail,
} from "../../Services/Api";
import { ThreeCircles } from "react-loader-spinner";
import "./ReportsFilters.css";
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const ReportsFilters = () => {
  const { filter } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const parseQueryString = (queryString, key) => {
    const rawQuery = queryString.substring(1);
    const regex = new RegExp(`${key}~([\\d_]+)`);
    const match = rawQuery.match(regex);
    return match ? match[1] : null;
  };
  
  const sid = parseQueryString(location.search, 'sid');
  const aid = parseQueryString(location.search, 'aid');
  const scid = parseQueryString(location.search, 'scid');




  const placeholders = [
    "Search for Redseer",
    "Search for Fintech",
    "Search for eCommerce",
    "Search for Elevation",
    "Search for Gaming",
    "Search for Blume Ventures",
    "Search for Financial Services",
    "Search for Healthcare",
    "Search for Fireside",
    "Search for Battery",
    "Search for Software",
    "Search for Insurance",
  ];

  // Years State
  const [selectedYears, setSelectedYears] = useState({});
  const [years, setYears] = useState([]);

  // Authors State
  const [authors, setAuthors] = useState([]);
  const [visibleAuthors, setVisibleAuthors] = useState(8);
  const [errorAuthors, setErrorAuthors] = useState(null);
  const [selectedAuthors, setSelectedAuthors] = useState({});
  const [showAuthorsPopup, setShowAuthorsPopup] = useState(false);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);

  // Sector State
  const [sectors, setSectors] = useState([]);
  const [visibleSectors, setVisibleSectors] = useState(8);
  const [selectedSectors, setSelectedSectors] = useState({});
  const [showSectorsPopup, setShowSectorsPopup] = useState(false);
  const [selectedSectorIds, setSelectedSectorIds] = useState([]);

  // Sub Sector State
  const [subsectors, setSubsectors] = useState([]);
  const [visibleSubsectors, setVisibleSubsectors] = useState(8);
  const [selectedSubSectors, setSelectedSubSectors] = useState({});
  const [showSubSectorsPopup, setShowSubSectorsPopup] = useState(false);

  // Reports State
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  const [errorReports, setErrorReports] = useState(null);
  const [allReports, setAllReports] = useState([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0]);

  // Other state
  const [page, setPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("sectors");
  const previousScrollTop = useRef(0);
  const rightReportsRef = useRef(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [searchFlag, setSearchFlag] = useState(false);

  useEffect(() => {
    if (!loading && rightReportsRef.current) {
      rightReportsRef.current.scrollTop = previousScrollTop.current;
    }
  }, [loading]);

    useEffect(() => {
    if (aid) {
      const aidsFromUrl = aid.split('_'); // Handle multiple aids in the query string
      const updatedAuthors = {};

      aidsFromUrl.forEach((aidValue) => {
        updatedAuthors[aidValue] = true; // Set each aid to true
      });

      setSelectedAuthors((prev) => ({
        ...prev,
        ...updatedAuthors
      }));
    }
  }, [aid]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % placeholders.length;
      setCurrentPlaceholder(placeholders[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const fetchFilters = async () => {
    try {
      const data = await getFilters();
      if (filter === "sectors") {
        setSectors(data.sectors);
      } else if (filter === "authors") {
        setAuthors(data.authors);
      } else if (filter === "subsectors") {
        setSubsectors(data.subSectors);
      }
    } catch (err) {
      console.error("Error fetching sectors:", err);
    }
  };

  useEffect(() => {
    const fetchYearAndCount = async () => {
      try {
        if (filter === "years") {
            const data = await getYearAndCount();
            setYears(data);
        }
        setLoadingReports(false);
      } catch (err) {
        console.error("Error fetching years:", err);
      }
    };

    fetchYearAndCount();
    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const selectedYearsArray = Object.keys(selectedYears).filter(
          (year) => selectedYears[year]
        );
        const selectedAuthorsArray = Object.keys(selectedAuthors).filter(
          (aid) => selectedAuthors[aid]
        );
        const selectedSectorArray = Object.keys(selectedSectors).filter(
          (sid) => selectedSectors[sid]
        );
        const selectedSubSectorArray = Object.keys(selectedSubSectors).filter(
          (ssid) => selectedSubSectors[ssid]
        );

        const yearParam =
          selectedYearsArray.length > 0
            ? selectedYearsArray.join("_")
            : undefined;
        const authorParam =
          selectedAuthorsArray.length > 0
            ? selectedAuthorsArray.join("_")
            : undefined;
        const sectorParam =
          selectedSectorArray.length > 0
            ? selectedSectorArray.join("_")
            : undefined;
        const subsectorParam =
          selectedSubSectorArray.length > 0
            ? selectedSubSectorArray.join("_")
            : undefined;

        const data = await getReports(
          page,
          yearParam,
          authorParam ? authorParam : aid,
          searchQuery,
          sectorParam,
          subsectorParam
        );
        setReports(data.reports);
        setAllReports((prevAllReports) => {
          const newReports = data.reports.filter(
            (report) =>
              !prevAllReports.some(
                (prevReport) => prevReport.rid === report.rid
              )
          );
          return [...prevAllReports, ...newReports];
        });
        setLoading(false);
      } catch (err) {
        setErrorReports(err);
        setLoading(false);
      }
    };

    fetchReports();
  }, [
    page,
    selectedYears,
    selectedAuthors,
    searchQuery,
    selectedSectors,
    selectedSubSectors,
  ]);

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
    setShowSearchPopup(!showFilter);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleApplyFilter = () => {
    setShowFilter(false);
    setShowSearchPopup(false);
  };

  const handleAuthorCheckboxChange = (aid) => {  
    setSelectedAuthors((prev) => {
      // Toggle the selected author in state
      const updatedAuthors = { ...prev, [aid]: !prev[aid] };
  
      // Filter and create the updated aid string for URL
      const selectedAids = Object.keys(updatedAuthors)
        .filter((key) => updatedAuthors[key]) // Only include selected authors
        .join('_');
  
      // Construct the new query string for URL
      const newQueryString = selectedAids ? `aid~${selectedAids}` : '';
  
      // Create the new URL with the updated query string
      const newUrl = `${location.pathname}?${newQueryString}`;
  
      // Use navigate to update the URL without refreshing the page
      navigate(newUrl, { replace: true });
  
      return updatedAuthors; // Update the state with the new selection
    });
  
    // Reset the page, reports, and scroll position after selection
    setPage(1);
    setAllReports([]);
    window.scrollTo(0, 0);
    previousScrollTop.current = 0;
  };
  

  const handleYearCheckboxChange = (year) => {
    setSelectedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
    setPage(1);
    setAllReports([]);
    window.scrollTo(0, 0);
    previousScrollTop.current = 0;
  };

  const handleSectorCheckboxChange = (sid) => {
    setSelectedSectors((prev) => {
        const updatedSectors = { ...prev, [sid]: !prev[sid] };
    
        const selectedSids = Object.keys(updatedSectors)
          .filter(key => updatedSectors[key])
          .join('_');
    
        const newQueryString = selectedSids ? `sid~${selectedSids}` : '';
        const newUrl = `${location.pathname}?${newQueryString}`;
        navigate(newUrl, { replace: true });
    
        return updatedSectors;
      });


    setPage(1);
    setAllReports([]);
    window.scrollTo(0, 0);
    previousScrollTop.current = 0;
  };

  const handleSubSectorCheckboxChange = (ssid) => {
    setSelectedSubSectors((prev) => ({
      ...prev,
      [ssid]: !prev[ssid],
    }));
    setPage(1);
    setAllReports([]);
    window.scrollTo(0, 0);
    previousScrollTop.current = 0;
  };

  const toggleAuthorsPopup = () => {
    setShowAuthorsPopup(!showAuthorsPopup);
  };

  const toggleSectorsPopup = () => {
    setShowSectorsPopup(!showSectorsPopup);
  };

  const toggleSubSectorsPopup = () => {
    setShowSubSectorsPopup(!showSubSectorsPopup);
  };

  const handleLoadMore = () => {
    setLoading(true);
    setPage((prevPage) => prevPage + 1);
  };

  const handleSearchMobile = () => {
    setShowSearchPopup(!showSearchPopup);
    setShowFilter(false);
  };

  const clearAllFilter = () => {
    setSelectedAuthors({});
    setSelectedSectors({});
    setSelectedSubSectors({});
    setSelectedYears({});
    fetchFilters();
    setAllReports([]);
  };

  const inputRef = useRef();

  const clearSearch = () => {
    setSearchValue("");
    setSearchQuery("");
    setAllReports([]);
    setSearchFlag(false);
    inputRef.current.focus();
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setSearchQuery(searchValue);
      const guestId = localStorage.getItem("guestUserId");
      if (guestId && searchValue) {
        setAllReports([]);
        const searchPayload = { guestId, searchQuery: searchValue };
        saveSearchQuery(searchPayload);
      }
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    setSearchFlag(true);
  };

  useEffect(() => {
    if (showFilter) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [showFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await reportTopicEmail(email, searchQuery);
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
    setSearchQuery("");
    setSearchValue("");
  };

  if (loadingReports) {
    return (
      <div className="loader-section">
        <div className="loader">
          <ThreeCircles type="Oval" color="#4343FF" height={60} width={60} />
        </div>
      </div>
    );
  }

  if (errorAuthors) {
    return <p>Error loading authors: {errorAuthors.message}</p>;
  }

  if (errorReports) {
    return <p>Error loading reports: {errorReports.message}</p>;
  }

  return (
    <div className="reports-section">
      <div className="upersection">
        <div className="container">
          <div className="leftSection">
            <span style={{ fontWeight: "bold" }}>FILTERS</span>
            <span className="clearBtn" onClick={clearAllFilter}>
              Reset
            </span>
          </div>
          <div className="rightSection">
            <div className="searchSection">
              <input
                type="text"
                name="report"
                value={searchValue}
                onChange={handleInputChange}
                ref={inputRef}
                placeholder={currentPlaceholder}
              />
              <span
                className="clearBtn"
                onClick={clearSearch}
                style={{
                  pointerEvents: searchValue ? "auto" : "none",
                  opacity: searchValue ? 1 : 0.5,
                }}
              >
                Clear
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="lowersection">
        <div className="leftFilter">
          <div className="filters">
            {filter === "sectors" && (
              <div className="category">
                <h4>Sector</h4>
                <div className="categoryData">
                  {sectors.slice(0, visibleSectors).map((sector) => (
                    <span key={sector.sid} className="sectorCheckbox">
                      <input
                        type="checkbox"
                        checked={selectedSectors[sector.sid] || false}
                        onChange={() => handleSectorCheckboxChange(sector.sid)}
                      />
                      <p>{sector.name}</p>
                    </span>
                  ))}
                </div>
                <div className="loadmore">
                  {visibleSectors < sectors.length && (
                    <span onClick={toggleSectorsPopup}>
                      +{sectors.length - 8} more
                    </span>
                  )}
                </div>
                {showSectorsPopup && (
                  <div className="popup">
                    <div className="popup-content">
                      <button
                        className="close-popup"
                        onClick={toggleSectorsPopup}
                      >
                        &times;
                      </button>
                      <div className="popup-sectors">
                        {sectors.map((sector) => (
                          <span
                            key={sector.sid}
                            className="popup-sectorCheckbox"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSectors[sector.sid] || false}
                              onChange={() =>
                                handleSectorCheckboxChange(sector.sid)
                              }
                            />
                            <p>{sector.name}</p>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {filter === "subsectors" && (
              <div className="category">
                <h4>Sub Categories</h4>
                <div className="categoryData">
                  {subsectors.slice(0, visibleSubsectors).map((subsector) => (
                    <span key={subsector.ssid} className="sectorCheckbox">
                      <input
                        type="checkbox"
                        checked={selectedSubSectors[subsector.ssid] || false}
                        onChange={() =>
                          handleSubSectorCheckboxChange(subsector.ssid)
                        }
                      />
                      <p>{subsector.name}</p>
                    </span>
                  ))}
                </div>
                <div className="loadmore">
                  {visibleSubsectors < subsectors.length && (
                    <span onClick={toggleSubSectorsPopup}>
                      +{subsectors.length - 8} more
                    </span>
                  )}
                </div>
                {showSubSectorsPopup && (
                  <div className="popup">
                    <div className="popup-content">
                      <button
                        className="close-popup"
                        onClick={toggleSubSectorsPopup}
                      >
                        &times;
                      </button>
                      <div className="popup-sectors">
                        {subsectors.map((subsector) => (
                          <span
                            key={subsector.ssid}
                            className="popup-sectorCheckbox"
                          >
                            <input
                              type="checkbox"
                              checked={
                                selectedSubSectors[subsector.ssid] || false
                              }
                              onChange={() =>
                                handleSubSectorCheckboxChange(subsector.ssid)
                              }
                            />
                            <p>{subsector.name}</p>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {filter === "authors" && (
              <div className="author">
                <h4>Authors</h4>
                <div className="authorsData">
                  {authors.slice(0, visibleAuthors).map((author) => (
                    <span key={author.aid} className="authorCheckbox">
                      <input
                        type="checkbox"
                        checked={selectedAuthors[author.aid] || false}
                        onChange={() => handleAuthorCheckboxChange(author.aid)}
                      />{" "}
                      {author.name}
                    </span>
                  ))}
                </div>
                <div className="loadmore">
                  {visibleAuthors < authors.length && (
                    <span onClick={toggleAuthorsPopup}>
                      +{authors.length - 8} more
                    </span>
                  )}
                </div>
                {showAuthorsPopup && (
                  <div className="popup">
                    <div className="popup-content">
                      <button
                        className="close-popup"
                        onClick={toggleAuthorsPopup}
                      >
                        &times;
                      </button>
                      <div className="popup-authors">
                        {authors.map((author) => (
                          <span
                            key={author.aid}
                            className="popup-authorCheckbox"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAuthors[author.aid] || false}
                              onChange={() =>
                                handleAuthorCheckboxChange(author.aid)
                              }
                            />{" "}
                            {author.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {filter === "years" && (
              <div className="year">
                <h4>Select Year</h4>
                <div className="yearData">
                  {years.map((year) => (
                    <span key={year.year} className="yearCheckbox">
                      <input
                        type="checkbox"
                        checked={selectedYears[year.year] || false}
                        onChange={() => handleYearCheckboxChange(year.year)}
                      />
                      <p>{year.year}</p>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rightReports" ref={rightReportsRef}>
          {loading ? (
            <>
              <div className="mobileLoader">
                <div className="report-loader">
                  <ThreeCircles
                    type="Oval"
                    color="#4343FF"
                    height={60}
                    width={60}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="reports">
                {allReports.map((report, index) => (
                  <ReportCard key={index} report={report} />
                ))}
              </div>
              <div className="pagination">
                {allReports.length === 0 && !searchFlag ? (
                  <div className="no-more-reports">
                    No (more) reports. Please{" "}
                    <a href="/contact"> contact us </a> to suggest if we have
                    missed any.
                  </div>
                ) : (
                  reports.length >= 15 && (
                    <div className="load-more">
                      <button
                        onClick={() => {
                          if (rightReportsRef.current) {
                            previousScrollTop.current =
                              rightReportsRef.current.scrollTop;
                          }
                          handleLoadMore();
                        }}
                      >
                        Load More
                      </button>
                    </div>
                  )
                )}
                {allReports.length === 0 && searchFlag ? (
                  <>
                    {message && (
                      <div className="snackbar">
                        <p className="message">{message}</p>
                        <span className="close-button" onClick={handleClose}>
                          &times;
                        </span>
                      </div>
                    )}
                    <div className="searchNotFound">
                      <p>Didn't find what you are looking for?</p>
                      <p>Let our experts help you.</p>
                      <p className="searchQuerySection">
                        Find reports on the topic{" "}
                        <span className="searchQueryText">"{searchQuery}"</span>{" "}
                        and mail it to me at
                      </p>
                      <form onSubmit={handleSubmit} className="newsletter-form">
                        <input
                          className="searchEmail"
                          type="email"
                          placeholder="sid@gmail.com"
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <button className="mailMeBtn" type="submit">
                          Mail me
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  reports.length >= 15 && (
                    <div className="load-more">
                      <button
                        onClick={() => {
                          if (rightReportsRef.current) {
                            previousScrollTop.current =
                              rightReportsRef.current.scrollTop;
                          }
                          handleLoadMore();
                        }}
                      >
                        Load More
                      </button>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mobileBar">
        <div className="mobileBarLeft" onClick={handleSearchMobile}>
          {showSearchPopup ? "Close" : "Search"}
        </div>
        <div className="mobileBarDivider"></div>
        <div
          className="mobileBarRight"
          onClick={showFilter ? handleApplyFilter : handleFilterClick}
        >
          {showFilter ? "Apply" : "Filter"}
        </div>
      </div>

      {showSearchPopup && (
        <div className="searchPopup">
          <div className="searchInput">
            <div className="searchSectionMobile">
              <input
                type="text"
                name="report"
                value={searchValue}
                onChange={handleInputChange}
                ref={inputRef}
                placeholder={currentPlaceholder}
              />
              <span className="clearBtn" onClick={clearSearch}>
                Clear
              </span>
            </div>
          </div>
        </div>
      )}

      {showFilter && (
        <div className="mobileFilterPopup">
          <div className="filterScreen">
            <div className="filterHeading">
              <span
                className={selectedFilter === "sectors" ? "selected" : ""}
                onClick={() => handleFilterChange("sectors")}
              >
                Sectors
              </span>
              <span
                className={selectedFilter === "subsectors" ? "selected" : ""}
                onClick={() => handleFilterChange("subsectors")}
              >
                Sub Sectors
              </span>
              <span
                className={selectedFilter === "authors" ? "selected" : ""}
                onClick={() => handleFilterChange("authors")}
              >
                Authors
              </span>
              <span
                className={selectedFilter === "year" ? "selected" : ""}
                onClick={() => handleFilterChange("year")}
              >
                Year
              </span>
              <span className="clearBtn" onClick={clearAllFilter}>
                Reset
              </span>
            </div>

            <div className="filterData">
              {selectedFilter === "year" && (
                <div className="year">
                  <div className="yearData">
                    {years.map((year) => (
                      <span key={year.year} className="yearCheckbox">
                        <input
                          type="checkbox"
                          checked={selectedYears[year.year] || false}
                          onChange={() => handleYearCheckboxChange(year.year)}
                        />
                        <p>{year.year}</p>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedFilter === "sectors" && (
                <div className="category">
                  <div className="categoryData">
                    {sectors.map((sector) => (
                      <span key={sector.sid} className="popup-sectorCheckbox">
                        <input
                          type="checkbox"
                          checked={selectedSectors[sector.sid] || false}
                          onChange={() =>
                            handleSectorCheckboxChange(sector.sid)
                          }
                        />
                        <p>{sector.name}</p>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedFilter === "subsectors" && (
                <div className="subCategory">
                  <div className="subCategoryData">
                    {subsectors.map((subsector) => (
                      <span key={subsector.ssid} className="subsectorCheckbox">
                        <input
                          type="checkbox"
                          checked={selectedSubSectors[subsector.ssid] || false}
                          onChange={() =>
                            handleSubSectorCheckboxChange(subsector.ssid)
                          }
                        />
                        <p>{subsector.name}</p>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedFilter === "authors" && (
                <div className="author">
                  <div className="authorsData">
                    {authors.map((author) => (
                      <span key={author.aid} className="popup-authorCheckbox">
                        <input
                          type="checkbox"
                          checked={selectedAuthors[author.aid] || false}
                          onChange={() =>
                            handleAuthorCheckboxChange(author.aid)
                          }
                        />{" "}
                        {author.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsFilters;
