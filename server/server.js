require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5500;
const DbConnect = require("./db");
DbConnect();

// CORS 
const cors = require("cors");
app.use(cors());

// Exporting Routes 
const router = require('./routes');
app.use(express.json());
app.use(router);

// Dummy Api to check express server
app.get('/', (req, res) => {
    res.send('Hello from Express server');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));