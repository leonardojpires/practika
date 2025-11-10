import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/RoleHome.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function AlunoHome() {
  const { user, userData } = useAuth();
  const [ofertas, setOfertas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [candidaturas, setCandidaturas] = useState([]);
  const [activeTab, setActiveTab] = useState('ofertas');
  const [loading, setLoading] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
    fetchCandidaturas(); // Carregar candidaturas logo no início
  }, []);

  useEffect(() => {
    if (activeTab === 'minhas-candidaturas') {
      fetchCandidaturas();
    }
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = user ? await user.getIdToken() : null;
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const [ofertasRes, professoresRes] = await Promise.all([
        fetch(`${API_URL}/ofertas`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`${API_URL}/professores`, { headers }).then(r => r.ok ? r.json() : [])
      ]);

      // Filtrar apenas ofertas ativas para os alunos
      const ofertasAtivas = Array.isArray(ofertasRes) 
        ? ofertasRes.filter(o => o.ativa !== false)
        : [];

      setOfertas(ofertasAtivas);
      setProfessores(Array.isArray(professoresRes) ? professoresRes : []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidaturas = async () => {
    if (!userData?.mongoId) return;
    
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/candidaturas/aluno/${userData.mongoId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setCandidaturas(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Erro ao carregar candidaturas:', err);
    }
  };

  const handleCandidatar = async (ofertaId) => {
    try {
      if (!userData?.mongoId) {
        alert('Erro: Dados do utilizador não carregados. Por favor, recarregue a página.');
        return;
      }

      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/candidaturas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          aluno: userData.mongoId,
          ofertaEstagio: ofertaId,
          estado: 'PENDENTE'
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Erro na resposta:', errorData);
        throw new Error(errorData.error || errorData.message || 'Erro ao candidatar');
      }
      
      alert('Candidatura enviada com sucesso!');
      // Atualizar lista de candidaturas
      fetchCandidaturas();
    } catch (err) {
      console.error('Erro ao candidatar:', err);
      alert(err.message);
    }
  };

  const handleApagarCandidatura = async (candidaturaId) => {
    if (!confirm('Tens a certeza que queres apagar esta candidatura?')) {
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/candidaturas/${candidaturaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Erro ao apagar candidatura');
      }

      alert('Candidatura apagada com sucesso!');
      fetchCandidaturas(); // Recarregar lista
    } catch (err) {
      console.error('Erro ao apagar candidatura:', err);
      alert(err.message);
    }
  };

  const handleContactProfessor = (professor) => {
    setSelectedProfessor(professor);
    setShowMessageModal(true);
  };

  const handleSendMessage = () => {
    // Funcionalidade visual apenas
    alert(`Mensagem enviada para ${selectedProfessor.nome}:\n\n${message}`);
    setShowMessageModal(false);
    setMessage('');
    setSelectedProfessor(null);
  };

  return (
    <div className="role-home">
      <div className="role-home-header">
        <div>
          <h1>Bem-vindo, {userData?.nome}!</h1>
          <p className="role-badge">Aluno</p>
        </div>
      </div>

      <div className="role-home-tabs">
        <button 
          className={`tab-btn ${activeTab === 'ofertas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ofertas')}
        >
          <i className="fas fa-briefcase"></i> Ofertas de Estágio
        </button>
        <button 
          className={`tab-btn ${activeTab === 'professores' ? 'active' : ''}`}
          onClick={() => setActiveTab('professores')}
        >
          <i className="fas fa-chalkboard-teacher"></i> Professores
        </button>
        <button 
          className={`tab-btn ${activeTab === 'minhas-candidaturas' ? 'active' : ''}`}
          onClick={() => setActiveTab('minhas-candidaturas')}
        >
          <i className="fas fa-file-alt"></i> Minhas Candidaturas
        </button>
      </div>

      <div className="role-home-content">
        {loading ? (
          <div className="loading">A carregar...</div>
        ) : (
          <>
            {activeTab === 'ofertas' && (
              <div className="ofertas-grid">
                {ofertas.length === 0 ? (
                  <p className="empty-state">Nenhuma oferta disponível no momento.</p>
                ) : (
                  ofertas.map(oferta => {
                    const jaCandidatou = candidaturas.some(c => c.ofertaEstagio?._id === oferta._id || c.ofertaEstagio === oferta._id);
                    
                    return (
                      <div key={oferta._id} className="oferta-card">
                        <div className="oferta-header">
                          <h3>{oferta.titulo}</h3>
                          <span className="empresa-badge">
                            <i className="fas fa-building"></i> {oferta.empresa?.nome || 'Empresa'}
                          </span>
                        </div>
                        <div className="oferta-body">
                          <p className="oferta-description">{oferta.descricao || 'Sem descrição'}</p>
                          <div className="oferta-details">
                            <span><i className="fas fa-map-marker-alt"></i> {oferta.local || 'Remoto'}</span>
                            <span><i className="fas fa-clock"></i> {oferta.duracao || '6 meses'}</span>
                          </div>
                        </div>
                        <div className="oferta-footer">
                          <button 
                            className="btn-candidatar"
                            onClick={() => handleCandidatar(oferta._id)}
                            disabled={jaCandidatou}
                          >
                            <i className={jaCandidatou ? "fas fa-check" : "fas fa-paper-plane"}></i> 
                            {jaCandidatou ? 'Candidatura Enviada' : 'Candidatar-me'}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'professores' && (
              <div className="professores-grid">
                {professores.length === 0 ? (
                  <p className="empty-state">Nenhum professor disponível.</p>
                ) : (
                  professores.map(prof => (
                    <div key={prof._id} className="professor-card">
                      <div className="professor-avatar">
                        <i className="fas fa-user-tie"></i>
                      </div>
                      <div className="professor-info">
                        <h3>{prof.nome}</h3>
                        <p className="professor-dept">{prof.departamento}</p>
                        <p className="professor-email">
                          <i className="fas fa-envelope"></i> {prof.email}
                        </p>
                      </div>
                      <button 
                        className="btn-contact"
                        onClick={() => handleContactProfessor(prof)}
                      >
                        <i className="fas fa-comment-dots"></i> Contactar
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'minhas-candidaturas' && (
              <div className="candidaturas-list">
                {candidaturas.length === 0 ? (
                  <p className="empty-state">Ainda não tens candidaturas.</p>
                ) : (
                  candidaturas.map(candidatura => {
                    const oferta = candidatura.ofertaEstagio;
                    const estadoClass = candidatura.estado?.toLowerCase() || 'pendente';
                    
                    return (
                      <div key={candidatura._id} className="candidatura-card">
                        <div className="candidatura-header">
                          <h3>{oferta?.titulo || 'Oferta não disponível'}</h3>
                          <span className={`estado-badge ${estadoClass}`}>
                            {candidatura.estado === 'PENDENTE' && <i className="fas fa-clock"></i>}
                            {candidatura.estado === 'ACEITE' && <i className="fas fa-check-circle"></i>}
                            {candidatura.estado === 'RECUSADO' && <i className="fas fa-times-circle"></i>}
                            {' '}{candidatura.estado || 'PENDENTE'}
                          </span>
                        </div>
                        <div className="candidatura-body">
                          <p className="empresa-info">
                            <i className="fas fa-building"></i> 
                            <strong>Empresa:</strong> {oferta?.empresa?.nome || 'N/A'}
                          </p>
                          <p className="candidatura-info">
                            <i className="fas fa-calendar"></i> 
                            <strong>Data de candidatura:</strong> {new Date(candidatura.createdAt).toLocaleDateString('pt-PT')}
                          </p>
                          {oferta && (
                            <>
                              <p className="candidatura-info">
                                <i className="fas fa-map-marker-alt"></i> 
                                <strong>Local:</strong> {oferta.local || 'Remoto'}
                              </p>
                              <p className="candidatura-info">
                                <i className="fas fa-clock"></i> 
                                <strong>Duração:</strong> {oferta.duracao || '6 meses'}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="candidatura-footer">
                          <button 
                            className="btn-delete-candidatura"
                            onClick={() => handleApagarCandidatura(candidatura._id)}
                          >
                            <i className="fas fa-trash"></i> Apagar Candidatura
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de mensagem */}
      {showMessageModal && (
        <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contactar {selectedProfessor?.nome}</h2>
              <button className="modal-close" onClick={() => setShowMessageModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-info">
                Está a contactar o(a) Professor(a) {selectedProfessor?.nome} do departamento de {selectedProfessor?.departamento}.
              </p>
              <label className="modal-label">
                Mensagem
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Olá Professor(a), gostaria de questionar se estaria disponível para ser meu orientador de estágio..."
                  rows="6"
                  className="modal-textarea"
                />
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowMessageModal(false)}>
                Cancelar
              </button>
              <button className="btn-send" onClick={handleSendMessage} disabled={!message.trim()}>
                <i className="fas fa-paper-plane"></i> Enviar Mensagem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
