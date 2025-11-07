import React, { useState } from 'react';
import '../styles/Auth.css';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [curso, setCurso] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

  if (!name) return setError('Preenche o nome.');
  if (!email) return setError('Preenche o email.');
  if (!password) return setError('Preenche a palavra-passe.');
  if (password !== confirm) return setError('As palavras-passe não coincidem.');
  if (!curso) return setError('Preenche o curso.');

    setLoading(true);
    try {
      // Usa o endpoint correto do backend
      const dados = { nome: name, email, password, role: 'Aluno', curso };
      console.log('Dados enviados para registo:', dados);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
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
          Curso
          <input
            value={curso}
            onChange={(e) => setCurso(e.target.value)}
            className="auth-input"
            placeholder="O teu curso"
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
