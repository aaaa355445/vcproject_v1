import axios from "axios";

const API_URL = "https://thevcproject.in/api";
// const API_URL = "http://localhost:5500"

export const getAuthors = async () => {
  try {
    const response = await axios.get(`${API_URL}/authors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw error;
  }
};

export const getSectors = async () => {
  try {
    const response = await axios.get(`${API_URL}/sector`);
    return response.data.sectors;
  } catch (error) {
    console.error('Error fetching sectors:', error);
    throw error;
  }
};

export const getSubSectors = async () => {
  try {
    const response = await axios.get(`${API_URL}/subsector`);
    return response.data.subSectors;
  } catch (error) {
    console.error('Error fetching sectors:', error);
    throw error;
  }
};

export const subscribeEmail = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/subscribe`, { email });
    return response.data;
  } catch (error) {
    console.error("Error subscribing email:", error);
    throw error;
  }
};

export const reportSubscribeEmail = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/report-subscribe`, { email });
    return response.data;
  } catch (error) {
    console.error("Error subscribing email:", error);
    throw error;
  }
};

export const submitContactForm = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/contact`, formData);
    return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
};

export const getReports = async (page = 1, year, author, searchQuery, sector, subSector) => {
  try {
    const params = { page };
    if (year) {
      params.year = year;
    }
    if (author) {
      params.author = author;
    }
    if (searchQuery) {
      params.searchQuery = searchQuery
    }
    if (sector) {
      params.sector = sector
    }
    if (subSector) {
      params.subSector = subSector
    }
    const response = await axios.get(`${API_URL}/reports`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

// export const getSubSectors = async (sectorIds) => {
//   try {
//     const response = await axios.post(`${API_URL}/sector/subsector`, { sectorIds });
//     return response.data.subsectors;
//   } catch (error) {
//     console.error('Error fetching subsectors:', error);
//     throw error;
//   }
// };

export const getYearAndCount = async () => {
  try{
    const response = await axios.get(`${API_URL}/years`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subsectors:', error);
    throw error;
  }
};
