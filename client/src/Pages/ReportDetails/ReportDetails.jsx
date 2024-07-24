import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getReportDetails } from "../../Services/Api";
import "./ReportDetails.css";

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
        <iframe
          className="report-frame"
          src={report.link}
          style={{ width: "100%", height: "1000px" }}
          frameBorder="0"
        ></iframe>
      </div>
      <div>
        <h1>Simmilar Reports</h1>
      </div>
    </>
  );
};

export default ReportDetails;
