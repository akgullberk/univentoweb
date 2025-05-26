import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import UserHeader from '../../components/UserHeader';
import './styles.css';

const ClubMembers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
        return;
      }
      setUser(currentUser);
      fetchClubMembers(currentUser.email);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchClubMembers = async (presidentEmail) => {
    try {
      // Onaylanmış üyeleri getir
      const response = await fetch(`http://16.170.205.160/api/clubs/membership-requests/${presidentEmail}`);
      if (!response.ok) {
        throw new Error('Üye listesi alınamadı');
      }
      const data = await response.json();
      
      // Sadece onaylanmış üyeleri filtrele
      const approvedMembers = data.filter(member => member.status === 'approved');
      setMembers(approvedMembers);
      setLoading(false);
    } catch (error) {
      console.error('Üye listesi alınırken hata:', error);
      setError('Üye listesi yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="club-members-container">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="club-members-container">
      <div className="top-banner">
        <div className="banner-content">
          <div className="banner-logo">UniVento</div>
          <UserHeader user={user} />
        </div>
      </div>

      <div className="club-members-content">
        <div className="header">
          <button onClick={handleBack} className="back-button">
            Geri Dön
          </button>
          <h1>Kulüp Üyeleri</h1>
        </div>

        {error ? (
          <div className="error">{error}</div>
        ) : members.length === 0 ? (
          <div className="no-members">Henüz onaylanmış üye bulunmamaktadır.</div>
        ) : (
          <div className="members-list">
            {members.map((member) => (
              <div key={member.id} className="member-card">
                <div className="member-info">
                  <div className="member-avatar">
                    {member.member_email[0].toUpperCase()}
                  </div>
                  <div className="member-details">
                    <h3>{member.member_email}</h3>
                    <p>Katılım Tarihi: {new Date(member.created_at).toLocaleDateString('tr-TR')}</p>
                    <p>Onay Tarihi: {new Date(member.updated_at).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubMembers; 