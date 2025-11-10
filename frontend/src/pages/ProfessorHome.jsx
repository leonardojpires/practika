import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/RoleHome.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function ProfessorHome() {
  const { user, userData } = useAuth();
  const [alunos, setAlunos] = useState([]);
  const [estagios, setEstagios] = useState([]);
  const [activeTab, setActiveTab] = useState('alunos');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = user ? await user.getIdToken() : null;
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [alunosRes, estagiosRes] = await Promise.all([
        fetch(`${API_URL}/alunos`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`${API_URL}/estagios`, { headers }).then(r => r.ok ? r.json() : [])
      ]);

      setAlunos(Array.isArray(alunosRes) ? alunosRes : []);
      
      // Filtrar apenas estágios onde este professor é orientador
      const meusEstagios = Array.isArray(estagiosRes)
        ? estagiosRes.filter(e => e.professorOrientador?._id === userData?.mongoId || e.professorOrientador === userData?.mongoId)
        : [];
      
      setEstagios(meusEstagios);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-home">
      <div className="role-home-header">
        <div>
          <h1>Bem-vindo, Prof. {userData?.nome}!</h1>
          <p className="role-badge professor">Professor</p>
          {userData?.departamento && (
            <p className="subtitle">{userData.departamento}</p>
          )}
        </div>
      </div>

      <div className="role-home-tabs">
        <button 
          className={`tab-btn ${activeTab === 'alunos' ? 'active' : ''}`}
          onClick={() => setActiveTab('alunos')}
        >
          <i className="fas fa-user-graduate"></i> Alunos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'estagios' ? 'active' : ''}`}
          onClick={() => setActiveTab('estagios')}
        >
          <i className="fas fa-briefcase"></i> Estágios Orientados
        </button>
        <button 
          className={`tab-btn ${activeTab === 'mensagens' ? 'active' : ''}`}
          onClick={() => setActiveTab('mensagens')}
        >
          <i className="fas fa-envelope"></i> Mensagens
        </button>
      </div>

      <div className="role-home-content">
        {loading ? (
          <div className="loading">A carregar...</div>
        ) : (
          <>
            {activeTab === 'alunos' && (
              <div>
                <h2>Lista de Alunos</h2>
                <div className="alunos-grid">
                  {alunos.length === 0 ? (
                    <p className="empty-state">Nenhum aluno registado.</p>
                  ) : (
                    alunos.map(aluno => (
                      <div key={aluno._id} className="aluno-card">
                        <div className="aluno-avatar">
                          <i className="fas fa-user-graduate"></i>
                        </div>
                        <div className="aluno-info">
                          <h3>{aluno.nome}</h3>
                          <p className="aluno-curso">{aluno.curso}</p>
                          <p className="aluno-email">
                            <i className="fas fa-envelope"></i> {aluno.email}
                          </p>
                          {aluno.competencias && (
                            <p className="aluno-competencias">
                              <i className="fas fa-code"></i> {aluno.competencias}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'estagios' && (
              <div>
                <h2>Estágios que Oriento</h2>
                <div className="estagios-table">
                  {estagios.length === 0 ? (
                    <p className="empty-state">Ainda não está a orientar estágios.</p>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Aluno</th>
                          <th>Empresa</th>
                          <th>Data Início</th>
                          <th>Data Fim</th>
                          <th>Estado</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estagios.map(est => (
                          <tr key={est._id}>
                            <td>{est.aluno?.nome || '—'}</td>
                            <td>{est.empresa?.nome || '—'}</td>
                            <td>{est.dataInicio ? new Date(est.dataInicio).toLocaleDateString() : '—'}</td>
                            <td>{est.dataFim ? new Date(est.dataFim).toLocaleDateString() : '—'}</td>
                            <td>
                              <span className={`status-badge ${est.estado === 'ATIVO' ? 'aceite' : 'pendente'}`}>
                                {est.estado}
                              </span>
                            </td>
                            <td>
                              <button className="btn-view">
                                <i className="fas fa-eye"></i> Ver Detalhes
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'mensagens' && (
              <div>
                <h2>Mensagens de Alunos</h2>
                <div className="mensagens-list">
                  <p className="empty-state">
                    <i className="fas fa-inbox" style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '1rem' }}></i>
                    <br />
                    Sistema de mensagens em desenvolvimento.
                    <br />
                    Aqui verá as mensagens enviadas pelos alunos.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
