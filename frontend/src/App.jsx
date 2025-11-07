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
      {/* Global top nav - só na landing */}
      {showHeader && (
        <header className="app-header">
          <nav className="app-nav">
            <div className="app-logo">
              <i className="fas fa-graduation-cap" />
              <span>Practika</span>
            </div>
            <div className="app-nav-buttons">
              <button onClick={() => setPage('backoffice')} className="app-nav-btn">
                BackOffice (Dev)
              </button>
              <button onClick={() => setPage('login')} className="app-nav-btn primary">
                Entrar
              </button>
              <button onClick={() => setPage('register')} className="app-nav-btn">
                Registar
              </button>
            </div>
          </nav>
        </header>
      )}

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

