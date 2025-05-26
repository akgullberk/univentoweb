import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import UserHeader from '../../components/UserHeader';
import './styles.css';

const MyEvents = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [presidentClub, setPresidentClub] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/');
        return;
      }
      setUser(currentUser);

      const presidentClubData = localStorage.getItem('presidentClub');
      if (presidentClubData) {
        const clubData = JSON.parse(presidentClubData);
        setPresidentClub(clubData);
        fetchMyEvents(clubData.id);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchMyEvents = async (clubId) => {
    try {
      const eventsResponse = await fetch('http://16.170.205.160/api/events');
      const allEvents = await eventsResponse.json();
      
      const filteredEvents = Array.isArray(allEvents) 
        ? allEvents.filter(event => event.club_id === '67d1717b305efa4549b0eb97')
        : [];

      const sortedEvents = filteredEvents.sort((a, b) => {
        return new Date(b.date_time) - new Date(a.date_time);
      });

      setMyEvents(sortedEvents);
    } catch (error) {
      console.error('Etkinlikler alınırken hata oluştu:', error);
      setMyEvents([]);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
      try {
        const response = await fetch(`http://16.170.205.160/api/events/${eventId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setMyEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
          setSuccess('Etkinlik başarıyla silindi');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Etkinlik silinirken bir hata oluştu');
          setTimeout(() => setError(''), 3000);
        }
      } catch (error) {
        console.error('Etkinlik silinirken hata:', error);
        setError('Etkinlik silinirken bir hata oluştu');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  if (!user || !presidentClub) {
    return null;
  }

  return (
    <div className="profile-container">
      <div className="top-banner">
        <div className="banner-content">
          <div className="banner-logo">UniVento</div>
          <UserHeader user={user} />
        </div>
      </div>
      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <h2>{presidentClub.name} Etkinlikleri</h2>
            <button className="back-button" onClick={() => navigate('/profile')}>
              Geri Dön
            </button>
          </div>
          <div className="events-list">
            {myEvents.length === 0 ? (
              <p>Henüz etkinlik bulunmuyor.</p>
            ) : (
              myEvents.map((event) => (
                <div key={event.id} className="event-item">
                  <div className="event-info">
                    <h3>{event.name}</h3>
                    <p><strong>Konum:</strong> {event.location}</p>
                    <p><strong>Tarih:</strong> {new Date(event.date_time).toLocaleString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                    <p><strong>Detaylar:</strong> {event.details}</p>
                    <p><strong>Durum:</strong> {
                      new Date(event.date_time) > new Date() ? 
                      <span className="status-active">Aktif</span> : 
                      <span className="status-past">Geçmiş</span>
                    }</p>
                  </div>
                  <div className="event-actions">
                    <button
                      className="view-requests-button"
                      onClick={() => navigate('/profile/requests')}
                    >
                      Katılım İstekleri
                    </button>
                    {new Date(event.date_time) > new Date() && (
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Sil
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {(error || success) && (
          <div className={`alert ${error ? 'alert-error' : 'alert-success'}`}>
            {error || success}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents; 