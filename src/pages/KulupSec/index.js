import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import './styles.css';

const KulupSec = () => {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('http://16.170.205.160/clubs');
        const data = await response.json();
        setClubs(data);
        setFilteredClubs(data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    fetchClubs();
  }, []);

  useEffect(() => {
    const filtered = clubs.filter(club => 
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (club.category && club.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (club.advisor && club.advisor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (club.president && club.president.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredClubs(filtered);
  }, [searchTerm, clubs]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleCardClick = (clubId) => {
    navigate(`/club/${clubId}`);
  };

  return (
    <div className="kulup-container">
      <div className="left-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: 'white', textAlign: "left", fontSize: "2.5rem", margin: 0 }}>UniVento</h1>
        </div>
        <div className="kulup-search-container">
          <input 
            type="text" 
            className="kulup-search-input"
            placeholder="Kulüp Ara"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="search-icon">
            <FaSearch style={{ color: 'gray', fontSize: '1.5rem' }} />
          </div>
        </div>
        <h2 style={{ color: 'white', marginTop: '60px', textAlign: "left", fontSize: "3rem" }}>Kulüp Seç</h2>
        <h2 style={{ color: 'white', marginTop: '20px', textAlign: "left", fontSize: "2.6rem", maxWidth: '530px', fontWeight: "bold" }}>
          Üniversitenizdeki tüm etkinlikler  bir tık uzağında!
        </h2>
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <button 
            onClick={handleClose} 
            style={{ 
              padding: '15px 30px',
              borderRadius: '35px', 
              border: 'none', 
              backgroundColor: 'white', 
              color: 'black',
              fontSize: '1.5rem',
              cursor: 'pointer', 
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Kapat
          </button>
        </div>
      </div>
      <div className="right-panel">
        <div className="kulup-content">
          <div className="card-container">
            {filteredClubs.map((club) => (
              <div key={club._id || club.id} className="card" onClick={() => handleCardClick(club._id || club.id)}>
                <img src={club.logo_url} alt={club.name} className="card-logo" />
                <div className="card-name">{club.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KulupSec; 