import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import UserHeader from '../../components/UserHeader';
import './styles.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [presidentClub, setPresidentClub] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/');
        return;
      }
      setUser(currentUser);

      const role = localStorage.getItem('userRole');
      const presidentClubData = localStorage.getItem('presidentClub');
      
      setUserRole(role || 'user');
      
      if (role === 'president' && presidentClubData) {
        setPresidentClub(JSON.parse(presidentClubData));
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!user) {
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
        <div className="menu-grid">
          <div className="menu-card" onClick={() => navigate('/profile/info')}>
            <div className="menu-icon">👤</div>
            <h3>Profil Bilgileri</h3>
            <p>Kişisel bilgilerinizi görüntüleyin ve düzenleyin</p>
          </div>
          
          {userRole === 'president' && presidentClub && (
            <>
              <div className="menu-card" onClick={() => navigate('/profile/my-events')}>
                <div className="menu-icon">📅</div>
                <h3>Etkinliklerim</h3>
                <p>{presidentClub.name} kulübünün etkinliklerini görüntüleyin ve yönetin</p>
              </div>

              <div className="menu-card" onClick={() => navigate('/profile/create-event')}>
                <div className="menu-icon">➕</div>
                <h3>Yeni Etkinlik Oluştur</h3>
                <p>Kulübünüz için yeni etkinlikler oluşturun</p>
              </div>

              <div className="menu-card" onClick={() => navigate('/profile/membership-requests')}>
                <div className="menu-icon">👥</div>
                <h3>Üyelik İstekleri</h3>
                <p>Kulübünüze gelen üyelik başvurularını yönetin</p>
              </div>

              <div className="menu-card" onClick={() => navigate('/profile/club-members')}>
                <div className="menu-icon">🎓</div>
                <h3>Kulüp Üyeleri</h3>
                <p>Kulübünüzün onaylanmış üyelerini görüntüleyin</p>
              </div>
            </>
          )}

          {userRole !== 'president' && (
            <div className="menu-card" onClick={() => navigate('/profile/joined-clubs')}>
              <div className="menu-icon">🏢</div>
              <h3>Üye Olduğum Kulüpler</h3>
              <p>Katıldığınız kulüpleri görüntüleyin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 