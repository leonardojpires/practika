import React, { useState } from 'react'
import './App.css'
import Landing from './Landing'
import BackOffice from './BackOffice'
import Login from './components/Login'
import Register from './components/Register'
import { AuthProvider, useAuth } from './context/AuthContext'

function AuthShell() {
  const { user, userData, logout } = useAuth()
  const [page, setPage] = useState('landing') // 'landing' | 'backoffice'
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLoginSuccess = () => {
    setShowAuthModal(false)
    setPage('backoffice')
  }

  const handleRegisterSuccess = () => {
    setShowAuthModal(false)
    setPage('backoffice')
  }

  const openLogin = () => {
    setAuthMode('login')
    setShowAuthModal(true)
  }

  const openRegister = () => {
    setAuthMode('register')
    setShowAuthModal(true)
  }

  const handleLogout = async () => {
    await logout()
    setShowDropdown(false)
    setPage('landing')
  }

  return (
    <div className="app-container">
      {/* Global header */}
      <header className="app-header">
        <nav className="app-nav">
          <div className="app-logo">
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
                <button onClick={openLogin} className="app-nav-btn primary">
                  Entrar
                </button>
                <button onClick={openRegister} className="app-nav-btn">
                  Registar
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        {page === 'landing' && <Landing onNavigateToLogin={openLogin} onNavigateToRegister={openRegister} />}
        {page === 'backoffice' && <BackOffice />}
      </main>

      {/* Auth Modal */}
      {showAuthModal && !user && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="auth-modal-close" onClick={() => setShowAuthModal(false)}>×</button>
            {authMode === 'login' ? (
              <Login 
                onLoginSuccess={handleLoginSuccess} 
                onSwitchToRegister={() => setAuthMode('register')} 
              />
            ) : (
              <Register 
                onRegisterSuccess={handleRegisterSuccess} 
                onSwitchToLogin={() => setAuthMode('login')} 
              />
            )}
          </div>
        </div>
      )}
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

