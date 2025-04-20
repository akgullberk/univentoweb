import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import './styles.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      // Başarılı giriş sonrası ana sayfaya yönlendir
      navigate('/');
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Geçersiz e-posta adresi.');
          break;
        case 'auth/user-disabled':
          setError('Bu hesap devre dışı bırakılmış.');
          break;
        case 'auth/user-not-found':
          setError('Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.');
          break;
        case 'auth/wrong-password':
          setError('Hatalı şifre.');
          break;
        default:
          setError('Giriş yapılırken bir hata oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="top-banner">
        <div className="banner-content">
          <div className="banner-logo">UniVento</div>
          <div className="circle-element">
            <div className="auth-container">
              <span className="auth-button">Giriş Yap</span>
            </div>
            <div className="auth-container" onClick={handleRegisterClick}>
              <span className="auth-button">Üye Ol</span>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="login-form">
          <h2>UniVento Giriş Yap</h2>
          <label>E-posta</label>
          <input 
            type="email" 
            placeholder="E-posta" 
            className="login-input" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <label>Şifre</label>
          <input 
            type="password" 
            placeholder="Şifre" 
            className="login-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && <p className="error-message">{error}</p>}
          <button 
            className="login-button" 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>
        <div className="register-prompt">
          <p>Henüz bir hesabınız yok mu? <span className="register-link" onClick={handleRegisterClick}>Üye ol</span></p>
        </div>
      </div>
    </div>
  );
};

export default Login; 