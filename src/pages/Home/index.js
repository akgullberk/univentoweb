import React from 'react';
import './styles.css';

const Home = () => {
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
      <div className="content">
        <p>Bu sizin ana sayfanız</p>
      </div>
    </div>
  );
};

export default Home; 