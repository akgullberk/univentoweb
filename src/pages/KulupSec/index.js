import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const KulupSec = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="kulup-container">
      <h1 style={{ paddingLeft: '40px', paddingTop: '0px', color: 'white', textAlign: "left", fontSize: "2.5rem" }}>UniVento</h1>
      <div className="kulup-search-container" style={{ paddingLeft: '40px' }}>
        <input 
          type="text" 
          className="kulup-search-input"
          placeholder="Kulüp Ara"
        />
        <div className="search-icon">
          <FaSearch style={{ color: 'gray', fontSize: '1.5rem', marginLeft: '-30px', cursor: 'pointer' }} />
        </div>
      </div>
      <h2 style={{ paddingLeft: '40px', color: 'white', marginTop: '60px', textAlign: "left", fontSize: "3rem" }}>Kulüp Seç</h2>
      <h2 style={{ paddingLeft: '40px', color: 'white', marginTop: '20px', textAlign: "left", fontSize: "2.6rem", maxWidth: '530px', fontWeight: "bold" }}>
        Üniversitenizdeki tüm etkinlikler tek tıkla cebinizde!
      </h2>
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '40px', marginTop: '20px' }}>
        <button 
          onClick={handleClose} 
          style={{ 
            padding: '15px 30px',
            borderRadius: '35px', 
            border: 'none', 
            backgroundColor: 'white', 
            color: 'black',
            fontSize: '1.5rem',
            cursor: 'pointer', 
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
        >
          Kapat
        </button>
      </div>
      <div className="kulup-content">
        {/* Kulüp seçim içeriği buraya gelecek */}
      </div>
    </div>
  );
};

export default KulupSec; 