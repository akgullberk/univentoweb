import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import UserHeader from '../../components/UserHeader';
import './styles.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [presidentClub, setPresidentClub] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [eventForm, setEventForm] = useState({
    name: '',
    location: '',
    date_time: '',
    details: '',
    image_url: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
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
      formData.append('club_id', '67d1717b305efa4549b0eb97');
      formData.append('image', selectedImage);

      const response = await fetch('http://16.170.205.160/api/events', {
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
      
      setTimeout(() => {
        navigate('/profile/my-events');
      }, 2000);
    } catch (error) {
      setError('Etkinlik oluşturulurken bir hata oluştu: ' + error.message);
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
            <h2>Yeni Etkinlik Oluştur</h2>
            <button className="back-button" onClick={() => navigate('/profile')}>
              Geri Dön
            </button>
          </div>
          <form onSubmit={handleEventSubmit} className="event-form">
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
                type="datetime-local"
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
              <label>Etkinlik Resmi *</label>
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
            <button type="submit" className="submit-button">
              Etkinlik Oluştur
            </button>
          </form>
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

export default CreateEvent; 