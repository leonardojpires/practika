import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) return setError('Preencha o email.');
    if (!password) return setError('Preencha a palavra-passe.');

    setLoading(true);
    try {
      // Usa o login do AuthContext (Firebase)
      await login(email, password);
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Erro no login');
    }
  };

  return (
    <div className="auth-root">
      {/* Left Side - Branding */}
      <div className="auth-branding">
        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h1 className="auth-brand-title">Practika</h1>
          <p className="auth-brand-subtitle">
            Plataforma integrada de gestão de estágios curriculares e profissionais
          </p>
          <div className="auth-brand-features">
            <div className="auth-brand-feature">
              <i className="fas fa-shield-alt"></i>
              <span>Autenticação segura</span>
            </div>
            <div className="auth-brand-feature">
              <i className="fas fa-briefcase"></i>
              <span>Gestão de estágios</span>
            </div>
            <div className="auth-brand-feature">
              <i className="fas fa-chart-line"></i>
              <span>Acompanhamento em tempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Bem-vindo de volta</h2>
            <p>Inicie sessão para aceder à sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <label className="auth-label">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="exemplo@istec.pt"
                required
              />
            </label>

            <label className="auth-label">
              Palavra-passe
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="••••••••"
                required
              />
            </label>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'A processar...' : 'Entrar'}
            </button>

            <button 
              type="button" 
              className="auth-link-button"
              onClick={async()=>{
                if(!email){ setError('Introduz o email para recuperar a palavra-passe.'); return; }
                try{ 
                  await resetPassword(email); 
                  setError(null); 
                  alert('Enviámos um email para repor a palavra-passe.'); 
                }
                catch(e){ 
                  setError(e.message || 'Não foi possível enviar o email de reposição.'); 
                }
              }}
            >
              Esqueceste a palavra‑passe?
            </button>
          </form>

          <div className="auth-footer">
            Ainda não tens conta?
            <button
              type="button"
              className="auth-link"
              onClick={() => onSwitchToRegister && onSwitchToRegister()}
            >
              Regista-te aqui
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
