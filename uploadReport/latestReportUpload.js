const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const path = require('path');

const csvFilePath = path.join(__dirname, './reports.csv');
const apiEndpoint = 'http://localhost:5500/admin/add/report'; 

// Map sector and sub-sector names to their IDs
const sectorMap = {
  'Agritech': 2000,
  'AI & Deeptech': 3000,
  'Climate & Sustainability': 4000,
  'Consumer Tech': 5000,
  'Content & Media': 6000,
  'Employment': 7000,
  'EV & Renewables': 8000,
  'Financial Services': 9000,
  'Healthcare': 10000,
  'Hospitality, QSR & Food': 11000,
  'Human Resources': 12000,
  'India Stack': 13000,
  'Industrials, Materials & Manufacturing': 14000,
  'Infrastructure & Security': 15000,
  'Insurance': 16000,
  'IT & Outsourcing': 17000,
  'Retail': 18000,
  'Social & Advertising': 19000,
  'Software': 20000,
  'Space & Aerospaces': 21000,
  'Venture Capital & Private Equity': 22000,
  'Jewelry': 23000
};


const subSectorMap = {
  'Agritech': 2001,
  'Internet of Things (IoT)': 3001,
  'AI & Analytics': 3002,
  'Automations & Robotics': 3003,
  'Gen AI': 3004,
  'Circular Economy': 4001,
  'ESG': 4002,
  'Energy Transition': 4003,
  'Gaming': 5001,
  'Marketplaces': 5002,
  'Edtech': 5003,
  'Indian Consumer': 5004,
  'Beauty & Personal care': 5005,
  'Ecommerce': 5006,
  'Foodtech': 5007,
  'B2B': 5008,
  'D2C': 5009,
  'Logistics Tech': 5010,
  'Fintech': 5011,
  'Travel Tech': 5012,
  'Ride Hailing': 5013,
  'Social Commerce': 5014,
  'Consumer Spending': 5015,
  'Rehab Tech': 5016,
  'Super Apps': 5017,
  'Creator Economy': 6001,
  'Blue Collar Workforce': 7001,
  'BatteryTech': 8001,
  'EV': 8002,
  'SME Credit': 9002,
  'Lending': 9003,
  'Asset based Financing': 9004,
  'Venture Debt': 9005,
  'Mental Health': 10001,
  'Chronic Care': 10002,
  'Health & Wellness': 10003,
  'Preventive Care': 10004,
  'Restaurants': 11001,
  'Health Food': 11002,
  'Talent Trends': 12001,
  'DPI': 13001,
  'Chemicals': 14001,
  'Raw Materials Sourcing': 14002,
  'Packaging': 14003,
  'Dev tools': 15001,
  'Data Centres': 15002,
  'Insurtech': 16001,
  'Retail Insurance': 16002,
  'Global Services Delivery': 17001,
  'Fashion': 18001,
  'Grocery & Staples': 18002,
  'Retail-tech': 18003,
  'Adtech': 19001,
  'Social Media': 19002,
  'Short form video (SFV)': 19003,
  'Cybersecurity': 20001,
  'HRTech': 20002,
  'Indian SaaS': 20003,
  'Cloud Services': 20004,
  'Quality Assurance & Testing': 20005,
  'No code': 20006,
  'Information Technology (IT)': 20007,
  'Platform as a Service (PaaS)': 20008,
  'SaaS': 20009,
  'Data & Analytics': 20010,
  'BPO': 20011,
  'Spacetech': 21001,
  'Drone tech': 21002,
  'Funding Trends': 22001,
  'VC Returns': 22002,
  'Termsheets': 22003,
  'Sectors Review': 22004,
  'Distressed & Insolvency': 22005,
  'Startup ecosystem': 22006,
  'Lab grown jewelry': 23001
};

const authorMap = {
  'Bain & Company': 1001,
  'EY': 1002,
  'RedSeer': 1003,
  'BCG': 1004,
  'Kearney': 1005,
  '1Lattice': 1006,
  'FICCI': 1007,
  'Avendus Capital': 1008,
  'Inc42': 1009,
  'YourStory': 1010,
  'Elevation Capital': 1011,
  'Blume Ventures': 1012,
  'Kalaari Capital': 1013,
  'DSG Consumer Partners': 1014,
  'Eximus Ventures': 1015,
  'Stride Ventures': 1016,
  'Temasek': 1017,
  'Matrix Partners India': 1018,
  'Chiratae Ventures': 1019,
  'Peak XV': 1020,
  'Lumikai Fund': 1021,
  'Google': 1022,
  'GetVantage': 1023,
  'Bigbasket': 1024,
  'Tracxn': 1025,
  'Fireside Ventures': 1026
};


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
      const authors = row['Author/Company'].split(',').map(author => authorMap[author.trim()]);
      const reportData = {
        rid: parseInt(row['Serial No.'], 10),
        title: row['Name of the report'],
        year: parseInt(row['Year'], 10),
        month: row['Released Month'] || "NA",
        author: authors.filter(Boolean),
        sector: sectorMap[row['Sector']],
        subSector: subSectorMap[row['Sub-sector']], 
        link: row['CDN Report Link'],
        image: row['Thumbnail Links- New']
      };
      reports.push(reportData);
    })
    .on('end', async () => {
      console.log('CSV file successfully processed.');
      for (const report of reports) {
        // console.log(report)
        console.log("Report uploading", report.rid)
        await uploadReport(report);
      }
    });
};

processCSV();
