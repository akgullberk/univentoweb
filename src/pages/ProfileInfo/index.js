import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { updatePassword } from 'firebase/auth';
import UserHeader from '../../components/UserHeader';
import './styles.css';

const ProfileInfo = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/');
        return;
      }
      setUser(currentUser);

      const savedFirstName = localStorage.getItem('firstName') || '';
      const savedLastName = localStorage.getItem('lastName') || '';
      setFormData(prev => ({
        ...prev,
        firstName: savedFirstName,
        lastName: savedLastName
      }));
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    localStorage.setItem('firstName', formData.firstName);
    localStorage.setItem('lastName', formData.lastName);
    setSuccess('Profil bilgileri güncellendi.');
    setTimeout(() => setSuccess(''), 3000);
    setIsEditing(false);
  };

  const handleUpdatePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    try {
      await updatePassword(user, formData.newPassword);
      setSuccess('Şifre başarıyla güncellendi.');
      setFormData(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: ''
      }));
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Şifre güncellenirken bir hata oluştu.');
    }
  };

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
        <div className="profile-card">
          <div className="card-header">
            <h2>Profil Bilgileri</h2>
            <button className="back-button" onClick={() => navigate('/profile')}>
              Geri Dön
            </button>
            {!isEditing && (
              <button className="edit-button" onClick={() => setIsEditing(true)}>
                Düzenle
              </button>
            )}
          </div>
          <div className="profile-info">
            <div className="info-group">
              <label>Ad</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <p>{formData.firstName || 'Belirtilmemiş'}</p>
              )}
            </div>
            <div className="info-group">
              <label>Soyad</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <p>{formData.lastName || 'Belirtilmemiş'}</p>
              )}
            </div>
            <div className="info-group">
              <label>E-posta</label>
              <p>{user?.email}</p>
            </div>
            {isEditing && (
              <>
                <div className="info-group">
                  <label>Yeni Şifre</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                </div>
                <div className="info-group">
                  <label>Şifre Tekrar</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                </div>
                <div className="button-group">
                  <button className="save-button" onClick={handleSaveProfile}>
                    Profili Kaydet
                  </button>
                  {formData.newPassword && (
                    <button className="update-button" onClick={handleUpdatePassword}>
                      Şifreyi Güncelle
                    </button>
                  )}
                </div>
              </>
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

export default ProfileInfo; 