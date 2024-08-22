import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportDetails } from "../../Services/Api";
import "./ReportDetails.css";
import ReportCardSlider from "../../components/ReportCardSlider/ReportCardSlider";

const ReportDetails = () => {
  const { rid } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const data = await getReportDetails(rid);
      setReport(data);
    };
    fetchReport();
  }, [rid]);

  if (!report) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="reportDetails">
        <div className="reportInfoStrip">
          <h1>{report.title}</h1>
          <p>
            By ~ {report.author} • {report.sector} • {report.subSector}
          </p>
        </div>
        {/* Add a wrapper around iframe for responsiveness */}
        <div className="report-frame-wrapper">
          <iframe
            className="report-frame"
            src={report.link}
            frameBorder="0"
            scrolling="yes"
            title="Report PDF"
          ></iframe>
        </div>
      </div>
      <div className="simmilarReport">
        <h1>Similar Reports</h1>
        <ReportCardSlider reports={report.similarReports} />
      </div>
    </>
  );
};

export default ReportDetails;
