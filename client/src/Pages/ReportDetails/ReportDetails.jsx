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
        {/* <div className="reportInfo">
        <h1>{report.title}</h1>
        <p>By: {report.author}</p>
        <p>• {report.sector} • {report.subSector}</p>
        <p>{report.year}</p>
        </div> */}
        {/* <div className="reportInfoStrip">
        <h1>{report.title}</h1>
        <p>By ~ {report.author} • {report.sector} • {report.subSector}</p>
        </div> */}
        <iframe
        src={report.link}
        style={{ width: '100%', height: '1000px' }}
        frameBorder="0"
      ></iframe>
      </div>
      <div>
      </div>
    </>
  );
};

export default ReportDetails;
