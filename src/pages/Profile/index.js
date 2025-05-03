import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { updatePassword } from 'firebase/auth';
import UserHeader from '../../components/UserHeader';
import './styles.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [presidentClub, setPresidentClub] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [eventForm, setEventForm] = useState({
    name: '',
    location: '',
    date_time: '',
    details: '',
    image_url: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [joinedClubs] = useState([
    { name: 'Yazılım Kulübü', joinDate: '2024-01-15' },
    { name: 'Tiyatro Kulübü', joinDate: '2024-02-20' },
    // Bu kısım gerçek verilerle değiştirilecek
  ]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/');
        return;
      }
      setUser(currentUser);

      const role = localStorage.getItem('userRole');
      setUserRole(role || 'user');
      
      if (role === 'president') {
        const clubData = JSON.parse(localStorage.getItem('presidentClub'));
        setPresidentClub(clubData);
      }

      // Kullanıcı adı ve soyadını localStorage'dan al
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

  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // Ad ve soyadı localStorage'a kaydet
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!eventForm.name || !eventForm.location || !eventForm.date_time || !eventForm.details) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    if (!selectedImage) {
      setError('Lütfen bir etkinlik resmi seçin.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', eventForm.name);
      formData.append('location', eventForm.location);
      formData.append('date_time', eventForm.date_time);
      formData.append('details', eventForm.details);
      formData.append('club_id', presidentClub?.id || null);
      formData.append('image', selectedImage);

      const response = await fetch('http://127.0.0.1:8000/api/events', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Etkinlik oluşturulurken bir hata oluştu');
      }

      setSuccess('Etkinlik başarıyla oluşturuldu!');
      setEventForm({
        name: '',
        location: '',
        date_time: '',
        details: '',
        image_url: ''
      });
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      setError('Etkinlik oluşturulurken bir hata oluştu: ' + error.message);
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
        {userRole === 'president' && presidentClub ? (
          <>
            <div className="profile-card">
              <h2>Profil Bilgileri</h2>
              <div className="profile-info">
                <div className="info-group">
                  <label>E-posta</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-group">
                  <label>Kulüp</label>
                  <p>{presidentClub.name}</p>
                </div>
                <div className="info-group">
                  <label>Rol</label>
                  <p>Kulüp Başkanı</p>
                </div>
                <div className="info-group">
                  <label>Website</label>
                  <a href={presidentClub.website} target="_blank" rel="noopener noreferrer">
                    {presidentClub.website}
                  </a>
                </div>
              </div>
            </div>

            <div className="event-form-card">
              <h2>Yeni Etkinlik Oluştur</h2>
              <form onSubmit={handleEventSubmit}>
                <div className="form-group">
                  <label>Etkinlik Adı *</label>
                  <input
                    type="text"
                    name="name"
                    value={eventForm.name}
                    onChange={handleEventInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Konum *</label>
                  <input
                    type="text"
                    name="location"
                    value={eventForm.location}
                    onChange={handleEventInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tarih ve Saat *</label>
                  <input
                    type="text"
                    name="date_time"
                    value={eventForm.date_time}
                    onChange={handleEventInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Detaylar *</label>
                  <textarea
                    name="details"
                    value={eventForm.details}
                    onChange={handleEventInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Etkinlik Resmi</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="image-input"
                      id="event-image"
                    />
                    <label htmlFor="event-image" className="image-upload-label">
                      {imagePreview ? 'Resmi Değiştir' : 'Resim Seç'}
                    </label>
                    {imagePreview && (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Önizleme" />
                      </div>
                    )}
                  </div>
                </div>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <button type="submit" className="submit-button">Etkinlik Oluştur</button>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="profile-card">
              <div className="card-header">
                <h2>Profil Bilgileri</h2>
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
                  <p>{user.email}</p>
                </div>
                {isEditing && (
                  <button className="save-button" onClick={handleSaveProfile}>
                    Kaydet
                  </button>
                )}
              </div>
            </div>

            <div className="profile-card">
              <h2>Şifre Güncelle</h2>
              <div className="profile-info">
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
                  <label>Yeni Şifre Tekrar</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="profile-input"
                  />
                </div>
                <button className="update-button" onClick={handleUpdatePassword}>
                  Şifreyi Güncelle
                </button>
              </div>
            </div>

            <div className="profile-card">
              <h2>Üye Olduğum Kulüpler</h2>
              <div className="clubs-list">
                {joinedClubs.map((club, index) => (
                  <div key={index} className="club-item">
                    <span className="club-name">{club.name}</span>
                    <span className="join-date">Katılım: {new Date(club.joinDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {(error || success) && (
          <div className={`alert ${error ? 'alert-error' : 'alert-success'}`}>
            {error || success}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 