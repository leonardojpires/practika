import React, { useState } from 'react';
import '../styles/Auth.css';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name) return setError('Preenche o nome.');
    if (!email) return setError('Preenche o email.');
    if (!password) return setError('Preenche a palavra-passe.');
    if (password !== confirm) return setError('As palavras-passe não coincidem.');

    setLoading(true);
    try {
      // Exemplo: substitui a URL pela tua API
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.message || 'Erro no registo');
      }

      const data = await res.json();
      setLoading(false);
      if (onRegisterSuccess) onRegisterSuccess(data);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Erro no registo');
    }
  };

  return (
    <div className="auth-card">
      <h2>Registar</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <label className="auth-label">
          Nome
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input"
            placeholder="O teu nome"
            required
          />
        </label>

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

        <label className="auth-label">
          Confirma palavra-passe
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="auth-input"
            placeholder="Repete a palavra-passe"
            required
          />
        </label>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'A processar...' : 'Registar'}
        </button>

        <div className="auth-footer">
          <button
            type="button"
            className="auth-link"
            onClick={() => onSwitchToLogin && onSwitchToLogin()}
          >
            Já tens conta? Entrar
          </button>
        </div>
      </form>
    </div>
  );
}
