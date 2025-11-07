import React, { useState } from 'react';
import '../styles/Auth.css';

export default function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email) return setError('Preencha o email.');
    if (!password) return setError('Preencha a palavra-passe.');

    setLoading(true);
    try {
      // Exemplo: substitui a URL pela tua API
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || 'Erro no login');
      }

      const data = await res.json();
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess(data);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Erro no login');
    }
  };

  return (
    <div className="auth-card">
      <h2>Entrar</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <label className="auth-label">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="exemplo@dominio.com"
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

        <div className="auth-footer">
          <button
            type="button"
            className="auth-link"
            onClick={() => onSwitchToRegister && onSwitchToRegister()}
          >
            Ainda não tens conta? Regista-te
          </button>
        </div>
      </form>
    </div>
  );
}
