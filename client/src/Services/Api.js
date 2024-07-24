import axios from "axios";

const API_URL = "https://thevcproject.in/api";
// const API_URL = "http://localhost:5500"


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
    let guestId = localStorage.getItem('guestUserId');
    const response = await axios.post(`${API_URL}/report-subscribe`, { email, guestId });
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

export const generateGuestUserId = () => {
  let guestUserId = localStorage.getItem('guestUserId');
  if (!guestUserId) {
      guestUserId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('guestUserId', guestUserId);
  }
  return guestUserId;
};

export const checkEmailForGuestUser = async (guestId) => {
  try {
    const response = await axios.get(`${API_URL}/check-email`, {
      params: { guestId },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking email for guest user:", error);
    throw error;
  }
};

export const saveSearchQuery = async (searchPayload) => {
  try {
    const response = await axios.post(`${API_URL}/logs-search`, searchPayload);
    return response.data;
  } catch (error) {
    console.error("Error saving search logs", error);
  }
};

export const saveReportLogs = async (reportPayload) => {
  try {
    const response = await axios.post(`${API_URL}/logs-report`, reportPayload);
    return response.data;
  } catch (error) {
    console.error("Error saving report logs", error);
  }
};

export const getFilters = async () => {
  try {
    const response = await axios.get(`${API_URL}/filters`);
    return response.data;
  } catch (error) {
    console.error('Error fetching filters:', error);
    throw error;
  }
};

export const getAuthorFilters = async (authorIds) => {
  try {
    const authors = {authorIds: authorIds}
    const response = await axios.post(`${API_URL}/author/filters`, authors);
    return response.data;
  } catch (error) {
    console.error('Error fetching filters:', error);
    throw error;
  }
};

export const getSectorFilters = async (sectorIds) => {
  try {
    const sectors = {sectorIds: sectorIds}
    const response = await axios.post(`${API_URL}/sector/filters`, sectors);
    return response.data;
  } catch (error) {
    console.error('Error fetching filters:', error);
    throw error;
  }
};

export const getReportDetails = async (rid) => {
  try {
    const response = await axios.get(`${API_URL}/report/${rid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching report details:', error);
    throw error;
  }
};