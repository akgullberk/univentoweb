import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const Home = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/kulup-sec');
  };

  return (
    <div className="home-container">
      <div className="top-banner">
        <div className="banner-content">
          <div className="banner-logo">UniVento</div>
          <div className="circle-element">
            <div className="auth-container">
              <span className="auth-button">Üye Ol</span>
            </div>
            <div className="auth-container">
              <span className="auth-button">Üye Girişi</span>
            </div>
          </div>
        </div>
      </div>
      <div className="search-container">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Etkinlik veya kategori ara..."
        />
        <div className="search-button" onClick={handleSearchClick}>
          Ara
        </div>
      </div>
      <div className="content">
        <p>Bu sizin ana sayfanız</p>
      </div>
    </div>
  );
};

export default Home; 