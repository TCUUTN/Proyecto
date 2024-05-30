import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Contact from './pages/Contact';
import Home from './pages/Home_Login';
import FooterPage from './pages/FooterPage';
import InicioAdmin  from './pages/Inicio/Home_Admin';




  function App() {
  
    return (
      <Router>
        <div className="App">
          <Navbar />
          <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/footer" element={<FooterPage />} />
            <Route path="/Home_Admin" element={<InicioAdmin/>} />
          </Routes>
        </div>
      </div>
      </Router>
    );
  }
  
  export default App;
