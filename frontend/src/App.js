import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Contact from './pages/Contact';
import Home from './pages/Home_Login';
import FooterPage from './pages/FooterPage';




  function App() {
  
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/footer" element={<FooterPage />} />
          </Routes>
        </div>
      </Router>
    );
  }
  
  export default App;
