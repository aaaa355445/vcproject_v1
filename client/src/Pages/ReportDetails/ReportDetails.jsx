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
        <iframe
          className="report-frame"
          src={report.link}
          style={{ width: "auto", height: "100vh" }}
          frameBorder="0"
        ></iframe>
        <p>
          If the PDF is not visible,{" "}
          <a href={report.link}>click here to download it</a>.
        </p>
      </div>
      <div className="simmilarReport">
        <h1>Simmilar Reports</h1>
        <ReportCardSlider reports={report.similarReports} />
      </div>
    </>
  );
};

export default ReportDetails;
