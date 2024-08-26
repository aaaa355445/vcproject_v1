import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css"; // Import necessary styles
import { getReportDetails } from "../../Services/Api";
import "./ReportDetails.css";
import ReportCardSlider from "../../components/ReportCardSlider/ReportCardSlider";

const ReportDetails = () => {
  const { rid } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const data = await getReportDetails(rid);
      const modifiedLink = data.link.replace(".cdn", "");
      setReport({ ...data, link: modifiedLink });
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

        <div className="pdfViewer">
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
          >
            <Viewer
              fileUrl="/pdfjs/pdf.js"
              onError={(error) => console.error("Failed to load PDF:", error)}
            />
          </Worker>
        </div>
      </div>

      <div className="similarReport">
        <h1>Similar Reports</h1>
        <ReportCardSlider reports={report.similarReports} />
      </div>
    </>
  );
};

export default ReportDetails;
