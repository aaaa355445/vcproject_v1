const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');

const csvFilePath = './reports 19 feb.csv';
const apiUrl = 'https://the-vc-project.onrender.com/api/upload-report';

async function uploadReport(reportData) {
  try {
    const response = await axios.post(apiUrl, reportData);
    console.log(response.data.message);
  } catch (error) {
    console.error('Error uploading report:', error.message);
  }
}

function parseCSVAndUpload() {
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      // Modify this part based on your CSV structure
      const reportData = {
        title: row.title,
        year: row.year,
        month: row.month,
        authors: row.author,
        author_type: row.author_type,
        category: row.category,
        subcategory: row.subcategory,
        reportlink: row.reportlink,
        market: row.market,
        thumbnail: row.thumbnail,
      };

      uploadReport(reportData);
    })
    .on('end', () => {
      console.log('CSV file successfully processed.');
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error.message);
    });
}

// Start the CSV parsing and uploading process
parseCSVAndUpload();
