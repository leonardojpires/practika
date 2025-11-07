import React, { useState } from 'react'
import './App.css'
import Landing from './Landing'
import BackOffice from './BackOffice'
import Login from './components/Login'
import Register from './components/Register'
import { AuthProvider, useAuth } from './context/AuthContext'

function AuthShell() {
  const { user, userData, logout } = useAuth()
  const [page, setPage] = useState('landing') // 'landing' | 'backoffice' | 'login' | 'register'
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLoginSuccess = () => {
    setPage('backoffice')
  }

  const handleRegisterSuccess = () => {
    setPage('backoffice')
  }

  const handleLogout = async () => {
    await logout()
    setShowDropdown(false)
    setPage('landing')
  }

  return (
    <div className="app-container">
      {/* Global header - só na landing */}
      {page === 'landing' && (
        <header className="app-header">
          <nav className="app-nav">
            <div className="app-logo" onClick={() => setPage('landing')} style={{ cursor: 'pointer' }}>
              <i className="fas fa-graduation-cap" />
              <span>Practika</span>
            </div>
            <div className="app-nav-buttons">
              {user ? (
                <>
                  <button onClick={() => setPage('landing')} className={`app-nav-btn ${page === 'landing' ? 'active' : ''}`}>
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
                        <button onClick={() => { setPage('backoffice'); setShowDropdown(false); }} className="dropdown-item">
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
                  <button onClick={() => setPage('login')} className="app-nav-btn primary">
                    Entrar
                  </button>
                  <button onClick={() => setPage('register')} className="app-nav-btn">
                    Registar
                  </button>
                </>
              )}
            </div>
          </nav>
        </header>
      )}

      <main>
        {page === 'landing' && <Landing onNavigateToLogin={() => setPage('login')} onNavigateToRegister={() => setPage('register')} />}
        {page === 'login' && (
          <div className="auth-page">
            <Login 
              onLoginSuccess={handleLoginSuccess} 
              onSwitchToRegister={() => setPage('register')} 
            />
          </div>
        )}
        {page === 'register' && (
          <div className="auth-page">
            <Register 
              onRegisterSuccess={handleRegisterSuccess} 
              onSwitchToLogin={() => setPage('login')} 
            />
          </div>
        )}
        {page === 'backoffice' && <BackOffice onNavigateHome={() => setPage('landing')} onLogout={handleLogout} />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AuthShell />
    </AuthProvider>
  )
}

