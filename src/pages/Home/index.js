import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import UserHeader from '../../components/UserHeader';
import './styles.css';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Etkinlikler yüklenirken hata oluştu:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleSearchClick = () => {
    navigate('/kulup-sec');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/300x200';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://127.0.0.1:8000${imageUrl}`;
  };

  return (
    <div className="home-container">
      <div className="top-banner">
        <div className="banner-content">
          <div className="banner-logo">UniVento</div>
          {user ? (
            <UserHeader user={user} />
          ) : (
            <div className="circle-element">
              <div className="auth-container" onClick={handleRegisterClick}>
                <span className="auth-button">Üye Ol</span>
              </div>
              <div className="auth-container" onClick={handleLoginClick}>
                <span className="auth-button">Üye Girişi</span>
              </div>
            </div>
          )}
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
        <div className="events-grid">
          {events.map((event, index) => (
            <div key={index} className="event-card">
              <div className="event-image">
                <img 
                  src={getImageUrl(event.image_url)} 
                  alt={event.name} 
                />
              </div>
              <div className="event-info">
                <h3>{event.name}</h3>
                <p className="event-location">{event.location}</p>
                <p className="event-date">{event.date_time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 