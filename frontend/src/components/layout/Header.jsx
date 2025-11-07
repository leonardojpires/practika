import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../App.css';

export default function Header() {
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <header className="app-header">
      <nav className="app-nav">
        <div className="app-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <i className="fas fa-graduation-cap" />
          <span>Practika</span>
        </div>
        <div className="app-nav-buttons">
          {user ? (
            <>
              <button onClick={() => navigate('/')} className="app-nav-btn">
                Início
              </button>
              <div className="user-menu">
                <button 
                  className="user-menu-btn" 
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Olá, {userData?.nome || user.email}
                  <i className={`fas fa-chevron-${showDropdown ? 'up' : 'down'}`} style={{marginLeft: '0.5rem', fontSize: '0.75rem'}}></i>
                </button>
                {showDropdown && (
                  <div className="user-dropdown">
                    <button onClick={() => { navigate('/backoffice'); setShowDropdown(false); }} className="dropdown-item">
                      <i className="fas fa-cog"></i>
                      BackOffice
                    </button>
                    <button onClick={handleLogout} className="dropdown-item logout">
                      <i className="fas fa-sign-out-alt"></i>
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="app-nav-btn primary">
                Entrar
              </button>
              <button onClick={() => navigate('/register')} className="app-nav-btn">
                Registar
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
