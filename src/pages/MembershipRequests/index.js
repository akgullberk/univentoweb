import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import UserHeader from '../../components/UserHeader';
import './styles.css';

const MembershipRequests = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      fetchMembershipRequests(currentUser.email);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchMembershipRequests = async (email) => {
    try {
      const response = await fetch(`http://16.170.205.160/api/clubs/membership-requests/${email}`);
      if (!response.ok) {
        throw new Error('Üyelik istekleri alınamadı');
      }
      const data = await response.json();
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error('Üyelik istekleri alınırken hata:', error);
      setError('Üyelik istekleri yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      const response = await fetch(`http://16.170.205.160/api/clubs/membership-requests/${requestId}?status=${status}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
        }
      });

      const data = await response.json();

      if (data.status_code === 200) {
        setStatusMessage({
          type: 'success',
          message: `Üyelik başvurusu ${status === 'approved' ? 'onaylandı' : 'reddedildi'}`
        });

        // Listeyi güncelle
        setRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === requestId ? { ...request, status } : request
          )
        );
      } else {
        setStatusMessage({
          type: 'error',
          message: data.detail || 'Bir hata oluştu'
        });
      }

      setTimeout(() => setStatusMessage({ type: '', message: '' }), 3000);
    } catch (error) {
      console.error('İşlem sırasında hata:', error);
      setStatusMessage({
        type: 'error',
        message: 'İşlem sırasında bir hata oluştu'
      });
      setTimeout(() => setStatusMessage({ type: '', message: '' }), 3000);
    }
  };

  const handleBack = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="membership-requests-container">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="membership-requests-container">
      <div className="top-banner">
        <div className="banner-content">
          <div className="banner-logo">UniVento</div>
          <UserHeader user={user} />
        </div>
      </div>

      <div className="membership-requests-content">
        <div className="header">
          <button onClick={handleBack} className="back-button">
            Geri Dön
          </button>
          <h1>Üyelik İstekleri</h1>
        </div>

        {statusMessage.message && (
          <div className={`status-message ${statusMessage.type}`}>
            {statusMessage.message}
          </div>
        )}

        {error ? (
          <div className="error">{error}</div>
        ) : requests.length === 0 ? (
          <div className="no-requests">Bekleyen üyelik isteği bulunmamaktadır.</div>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-info">
                  <h3>Üyelik Başvurusu</h3>
                  <p><strong>Üye E-postası:</strong> {request.member_email}</p>
                  <p><strong>Başvuru Tarihi:</strong> {new Date(request.created_at).toLocaleString('tr-TR')}</p>
                  <p><strong>Durum:</strong> {
                    request.status === 'pending' ? 'Beklemede' :
                    request.status === 'approved' ? 'Onaylandı' :
                    request.status === 'rejected' ? 'Reddedildi' : 'Bilinmiyor'
                  }</p>
                </div>
                
                {request.status === 'pending' && (
                  <div className="request-actions">
                    <button
                      className="approve-button"
                      onClick={() => handleRequestAction(request.id, 'approved')}
                    >
                      Onayla
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleRequestAction(request.id, 'rejected')}
                    >
                      Reddet
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipRequests; 