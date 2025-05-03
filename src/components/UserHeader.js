import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import './UserHeader.css';

const UserHeader = ({ user }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('user');
  const [presidentClub, setPresidentClub] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role === 'president') {
      const clubData = JSON.parse(localStorage.getItem('presidentClub'));
      setPresidentClub(clubData);
    }
    setUserRole(role || 'user');
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userRole');
      localStorage.removeItem('presidentClub');
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="user-header">
      <div className="user-info">
        {userRole === 'president' && presidentClub && (
          <span className="user-name">{presidentClub.name} Başkanı</span>
        )}
        <button className="hesap-button" onClick={handleProfileClick}>Hesap</button>
        <button className="cikis-button" onClick={handleLogout}>Çıkış</button>
      </div>
    </div>
  );
};

export default UserHeader; 