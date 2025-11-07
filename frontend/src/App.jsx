import React, { useState } from 'react'
import './App.css'
import Landing from './Landing'
import BackOffice from './BackOffice'
import Login from './components/Login'
import Register from './components/Register'

export default function App() {
  const [page, setPage] = useState('landing') // 'landing' | 'login' | 'register' | 'backoffice'

  const handleLoginSuccess = () => {
    setPage('backoffice')
  }

  const handleSwitchToRegister = () => {
    setPage('register')
  }

  const handleSwitchToLogin = () => {
    setPage('login')
  }

  // Não mostrar header nas páginas de auth
  const showHeader = page !== 'login' && page !== 'register' && page !== 'backoffice'

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
        {page === 'landing' && <Landing onNavigateToLogin={() => setPage('login')} onNavigateToRegister={() => setPage('register')} />}
        {page === 'login' && <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={handleSwitchToRegister} />}
        {page === 'register' && <Register onRegisterSuccess={handleSwitchToLogin} onSwitchToLogin={handleSwitchToLogin} />}
        {page === 'backoffice' && <BackOffice />}
      </main>
    </div>
  )
}

