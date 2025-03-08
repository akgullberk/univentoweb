import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import KulupSec from './pages/KulupSec';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kulup-sec" element={<KulupSec />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
