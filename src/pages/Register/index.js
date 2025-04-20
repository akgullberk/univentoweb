import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import './styles.css';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      return;
    }

    try {
      setLoading(true);
      setError('');
      console.log('Kayıt denemesi:', email, password); // Hata ayıklama için
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Kullanıcı başarıyla oluşturuldu:', userCredential.user); // Başarılı kayıt kontrolü
      
      // Başarılı kayıt sonrası ana sayfaya yönlendir
      navigate('/');
    } catch (error) {
      console.error('Firebase hatası:', error.code, error.message); // Hata detayını görmek için
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Bu e-posta adresi zaten kullanımda.');
          break;
        case 'auth/invalid-email':
          setError('Geçersiz e-posta adresi.');
          break;
        case 'auth/weak-password':
          setError('Şifre en az 6 karakter olmalıdır.');
          break;
        case 'auth/operation-not-allowed':
          setError('E-posta/şifre girişi etkin değil.');
          break;
        default:
          setError(`Kayıt olurken bir hata oluştu: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="top-banner">
        <div className="banner-content">
          <div className="banner-logo">UniVento</div>
          <div className="circle-element">
            <div className="auth-container" onClick={handleLoginClick}>
              <span className="auth-button">Giriş Yap</span>
            </div>
            <div className="auth-container">
              <span className="auth-button">Üye Ol</span>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="register-form">
          <h2>UniVento Üye Ol</h2>
          <label>Ad ve Soyad</label>
          <input 
            type="text" 
            placeholder="Ad ve Soyad" 
            className="register-input" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          <label>E-posta</label>
          <input 
            type="email" 
            placeholder="E-posta" 
            className="register-input" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <label>Şifre</label>
          <input 
            type="password" 
            placeholder="Şifre" 
            className="register-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <label>Şifre Tekrarı</label>
          <input 
            type="password" 
            placeholder="Şifre Tekrarı" 
            className="register-input" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          {error && <p className="error-message">{error}</p>}
          <button 
            className="register-button" 
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </div>
        <div className="login-prompt">
          <p>Zaten bir hesabınız var mı? <span className="login-link" onClick={handleLoginClick}>Giriş yap</span></p>
        </div>
      </div>
    </div>
  );
};

export default Register; 