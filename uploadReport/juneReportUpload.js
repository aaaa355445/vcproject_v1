const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const path = require('path');

const csvFilePath = path.join(__dirname, './24JuneReports .csv');
const apiEndpoint = 'http://localhost:5500/admin/add/report';

const uploadReport = async (reportData) => {
  try {
    const response = await axios.post(apiEndpoint, reportData);
    console.log('Report Added Successfully:', response.data);
  } catch (error) {
    console.error('Error adding report:', error.response ? error.response.data : error.message);
  }
};

const processCSV = () => {
  const reports = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      const authors = row['AID'].split(',').map(author => author.trim());
      const tags = row['Tags'].split(',').map(tag => tag.trim());
      const reportData = {
        rid: parseInt(row['S.no'], 10),
        title: row['Name of the report'],
        year: parseInt(row['Year'], 10),
        month: row['Released Month'] || "NA",
        author: authors.filter(Boolean),
        sector: parseInt(row['SID'], 10),
        subSector: parseInt(row['SSID'], 10),
        link: row['CDN Report Link'],
        image: row['Thumbnail Links- New'],
        tags: tags.filter(Boolean)
      };
      console.log(reportData)
      reports.push(reportData);
    })
    .on('end', async () => {
      console.log('CSV file successfully processed.');
      for (const report of reports) {
        console.log("Report uploading", report.rid)
        await uploadReport(report);
      }
    });
};

processCSV();
