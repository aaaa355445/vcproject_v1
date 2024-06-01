const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const apiUrl = 'http://localhost:5500/api/upload-report';

const uploadReport = async (report) => {
  console.log(JSON.stringify(report))
  try {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: apiUrl,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : report
    };
    
    axios.request(config)
    .then((response) => {
      console.log(`Report uploaded successfully: ${response.title}`);
    })
    .catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.error(`Error uploading report: ${report.title}`);
  }
};

const parseCSVAndUpload = (filePath) => {
  const reports = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      // Adjust property names as needed based on your CSV header
      const report = {
        title: row.title,
        year: row.year,
        month: row.month,
        authors: row.authors,
        author_type: row.author_type,
        category: row.category,
        subcategory: row.subcategory,
        reportlink: row.reportlink,
        market: row.market,
        thumbnail: row.thumbnail,
      };

      const jsonFormattedReports = JSON.stringify(report);

      reports.push(jsonFormattedReports);
      console.log(reports)

    })
    .on('end', () => {
      // Upload each report to the API
      reports.forEach(uploadReport);
    });
};

// Specify the path to your CSV file
const csvFilePath = './reports.csv';

parseCSVAndUpload(csvFilePath);
