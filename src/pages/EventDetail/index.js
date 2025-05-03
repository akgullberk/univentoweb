import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase/config';
import UserHeader from '../../components/UserHeader';
import './styles.css';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const event = location.state?.eventData;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/800x400';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://127.0.0.1:8000${imageUrl}`;
  };

  const handleParticipate = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/event-participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          user_id: user.uid
        })
      });

      if (!response.ok) {
        throw new Error('Etkinliğe katılım başarısız oldu.');
      }

      setIsParticipating(true);
      setSuccess('Etkinliğe başarıyla katıldınız!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Etkinliğe katılırken bir hata oluştu.');
    }
  };

  if (!event) {
    return <div className="loading">Etkinlik bulunamadı</div>;
  }

  return (
    <div className="event-detail-container">
      <div className="top-banner">
        <div className="banner-content">
          <div className="banner-logo">UniVento</div>
          {user && <UserHeader user={user} />}
        </div>
      </div>
      <div className="event-detail-content">
        <div className="event-detail-card">
          <div className="event-image">
            <img src={getImageUrl(event.image_url)} alt={event.name} />
          </div>
          <div className="event-info">
            <h1>{event.name}</h1>
            <div className="info-group">
              <label>Konum:</label>
              <p>{event.location}</p>
            </div>
            <div className="info-group">
              <label>Tarih ve Saat:</label>
              <p>{event.date_time}</p>
            </div>
            <div className="info-group">
              <label>Detaylar:</label>
              <p>{event.details}</p>
            </div>
            {!isParticipating && (
              <button 
                className="participate-button"
                onClick={handleParticipate}
              >
                Etkinliğe Katıl
              </button>
            )}
            {isParticipating && (
              <div className="participating-message">
                Bu etkinliğe katılıyorsunuz!
              </div>
            )}
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </div>
  );
};

export default EventDetail; 