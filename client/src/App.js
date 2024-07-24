import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Naviggation/Navigation';
import Home from './Pages/Home/Home';
import Reports from './Pages/Reports/Reports';
import Footer from './components/Footer/Footer';
import Contact from './Pages/Contact/Contact';
import FaqPage from './Pages/Faq/FaqPage';
import React, { useEffect } from 'react';
import { generateGuestUserId } from './Services/Api';
import ReportDetails from './Pages/ReportDetails/ReportDetails';

function App() {
  useEffect(() => {
    generateGuestUserId();
  }, []);
  return (
    <BrowserRouter>
    <Navigation /> 
      <Routes >
          <Route path="/" element={<Home/>} exact />
          <Route path="/reports" element={<Reports/>} exact />
          <Route path="/contact" element={ <Contact/>} exact /> 
          <Route path="/faq" element={ <FaqPage/>} exact /> 
          <Route path="/report/:rid" element={ <ReportDetails />} />
      </Routes >
      <Footer />
  </BrowserRouter>

  );
}

export default App;
