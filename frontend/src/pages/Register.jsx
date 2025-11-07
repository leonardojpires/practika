import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [curso, setCurso] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { registerAluno } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nome.trim()) return setError('Preencha o nome.');
    if (!email.trim()) return setError('Preencha o email.');
    if (!curso.trim()) return setError('Preencha o curso.');
    if (!password) return setError('Preencha a palavra-passe.');

    setLoading(true);
    try {
      await registerAluno({ nome, email, password, curso });
      setLoading(false);
      navigate('/backoffice');
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
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="auth-input"
                placeholder="O teu nome completo"
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
              Curso
              <input
                type="text"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                className="auth-input"
                placeholder="Engenharia Informática"
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
              {loading ? 'A processar...' : 'Criar Conta'}
            </button>
          </form>

          <div className="auth-footer">
            Já tens conta?
            <button
              type="button"
              className="auth-link"
              onClick={() => navigate('/login')}
            >
              Entra aqui
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
