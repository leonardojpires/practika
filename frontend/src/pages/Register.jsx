import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState(''); // Aluno, Professor, Empresa
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Campos específicos por role
  const [curso, setCurso] = useState(''); // Aluno
  const [departamento, setDepartamento] = useState(''); // Professor
  const [nif, setNif] = useState(''); // Empresa
  const [morada, setMorada] = useState(''); // Empresa
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!role) return setError('Selecione o tipo de utilizador.');
    if (!nome.trim()) return setError('Preencha o nome.');
    if (!email.trim()) return setError('Preencha o email.');
    if (!password) return setError('Preencha a palavra-passe.');

    // Validações específicas por role
    if (role === 'Aluno' && !curso.trim()) return setError('Preencha o curso.');
    if (role === 'Professor' && !departamento.trim()) return setError('Preencha o departamento.');
    if (role === 'Empresa' && !nif.trim()) return setError('Preencha o NIF.');

    setLoading(true);
    try {
      const data = { nome, email, password, role };
      
      // Adicionar campos específicos
      if (role === 'Aluno') {
        data.curso = curso;
      } else if (role === 'Professor') {
        data.departamento = departamento;
      } else if (role === 'Empresa') {
        data.nif = nif;
        if (morada.trim()) data.morada = morada;
      }

      await register(data);
      setLoading(false);
      navigate('/home');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Erro no registo');
    }
  };

  const getRoleBadgeColor = () => {
    switch(role) {
      case 'Aluno': return '#3498db';
      case 'Professor': return '#27ae60';
      case 'Empresa': return '#9b59b6';
      default: return '#95a5a6';
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
            {!role && 'Cria a tua conta e começa a gerir os teus estágios de forma profissional'}
            {role === 'Aluno' && 'Encontra o estágio perfeito e inicia a tua carreira profissional'}
            {role === 'Professor' && 'Orienta os teus alunos e acompanha o seu desenvolvimento'}
            {role === 'Empresa' && 'Publica ofertas de estágio e encontra os melhores talentos'}
          </p>
          <div className="auth-brand-features">
            <div className="auth-brand-feature">
              <i className="fas fa-user-check"></i>
              <span>Registo rápido e seguro</span>
            </div>
            <div className="auth-brand-feature">
              <i className={role === 'Aluno' ? 'fas fa-search' : role === 'Professor' ? 'fas fa-chalkboard-teacher' : role === 'Empresa' ? 'fas fa-briefcase' : 'fas fa-search'}></i>
              <span>
                {!role && 'Acesso a ofertas de estágio'}
                {role === 'Aluno' && 'Acesso a ofertas de estágio'}
                {role === 'Professor' && 'Gestão de orientações'}
                {role === 'Empresa' && 'Gestão de ofertas e candidaturas'}
              </span>
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
              Tipo de Utilizador
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="auth-input"
                required
                style={{ backgroundColor: role ? getRoleBadgeColor() + '15' : 'white' }}
              >
                <option value="">Selecione...</option>
                <option value="Aluno">👨‍🎓 Aluno</option>
                <option value="Professor">👨‍🏫 Professor</option>
                <option value="Empresa">🏢 Empresa</option>
              </select>
            </label>

            {role && (
              <>
                <label className="auth-label">
                  Nome {role === 'Empresa' ? 'da Empresa' : 'Completo'}
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="auth-input"
                    placeholder={role === 'Empresa' ? 'Nome da empresa' : 'O teu nome completo'}
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
                    placeholder={role === 'Empresa' ? 'contacto@empresa.pt' : 'exemplo@istec.pt'}
                    required
                  />
                </label>

                {role === 'Aluno' && (
                  <label className="auth-label">
                    Curso
                    <input
                      type="text"
                      value={curso}
                      onChange={(e) => setCurso(e.target.value)}
                      className="auth-input"
                      placeholder="Ex: Engenharia Informática"
                      required
                    />
                  </label>
                )}

                {role === 'Professor' && (
                  <label className="auth-label">
                    Departamento
                    <input
                      type="text"
                      value={departamento}
                      onChange={(e) => setDepartamento(e.target.value)}
                      className="auth-input"
                      placeholder="Ex: Departamento de Informática"
                      required
                    />
                  </label>
                )}

                {role === 'Empresa' && (
                  <>
                    <label className="auth-label">
                      NIF
                      <input
                        type="text"
                        value={nif}
                        onChange={(e) => setNif(e.target.value)}
                        className="auth-input"
                        placeholder="Número de Identificação Fiscal"
                        required
                      />
                    </label>

                    <label className="auth-label">
                      Morada (opcional)
                      <input
                        type="text"
                        value={morada}
                        onChange={(e) => setMorada(e.target.value)}
                        className="auth-input"
                        placeholder="Rua, Cidade, Código Postal"
                      />
                    </label>
                  </>
                )}

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
              </>
            )}

            <button type="submit" className="auth-button" disabled={loading || !role}>
              {loading ? 'A processar...' : role ? `Criar Conta como ${role}` : 'Selecione o tipo de utilizador'}
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
