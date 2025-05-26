import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import UserHeader from '../../components/UserHeader';
import './styles.css';

const ParticipationRequests = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [presidentClub, setPresidentClub] = useState(null);
  const [participationRequests, setParticipationRequests] = useState([]);
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
        setPresidentClub(JSON.parse(presidentClubData));
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user && user.email) {
      fetchParticipationRequests();
    }
  }, [user]);

  const fetchParticipationRequests = async () => {
    try {
      const response = await fetch(`http://16.170.205.160/api/events/participation-requests/${user.email}`);
      if (!response.ok) {
        throw new Error('Katılım istekleri alınamadı');
      }
      const data = await response.json();
      setParticipationRequests(data);
    } catch (error) {
      console.error('Katılım istekleri alınırken hata:', error);
      setError('Katılım istekleri alınırken bir hata oluştu');
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      const response = await fetch(`http://16.170.205.160/api/events/participation-requests/${requestId}?status=${status}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setParticipationRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === requestId ? { ...request, status } : request
          )
        );
        setSuccess(`İstek başarıyla ${status === 'approved' ? 'onaylandı' : 'reddedildi'}`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('İstek güncellenirken bir hata oluştu');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('İstek güncellenirken hata:', error);
      setError('İstek güncellenirken bir hata oluştu');
      setTimeout(() => setError(''), 3000);
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
            <h2>Katılım İstekleri</h2>
            <button className="back-button" onClick={() => navigate('/profile')}>
              Geri Dön
            </button>
          </div>
          <div className="requests-list">
            {!Array.isArray(participationRequests) || participationRequests.length === 0 ? (
              <p>Henüz katılım isteği bulunmuyor.</p>
            ) : (
              participationRequests.map((request) => (
                <div key={request.id || request._id} className="request-item">
                  <div className="request-info">
                    <p><strong>Etkinlik:</strong> {request.event_name}</p>
                    <p><strong>Öğrenci E-posta:</strong> {request.email}</p>
                    <p><strong>Durum:</strong> {
                      request.status === 'pending' ? 'Bekliyor' :
                      request.status === 'approved' ? 'Onaylandı' :
                      request.status === 'rejected' ? 'Reddedildi' : 'Bilinmiyor'
                    }</p>
                    <p><strong>Başvuru Tarihi:</strong> {new Date(request.created_at).toLocaleDateString('tr-TR')}</p>
                  </div>
                  {request.status === 'pending' && (
                    <div className="request-actions">
                      <button
                        className="approve-button"
                        onClick={() => handleRequestAction(request.id || request._id, 'approved')}
                      >
                        Onayla
                      </button>
                      <button
                        className="reject-button"
                        onClick={() => handleRequestAction(request.id || request._id, 'rejected')}
                      >
                        Reddet
                      </button>
                    </div>
                  )}
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

export default ParticipationRequests; 