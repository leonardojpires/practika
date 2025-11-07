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
    <div className="auth-root">
      {/* Left Side - Branding */}
      <div className="auth-branding">
        <div className="auth-brand-content">
          <div className="auth-brand-logo">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <h1 className="auth-brand-title">Practika</h1>
          <p className="auth-brand-subtitle">
            Cria a tua conta e começa a gerir os teus estágios de forma profissional
          </p>
          <div className="auth-brand-features">
            <div className="auth-brand-feature">
              <i className="fas fa-user-check"></i>
              <span>Registo rápido e seguro</span>
            </div>
            <div className="auth-brand-feature">
              <i className="fas fa-search"></i>
              <span>Acesso a ofertas de estágio</span>
            </div>
            <div className="auth-brand-feature">
              <i className="fas fa-users"></i>
              <span>Comunidade académica</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Criar Conta</h2>
            <p>Preenche os teus dados para começar</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <label className="auth-label">
              Nome
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
                placeholder="O teu nome completo"
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
              {loading ? 'A processar...' : 'Criar Conta'}
            </button>
          </form>

          <div className="auth-footer">
            Já tens conta?
            <button
              type="button"
              className="auth-link"
              onClick={() => onSwitchToLogin && onSwitchToLogin()}
            >
              Entra aqui
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
