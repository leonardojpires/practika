import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/RoleHome.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function EmpresaHome() {
  const { user, userData } = useAuth();
  const [ofertas, setOfertas] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
  const [activeTab, setActiveTab] = useState('ofertas');
  const [loading, setLoading] = useState(false);
  const [showOfertaModal, setShowOfertaModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (!userData?.mongoId) {
        setLoading(false);
        return;
      }

      const token = user ? await user.getIdToken() : null;
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      // Buscar ofertas da empresa e candidaturas relacionadas
      const [ofertasRes, candidaturasRes] = await Promise.all([
        fetch(`${API_URL}/ofertas`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`${API_URL}/candidaturas/empresa/${userData.mongoId}`, { headers }).then(r => r.ok ? r.json() : [])
      ]);

      // Filtrar apenas ofertas desta empresa
      const minhasOfertas = Array.isArray(ofertasRes) 
        ? ofertasRes.filter(o => o.empresa?._id === userData?.mongoId || o.empresa === userData?.mongoId)
        : [];

      setOfertas(minhasOfertas);
      setCandidaturas(Array.isArray(candidaturasRes) ? candidaturasRes : []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOferta = async (e) => {
    e.preventDefault();
    try {
      if (!userData?.mongoId) {
        alert('Erro: Dados da empresa não carregados');
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/ofertas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          empresa: userData.mongoId
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao criar oferta');
      }
      
      alert('Oferta criada com sucesso!');
      setShowOfertaModal(false);
      setFormData({});
      fetchData();
    } catch (err) {
      console.error('Erro ao criar oferta:', err);
      alert(err.message);
    }
  };

  const handleUpdateCandidatura = async (candidaturaId, novoEstado) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/candidaturas/${candidaturaId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: novoEstado })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao atualizar candidatura');
      }
      
      const mensagem = novoEstado === 'ACEITE' ? 'aceite' : 'recusada';
      alert(`Candidatura ${mensagem} com sucesso!`);
      fetchData();
    } catch (err) {
      console.error('Erro ao atualizar candidatura:', err);
      alert(err.message);
    }
  };

  const handleToggleOfertaAtiva = async (ofertaId, ativaAtual) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/ofertas/${ofertaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ativa: !ativaAtual })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao atualizar oferta');
      }

      const novoEstado = !ativaAtual ? 'ativada' : 'desativada';
      alert(`Oferta ${novoEstado} com sucesso!`);
      fetchData();
    } catch (err) {
      console.error('Erro ao atualizar oferta:', err);
      alert(err.message);
    }
  };

  const handleApagarOferta = async (ofertaId) => {
    if (!confirm('Tens a certeza que queres apagar esta oferta? Todas as candidaturas associadas também serão removidas.')) {
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/ofertas/${ofertaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao apagar oferta');
      }

      alert('Oferta apagada com sucesso!');
      fetchData();
    } catch (err) {
      console.error('Erro ao apagar oferta:', err);
      alert(err.message);
    }
  };

  return (
    <div className="role-home">
      <div className="role-home-header">
        <div>
          <h1>Bem-vindo, {userData?.nome}!</h1>
          <p className="role-badge empresa">Empresa</p>
        </div>
      </div>

      <div className="role-home-tabs">
        <button 
          className={`tab-btn ${activeTab === 'ofertas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ofertas')}
        >
          <i className="fas fa-briefcase"></i> Minhas Ofertas
        </button>
        <button 
          className={`tab-btn ${activeTab === 'candidaturas' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidaturas')}
        >
          <i className="fas fa-users"></i> Candidaturas Recebidas
        </button>
      </div>

      <div className="role-home-content">
        {loading ? (
          <div className="loading">A carregar...</div>
        ) : (
          <>
            {activeTab === 'ofertas' && (
              <div>
                <div className="section-header">
                  <h2>Ofertas Publicadas</h2>
                  <button className="btn-create" onClick={() => setShowOfertaModal(true)}>
                    <i className="fas fa-plus"></i> Nova Oferta
                  </button>
                </div>
                <div className="ofertas-grid">
                  {ofertas.length === 0 ? (
                    <p className="empty-state">Ainda não publicou ofertas. Clique em "Nova Oferta" para começar.</p>
                  ) : (
                    ofertas.map(oferta => (
                      <div key={oferta._id} className="oferta-card empresa">
                        <div className="oferta-header">
                          <h3>{oferta.titulo}</h3>
                          <span className={`status-badge ${oferta.ativa ? 'ativa' : 'inativa'}`}>
                            <i className={`fas fa-${oferta.ativa ? 'check-circle' : 'times-circle'}`}></i>
                            {' '}{oferta.ativa ? 'Ativa' : 'Inativa'}
                          </span>
                        </div>
                        <div className="oferta-body">
                          <p className="oferta-description">{oferta.descricao || 'Sem descrição'}</p>
                          <div className="oferta-details">
                            <span><i className="fas fa-map-marker-alt"></i> {oferta.local || 'Remoto'}</span>
                            <span><i className="fas fa-clock"></i> {oferta.duracao || '6 meses'}</span>
                          </div>
                        </div>
                        <div className="oferta-stats">
                          <span className="stat">
                            <i className="fas fa-users"></i> {oferta.candidaturas?.length || 0} candidaturas
                          </span>
                        </div>
                        <div className="oferta-actions">
                          <button 
                            className={`btn-toggle ${oferta.ativa ? 'deactivate' : 'activate'}`}
                            onClick={() => handleToggleOfertaAtiva(oferta._id, oferta.ativa)}
                            title={oferta.ativa ? 'Desativar oferta' : 'Ativar oferta'}
                          >
                            <i className={`fas fa-${oferta.ativa ? 'eye-slash' : 'eye'}`}></i>
                            {oferta.ativa ? 'Desativar' : 'Ativar'}
                          </button>
                          <button 
                            className="btn-delete-oferta"
                            onClick={() => handleApagarOferta(oferta._id)}
                            title="Apagar oferta"
                          >
                            <i className="fas fa-trash"></i>
                            Apagar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'candidaturas' && (
              <div>
                <h2>Candidaturas Recebidas</h2>
                <div className="candidaturas-table">
                  {candidaturas.length === 0 ? (
                    <p className="empty-state">Ainda não recebeu candidaturas.</p>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Aluno</th>
                          <th>Oferta</th>
                          <th>Email</th>
                          <th>Estado</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidaturas.map(cand => (
                          <tr key={cand._id}>
                            <td>{cand.aluno?.nome || '—'}</td>
                            <td>{cand.ofertaEstagio?.titulo || '—'}</td>
                            <td>{cand.aluno?.email || '—'}</td>
                            <td>
                              <span className={`status-badge ${cand.estado.toLowerCase()}`}>
                                {cand.estado}
                              </span>
                            </td>
                            <td>
                              {cand.estado === 'PENDENTE' && (
                                <div className="action-buttons">
                                  <button 
                                    className="btn-accept"
                                    onClick={() => handleUpdateCandidatura(cand._id, 'ACEITE')}
                                  >
                                    <i className="fas fa-check"></i> Aceitar
                                  </button>
                                  <button 
                                    className="btn-reject"
                                    onClick={() => handleUpdateCandidatura(cand._id, 'RECUSADO')}
                                  >
                                    <i className="fas fa-times"></i> Recusar
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de criar oferta */}
      {showOfertaModal && (
        <div className="modal-overlay" onClick={() => setShowOfertaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nova Oferta de Estágio</h2>
              <button className="modal-close" onClick={() => setShowOfertaModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateOferta} className="modal-form">
              <label className="modal-label">
                Título
                <input
                  type="text"
                  value={formData.titulo || ''}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Estágio em Desenvolvimento Web"
                  required
                />
              </label>
              <label className="modal-label">
                Descrição
                <textarea
                  value={formData.descricao || ''}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva a oferta de estágio..."
                  rows="4"
                  required
                />
              </label>
              <label className="modal-label">
                Local
                <input
                  type="text"
                  value={formData.local || ''}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  placeholder="Ex: Lisboa, Remoto"
                />
              </label>
              <label className="modal-label">
                Duração
                <input
                  type="text"
                  value={formData.duracao || ''}
                  onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                  placeholder="Ex: 6 meses"
                />
              </label>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowOfertaModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  <i className="fas fa-plus"></i> Criar Oferta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
