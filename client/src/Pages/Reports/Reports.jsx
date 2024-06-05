import React, { useRef, useEffect, useState } from "react";
import styles from "./Reports.module.css";
import ReportCard from "../../components/ReportCard/ReportCard";
import {
  getReports,
  getAuthors,
  getSectors,
  getSubSectors,
  getYearAndCount
} from "../../Services/Api";
import { ThreeCircles } from "react-loader-spinner";
import "./Reports.css";

const Reports = () => {
  const [authors, setAuthors] = useState([]);
  const [visibleAuthors, setVisibleAuthors] = useState(8);
  const [loadingAuthors, setLoadingAuthors] = useState(true);
  const [errorAuthors, setErrorAuthors] = useState(null);
  const [selectedAuthors, setSelectedAuthors] = useState({});
  const [selectedYears, setSelectedYears] = useState({});
  const [showAuthorsPopup, setShowAuthorsPopup] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [visibleSectors, setVisibleSectors] = useState(8);
  const [showSectorsPopup, setShowSectorsPopup] = useState(false);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [errorReports, setErrorReports] = useState(null);
  const [page, setPage] = useState(1);
  const [allReports, setAllReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [subsectors, setSubsectors] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState({});
  const [visibleSubsectors, setVisibleSubsectors] = useState(false);
  const [selectedSubSectors, setSelectedSubSectors] = useState({});

  const [showFilter, setShowFilter] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [years, setYears] = useState([])

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
    setShowSearchPopup(!showFilter);
  };

  const handleCloseFilter = () => {
    setShowFilter(false);
  };

  const handleApplyFilter = () => {
    // Apply filter logic
    setShowFilter(false);
    setShowSearchPopup(false)
  };

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const data = await getAuthors();
        setAuthors(data);
        setLoadingAuthors(false);
      } catch (err) {
        setErrorAuthors(err);
        setLoadingAuthors(false);
      }
    };

    const fetchSectors = async () => {
      try {
        const data = await getSectors();
        setSectors(data);
      } catch (err) {
        console.error("Error fetching sectors:", err);
      }
    };

    const fetchSubSectors = async () => {
      const selectedSectorIds = Object.keys(selectedSectors).filter(
        (sid) => selectedSectors[sid]
      );
      if (selectedSectorIds.length > 0) {
        try {
          const data = await getSubSectors(selectedSectorIds);
          setSubsectors(data);
          setVisibleSubsectors(true);
        } catch (error) {
          console.error("Error fetching subsectors:", error);
        }
      } else {
        setSubsectors([]);
        setVisibleSubsectors(false);
      }
    };

    const fetchYearAndCount = async () => {
      try {
        const data = await getYearAndCount();
        setYears(data);
      } catch (err) {
        console.error("Error fetching years:", err);
      }
    };

    fetchSubSectors();
    fetchAuthors();
    fetchSectors();
    fetchYearAndCount();
  }, [selectedSectors]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoadingReports(true);
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
          authorParam,
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
        setLoadingReports(false);
      } catch (err) {
        setErrorReports(err);
        setLoadingReports(false);
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

  const handleAuthorCheckboxChange = (aid) => {
    setSelectedAuthors((prev) => ({
      ...prev,
      [aid]: !prev[aid],
    }));
    setPage(1);
  };

  const handleYearCheckboxChange = (year) => {
    setSelectedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
    setPage(1);
    setAllReports([]);
  };

  const handleSectorCheckboxChange = (sid) => {
    setSelectedSectors((prev) => ({
      ...prev,
      [sid]: !prev[sid],
    }));
    setPage(1);
    setAllReports([]);
  };

  const handleSubSectorCheckboxChange = (ssid) => {
    setSelectedSubSectors((prev) => ({
      ...prev,
      [ssid]: !prev[ssid],
    }));
    setPage(1);
    setAllReports([]);
  };

  const toggleAuthorsPopup = () => {
    setShowAuthorsPopup(!showAuthorsPopup);
  };

  const toggleSectorsPopup = () => {
    setShowSectorsPopup(!showSectorsPopup);
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const inputRef = useRef();

  const handleSearchMobile = () => {
    setShowSearchPopup(!showSearchPopup);
    setShowFilter(false);
  };

  const handleSearchClick = () => {
    const query = inputRef.current.value;
    setPage(1);
    setAllReports([]);
    setSearchQuery(query);
    inputRef.current.value = "";
  };

  useEffect(() => {
    if (showAuthorsPopup || showSectorsPopup || showFilter) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [showAuthorsPopup, showSectorsPopup, showFilter]);

  if (loadingAuthors || loadingReports) {
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
          </div>
          <div className="rightSection">
            <div className="searchSection">
              <input
                type="text"
                name="report"
                placeholder={searchQuery ? searchQuery : "Search..."}
                ref={inputRef}
              />
              <button onClick={handleSearchClick}>Search</button>
            </div>
          </div>
        </div>
      </div>

      <div className="lowersection">
        <div className="leftFilter">
          <div className="filters">
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
                    <p>{year.year} ({year.totalReport})</p>
                  </span>
                ))}
              </div>
            </div>

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
                    {author.name} ({author.totalReports})
                  </span>
                ))}
              </div>
              <div className="loadmore">
                {visibleAuthors < authors.length && (
                  <span onClick={toggleAuthorsPopup}>+25 more</span>
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
                        <span key={author.aid} className="popup-authorCheckbox">
                          <input
                            type="checkbox"
                            checked={selectedAuthors[author.aid] || false}
                            onChange={() =>
                              handleAuthorCheckboxChange(author.aid)
                            }
                          />{" "}
                          {author.name} ({author.totalReports})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                    <p>
                      {sector.name} ({sector.totalReports})
                    </p>
                  </span>
                ))}
              </div>
              <div className="loadmore">
                {visibleSectors < sectors.length && (
                  <span onClick={toggleSectorsPopup}>+25 more</span>
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
                        <span key={sector.sid} className="popup-sectorCheckbox">
                          <input
                            type="checkbox"
                            checked={selectedSectors[sector.sid] || false}
                            onChange={() =>
                              handleSectorCheckboxChange(sector.sid)
                            }
                          />
                          <p>
                            {sector.name} ({sector.totalReports})
                          </p>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {visibleSubsectors && (
              <div className="subCategory">
                <h4>Sub Categories</h4>
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
                      <p>
                        {subsector.name} ({subsector.totalReports})
                      </p>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rightReports">
          <div className="reports">
            {allReports.map((report, index) => (
              <ReportCard key={index} report={report} />
            ))}
          </div>
          <div className="pagination">
            {allReports.length === 0 ? (
              <div className="no-more-reports">
                No (more) reports. Please <a href="/contact"> contact us </a> to
                suggest if we have missed any.
              </div>
            ) : (
              <div className="load-more">
                <button onClick={handleLoadMore}>Load More</button>
              </div>
            )}
          </div>
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
                placeholder={searchQuery ? searchQuery : "Search..."}
                ref={inputRef}
              />
              <button onClick={handleSearchClick}>Search</button>
            </div>
          </div>
        </div>
      )}

      {showFilter && (
        <div className="mobileFilterPopup">
          <div className="filterScreen">
            {/* <div className="filterHeading">
              <span>Year</span>
              <span>Authors</span>
              <span>Sectors</span>
              <span>Sub Sectors</span>
            </div> */}
            <div className="filterData">
              <div className="year">
                <h4>Select Year</h4>
                <div className="yearData">
                  {years.map((year) => (
                    <span key={year} className="yearCheckbox">
                      <input
                        type="checkbox"
                        checked={selectedYears[year] || false}
                        onChange={() => handleYearCheckboxChange(year)}
                      />
                      <p>{year}</p>
                    </span>
                  ))}
                </div>
              </div>

              <div className="category">
                <h4>Sector</h4>
                <div className="categoryData">
                  {sectors.map((sector) => (
                    <span key={sector.sid} className="popup-sectorCheckbox">
                      <input
                        type="checkbox"
                        checked={selectedSectors[sector.sid] || false}
                        onChange={() => handleSectorCheckboxChange(sector.sid)}
                      />
                      <p>
                        {sector.name} ({sector.totalReports})
                      </p>
                    </span>
                  ))}
                </div>
              </div>

              {visibleSubsectors && (
                <div className="subCategory">
                  <h4>Sub Categories</h4>
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
                        <p>
                          {subsector.name} ({subsector.totalReports})
                        </p>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="author">
                <h4>Authors</h4>
                <div className="authorsData">
                  {authors.map((author) => (
                    <span key={author.aid} className="popup-authorCheckbox">
                      <input
                        type="checkbox"
                        checked={selectedAuthors[author.aid] || false}
                        onChange={() => handleAuthorCheckboxChange(author.aid)}
                      />{" "}
                      {author.name} ({author.totalReports})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
