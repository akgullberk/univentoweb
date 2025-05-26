import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import UserHeader from '../../components/UserHeader';
import './styles.css';

const ClubDetail = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinStatus, setJoinStatus] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        const response = await fetch('http://16.170.205.160/clubs');
        const clubs = await response.json();
        const selectedClub = clubs.find(c => c._id === clubId);
        
        if (!selectedClub) {
          throw new Error('Kulüp bulunamadı');
        }
        
        setClub(selectedClub);
        setLoading(false);
      } catch (error) {
        console.error('Veri alınırken hata:', error);
        setError('Kulüp bilgileri yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    if (clubId) {
      fetchClubDetails();
    }
  }, [clubId]);

  const handleJoinClub = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', user.email);

      console.log('Joining club with ID:', club._id);

      const response = await fetch(`http://16.170.205.160/api/clubs/${club._id}/join`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.status_code === 200) {
        setJoinStatus('success');
        setTimeout(() => setJoinStatus(''), 3000);
      } else if (data.status_code === 400) {
        setJoinStatus('already');
        setTimeout(() => setJoinStatus(''), 3000);
      } else {
        setJoinStatus('error');
        setTimeout(() => setJoinStatus(''), 3000);
      }
    } catch (error) {
      console.error('Üyelik başvurusu sırasında hata:', error);
      setJoinStatus('error');
      setTimeout(() => setJoinStatus(''), 3000);
    }
  };

  const handleBack = () => {
    navigate('/kulup-sec');
  };

  if (loading) {
    return (
      <div className="club-detail-container">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="club-detail-container">
        <div className="error">{error}</div>
        <button onClick={handleBack} className="back-button">Geri Dön</button>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="club-detail-container">
        <div className="error">Kulüp bulunamadı</div>
        <button onClick={handleBack} className="back-button">Geri Dön</button>
      </div>
    );
  }

  return (
    <div className="club-detail-container">
      <div className="top-banner">
        <div className="banner-content">
          <div className="banner-logo">UniVento</div>
          {user && <UserHeader user={user} />}
        </div>
      </div>
      
      <div className="club-detail-content">
        <div className="club-header">
          <button onClick={handleBack} className="back-button">
            Geri Dön
          </button>
          <h1>{club.name}</h1>
        </div>

        <div className="club-info">
          <div className="club-logo">
            <img src={club.logo_url} alt={`${club.name} logosu`} />
          </div>
          
          <div className="club-description">
            <h2>Kulüp Bilgileri</h2>
            <p><strong>E-posta:</strong> {club.email || 'Belirtilmemiş'}</p>
            <p><strong>Website:</strong> {club.website ? (
              <a href={club.website} target="_blank" rel="noopener noreferrer" className="website-link">
                {club.website}
              </a>
            ) : 'Belirtilmemiş'}</p>
            <p><strong>Danışman:</strong> {club.advisor || 'Belirtilmemiş'}</p>
            <p><strong>Başkan:</strong> {club.president || 'Belirtilmemiş'}</p>
            <p><strong>Kategori:</strong> {club.category || 'Belirtilmemiş'}</p>

            <div className="join-section">
              <button onClick={handleJoinClub} className="join-button">
                Kulübe Üye Ol
              </button>
              {joinStatus === 'success' && (
                <div className="status-message success">
                  Üyelik başvurunuz başarıyla alındı!
                </div>
              )}
              {joinStatus === 'already' && (
                <div className="status-message warning">
                  Bu kulübe zaten üyelik başvurunuz bulunmakta.
                </div>
              )}
              {joinStatus === 'error' && (
                <div className="status-message error">
                  Üyelik başvurusu sırasında bir hata oluştu.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail; 