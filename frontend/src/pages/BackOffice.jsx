import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/BackOffice.css'

const API_URL = import.meta.env.VITE_API_URL

function StatusBadge({ status }) {
  const statusMap = {
    'ACEITE': 'aceite',
    'PENDENTE': 'pendente',
    'RECUSADO': 'recusado'
  }
  return (
    <span className={`status-badge ${statusMap[status] || 'pendente'}`}>
      {status}
    </span>
  )
}

export default function BackOffice() {
  const navigate = useNavigate()
  const { userData, user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const  [stats, setStats] = useState({ alunos: 0, professores: 0, empresas: 0, estagios: 0, ofertas: 0, candidaturas: 0 })
  
  console.log('BackOffice render - activeTab:', activeTab, 'stats:', stats)
  
  const [alunos, setAlunos] = useState([])
  const [professores, setProfessores] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [estagios, setEstagios] = useState([])
  const [ofertas, setOfertas] = useState([])
  const [candidaturas, setCandidaturas] = useState([])
  
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = user ? await user.getIdToken() : null
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

      console.log('Fetching data from:', API_URL)
      console.log('Headers:', headers)

      const [alunosRes, professoresRes, empresasRes, estagiosRes, ofertasRes, candidaturasRes] = await Promise.all([
        fetch(`${API_URL}/alunos`, { headers }).then(async r => {
          if (!r.ok) {
            console.error('Alunos fetch failed:', r.status, r.statusText)
            return []
          }
          const data = await r.json()
          console.log('Alunos data:', data)
          return data
        }).catch(err => {
          console.error('Alunos error:', err)
          return []
        }),
        fetch(`${API_URL}/professores`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${API_URL}/empresas`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${API_URL}/estagios`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${API_URL}/ofertas`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
        fetch(`${API_URL}/candidaturas`, { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
      ])

      setAlunos(Array.isArray(alunosRes) ? alunosRes : [])
      setProfessores(Array.isArray(professoresRes) ? professoresRes : [])
      setEmpresas(Array.isArray(empresasRes) ? empresasRes : [])
      setEstagios(Array.isArray(estagiosRes) ? estagiosRes : [])
      setOfertas(Array.isArray(ofertasRes) ? ofertasRes : [])
      setCandidaturas(Array.isArray(candidaturasRes) ? candidaturasRes : [])

      setStats({
        alunos: Array.isArray(alunosRes) ? alunosRes.length : 0,
        professores: Array.isArray(professoresRes) ? professoresRes.length : 0,
        empresas: Array.isArray(empresasRes) ? empresasRes.length : 0,
        estagios: Array.isArray(estagiosRes) ? estagiosRes.length : 0,
        ofertas: Array.isArray(ofertasRes) ? ofertasRes.length : 0,
        candidaturas: Array.isArray(candidaturasRes) ? candidaturasRes.length : 0
      })
    } catch (err) {
      console.error('FetchData error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreate = (type) => {
    setModalType(type)
    setEditingItem(null)
    setFormData({})
    setShowModal(true)
  }

  const handleEdit = (type, item) => {
    setModalType(type)
    setEditingItem(item)
    setFormData(item)
    setShowModal(true)
  }

  const handleDelete = async (type, id) => {
    if (!confirm('Tem a certeza que deseja eliminar?')) return
    
    try {
      const token = user ? await user.getIdToken() : null
      const res = await fetch(`${API_URL}/${type}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!res.ok) throw new Error('Erro ao eliminar')
      
      alert('Eliminado com sucesso!')
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = user ? await user.getIdToken() : null
      const url = editingItem 
        ? `${API_URL}/${modalType}/${editingItem._id}`
        : `${API_URL}/${modalType}`
      
      const method = editingItem ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao guardar')
      }

      alert(editingItem ? 'Atualizado com sucesso!' : 'Criado com sucesso!')
      setShowModal(false)
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleValidateEmpresa = async (id) => {
    try {
      const token = user ? await user.getIdToken() : null
      const res = await fetch(`${API_URL}/empresas/${id}/validar`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (!res.ok) throw new Error('Erro ao validar')
      
      alert('Empresa validada!')
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdateCandidatura = async (id, estado) => {
    try {
      const token = user ? await user.getIdToken() : null
      const res = await fetch(`${API_URL}/candidaturas/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado })
      })
      
      if (!res.ok) throw new Error('Erro ao atualizar')
      
      alert('Candidatura atualizada!')
      fetchData()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="backoffice">
      <aside className="backoffice-sidebar">
        <div className="backoffice-logo">
          <i className="fas fa-graduation-cap" />
          <span>Practika BackOffice</span>
        </div>
        <ul className="backoffice-menu">
          <li className={`backoffice-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
            <a href="#" onClick={() => setActiveTab('dashboard')}>
              <i className="fas fa-chart-line" /> <span>Dashboard</span>
            </a>
          </li>
          <li className={`backoffice-menu-item ${activeTab === 'alunos' ? 'active' : ''}`}>
            <a href="#" onClick={() => setActiveTab('alunos')}>
              <i className="fas fa-user-graduate" /> <span>Alunos</span>
            </a>
          </li>
          <li className={`backoffice-menu-item ${activeTab === 'professores' ? 'active' : ''}`}>
            <a href="#" onClick={() => setActiveTab('professores')}>
              <i className="fas fa-chalkboard-teacher" /> <span>Professores</span>
            </a>
          </li>
          <li className={`backoffice-menu-item ${activeTab === 'empresas' ? 'active' : ''}`}>
            <a href="#" onClick={() => setActiveTab('empresas')}>
              <i className="fas fa-building" /> <span>Empresas</span>
            </a>
          </li>
          <li className={`backoffice-menu-item ${activeTab === 'ofertas' ? 'active' : ''}`}>
            <a href="#" onClick={() => setActiveTab('ofertas')}>
              <i className="fas fa-file-alt" /> <span>Ofertas</span>
            </a>
          </li>
          <li className={`backoffice-menu-item ${activeTab === 'candidaturas' ? 'active' : ''}`}>
            <a href="#" onClick={() => setActiveTab('candidaturas')}>
              <i className="fas fa-hand-paper" /> <span>Candidaturas</span>
            </a>
          </li>
          <li className={`backoffice-menu-item ${activeTab === 'estagios' ? 'active' : ''}`}>
            <a href="#" onClick={() => setActiveTab('estagios')}>
              <i className="fas fa-briefcase" /> <span>Estágios</span>
            </a>
          </li>
        </ul>
      </aside>

      <main className="backoffice-main">
        {/* Topbar */}
        <div className="backoffice-topbar">
          <div className="backoffice-topbar-left">
            <h1>Painel de Controlo</h1>
          </div>
          <div className="backoffice-topbar-right">
            <button className="backoffice-nav-btn" onClick={() => navigate('/')} title="Voltar ao Início">
              <i className="fas fa-home"></i>
              <span>Início</span>
            </button>
            <button className="backoffice-notification-btn">
              <i className="fas fa-bell" />
              <span className="backoffice-notification-badge">3</span>
            </button>
            <div className="backoffice-user-menu">
              <div className="backoffice-user-avatar">
                <i className="fas fa-user" />
              </div>
              <div className="backoffice-user-details">
                <span className="backoffice-user-name">{userData?.nome || 'Utilizador'}</span>
                <span className="backoffice-user-role">{userData?.role || 'Admin'}</span>
              </div>
              <button className="backoffice-user-dropdown" onClick={async () => { await logout(); navigate('/'); }} title="Sair">
                <i className="fas fa-sign-out-alt" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="backoffice-content">
          {activeTab === 'dashboard' && (
            <>
              <p className="backoffice-welcome">Bem-vindo ao sistema de gestão de estágios</p>

              {/* Stats Grid */}
              <div className="backoffice-stats">
                <div className="backoffice-stat-card">
                  <div className="backoffice-stat-header">
                    <h3>Alunos</h3>
                    <div className="backoffice-stat-icon blue">
                      <i className="fas fa-user-graduate" />
                    </div>
                  </div>
                  <div className="backoffice-stat-value">{stats.alunos}</div>
                </div>
                <div className="backoffice-stat-card">
                  <div className="backoffice-stat-header">
                    <h3>Professores</h3>
                    <div className="backoffice-stat-icon green">
                      <i className="fas fa-chalkboard-teacher" />
                    </div>
                  </div>
                  <div className="backoffice-stat-value">{stats.professores}</div>
                </div>
                <div className="backoffice-stat-card">
                  <div className="backoffice-stat-header">
                    <h3>Empresas</h3>
                    <div className="backoffice-stat-icon purple">
                      <i className="fas fa-building" />
                    </div>
                  </div>
                  <div className="backoffice-stat-value">{stats.empresas}</div>
                </div>
                <div className="backoffice-stat-card">
                  <div className="backoffice-stat-header">
                    <h3>Estágios</h3>
                    <div className="backoffice-stat-icon teal">
                      <i className="fas fa-briefcase" />
                    </div>
                  </div>
                  <div className="backoffice-stat-value">{stats.estagios}</div>
                </div>
                <div className="backoffice-stat-card">
                  <div className="backoffice-stat-header">
                    <h3>Ofertas</h3>
                    <div className="backoffice-stat-icon orange">
                      <i className="fas fa-file-alt" />
                    </div>
                  </div>
                  <div className="backoffice-stat-value">{stats.ofertas}</div>
                </div>
                <div className="backoffice-stat-card">
                  <div className="backoffice-stat-header">
                    <h3>Candidaturas</h3>
                    <div className="backoffice-stat-icon amber">
                      <i className="fas fa-hand-paper" />
                    </div>
                  </div>
                  <div className="backoffice-stat-value">{stats.candidaturas}</div>
                </div>
              </div>
            </>
          )}

        {activeTab === 'alunos' && (
          <div className="backoffice-section">
            <div className="backoffice-section-header">
              <h2>Alunos</h2>
              <button className="backoffice-add-btn" onClick={() => handleCreate('alunos')}>
                <i className="fas fa-plus" /> Novo Aluno
              </button>
            </div>
            <div className="backoffice-table-container">
              {alunos.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                  <i className="fas fa-users" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                  <p>Nenhum aluno encontrado. Clique em "Novo Aluno" para adicionar.</p>
                </div>
              ) : (
                <table className="backoffice-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Curso</th>
                      <th>Competências</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunos.map(aluno => (
                      <tr key={aluno._id}>
                        <td>{aluno.nome}</td>
                        <td>{aluno.email}</td>
                        <td>{aluno.curso}</td>
                        <td>{aluno.competencias || '—'}</td>
                        <td>
                          <button className="btn-action edit" onClick={() => handleEdit('alunos', aluno)}>
                            <i className="fas fa-edit" />
                          </button>
                          <button className="btn-action delete" onClick={() => handleDelete('alunos', aluno._id)}>
                            <i className="fas fa-trash" />
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

        {activeTab === 'professores' && (
          <div className="backoffice-section">
            <div className="backoffice-section-header">
              <h2>Professores</h2>
              <button className="backoffice-add-btn" onClick={() => handleCreate('professores')}>
                <i className="fas fa-plus" /> Novo Professor
              </button>
            </div>
            <div className="backoffice-table-container">
              <table className="backoffice-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Departamento</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {professores.map(prof => (
                    <tr key={prof._id}>
                      <td>{prof.nome}</td>
                      <td>{prof.email}</td>
                      <td>{prof.departamento}</td>
                      <td>
                        <button className="btn-action edit" onClick={() => handleEdit('professores', prof)}>
                          <i className="fas fa-edit" />
                        </button>
                        <button className="btn-action delete" onClick={() => handleDelete('professores', prof._id)}>
                          <i className="fas fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'empresas' && (
          <div className="backoffice-section">
            <div className="backoffice-section-header">
              <h2>Empresas</h2>
              <button className="backoffice-add-btn" onClick={() => handleCreate('empresas')}>
                <i className="fas fa-plus" /> Nova Empresa
              </button>
            </div>
            <div className="backoffice-table-container">
              <table className="backoffice-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>NIF</th>
                    <th>Validada</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {empresas.map(emp => (
                    <tr key={emp._id}>
                      <td>{emp.nome}</td>
                      <td>{emp.email}</td>
                      <td>{emp.nif}</td>
                      <td>
                        {emp.validada ? (
                          <span className="status-badge aceite">Sim</span>
                        ) : (
                          <button className="btn-action validate" onClick={() => handleValidateEmpresa(emp._id)}>
                            Validar
                          </button>
                        )}
                      </td>
                      <td>
                        <button className="btn-action edit" onClick={() => handleEdit('empresas', emp)}>
                          <i className="fas fa-edit" />
                        </button>
                        <button className="btn-action delete" onClick={() => handleDelete('empresas', emp._id)}>
                          <i className="fas fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ofertas' && (
          <div className="backoffice-section">
            <div className="backoffice-section-header">
              <h2>Ofertas de Estágio</h2>
              <button className="backoffice-add-btn" onClick={() => handleCreate('ofertas')}>
                <i className="fas fa-plus" /> Nova Oferta
              </button>
            </div>
            <div className="backoffice-table-container">
              <table className="backoffice-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Empresa</th>
                    <th>Local</th>
                    <th>Duração</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ofertas.map(oferta => (
                    <tr key={oferta._id}>
                      <td>{oferta.titulo}</td>
                      <td>{oferta.empresa?.nome || '—'}</td>
                      <td>{oferta.local || '—'}</td>
                      <td>{oferta.duracao || '—'}</td>
                      <td>
                        <button className="btn-action edit" onClick={() => handleEdit('ofertas', oferta)}>
                          <i className="fas fa-edit" />
                        </button>
                        <button className="btn-action delete" onClick={() => handleDelete('ofertas', oferta._id)}>
                          <i className="fas fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'candidaturas' && (
          <div className="backoffice-section">
            <div className="backoffice-section-header">
              <h2>Candidaturas</h2>
              <button className="backoffice-add-btn" onClick={() => handleCreate('candidaturas')}>
                <i className="fas fa-plus" /> Nova Candidatura
              </button>
            </div>
            <div className="backoffice-table-container">
              <table className="backoffice-table">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Oferta</th>
                    <th>Empresa</th>
                    <th>Estado</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {candidaturas.map(cand => (
                    <tr key={cand._id}>
                      <td>{cand.aluno?.nome || '—'}</td>
                      <td>{cand.ofertaEstagio?.titulo || '—'}</td>
                      <td>{cand.ofertaEstagio?.empresa?.nome || '—'}</td>
                      <td><StatusBadge status={cand.estado} /></td>
                      <td>
                        <select 
                          value={cand.estado} 
                          onChange={(e) => handleUpdateCandidatura(cand._id, e.target.value)}
                          className="select-estado"
                        >
                          <option value="PENDENTE">Pendente</option>
                          <option value="ACEITE">Aceite</option>
                          <option value="RECUSADO">Recusado</option>
                        </select>
                        <button className="btn-action delete" onClick={() => handleDelete('candidaturas', cand._id)}>
                          <i className="fas fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'estagios' && (
          <div className="backoffice-section">
            <div className="backoffice-section-header">
              <h2>Estágios</h2>
              <button className="backoffice-add-btn" onClick={() => handleCreate('estagios')}>
                <i className="fas fa-plus" /> Novo Estágio
              </button>
            </div>
            <div className="backoffice-table-container">
              <table className="backoffice-table">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Professor Orientador</th>
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
                      <td>{est.professorOrientador?.nome || '—'}</td>
                      <td>{est.dataInicio ? new Date(est.dataInicio).toLocaleDateString() : '—'}</td>
                      <td>{est.dataFim ? new Date(est.dataFim).toLocaleDateString() : '—'}</td>
                      <td><span className={`status-badge ${est.estado === 'ATIVO' ? 'aceite' : 'pendente'}`}>{est.estado}</span></td>
                      <td>
                        <button className="btn-action edit" onClick={() => handleEdit('estagios', est)}>
                          <i className="fas fa-edit" />
                        </button>
                        <button className="btn-action delete" onClick={() => handleDelete('estagios', est._id)}>
                          <i className="fas fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Editar' : 'Criar'} {modalType}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              {modalType === 'alunos' && (
                <>
                  <input type="text" placeholder="Nome" value={formData.nome || ''} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
                  <input type="email" placeholder="Email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  <input type="text" placeholder="Curso" value={formData.curso || ''} onChange={(e) => setFormData({ ...formData, curso: e.target.value })} required />
                  <input type="text" placeholder="Competências (ex: JavaScript, React, Node.js)" value={formData.competencias || ''} onChange={(e) => setFormData({ ...formData, competencias: e.target.value })} />
                </>
              )}
              {modalType === 'professores' && (
                <>
                  <input type="text" placeholder="Nome" value={formData.nome || ''} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
                  <input type="email" placeholder="Email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  <input type="text" placeholder="Departamento" value={formData.departamento || ''} onChange={(e) => setFormData({ ...formData, departamento: e.target.value })} required />
                </>
              )}
              {modalType === 'empresas' && (
                <>
                  <input type="text" placeholder="Nome" value={formData.nome || ''} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} required />
                  <input type="email" placeholder="Email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  <input type="text" placeholder="NIF" value={formData.nif || ''} onChange={(e) => setFormData({ ...formData, nif: e.target.value })} required />
                </>
              )}
              {modalType === 'ofertas' && (
                <>
                  <input type="text" placeholder="Título" value={formData.titulo || ''} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} required />
                  <select value={formData.empresa || ''} onChange={(e) => setFormData({ ...formData, empresa: e.target.value })} required>
                    <option value="">Selecionar Empresa</option>
                    {empresas.map(emp => (<option key={emp._id} value={emp._id}>{emp.nome}</option>))}
                  </select>
                  <input type="text" placeholder="Local" value={formData.local || ''} onChange={(e) => setFormData({ ...formData, local: e.target.value })} />
                  <input type="text" placeholder="Duração (ex: 6 meses)" value={formData.duracao || ''} onChange={(e) => setFormData({ ...formData, duracao: e.target.value })} />
                  <textarea placeholder="Descrição" value={formData.descricao || ''} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} rows="4" />
                </>
              )}
              {modalType === 'candidaturas' && (
                <>
                  <select value={formData.aluno || ''} onChange={(e) => setFormData({ ...formData, aluno: e.target.value })} required>
                    <option value="">Selecionar Aluno</option>
                    {alunos.map(al => (<option key={al._id} value={al._id}>{al.nome}</option>))}
                  </select>
                  <select value={formData.ofertaEstagio || ''} onChange={(e) => setFormData({ ...formData, ofertaEstagio: e.target.value })} required>
                    <option value="">Selecionar Oferta</option>
                    {ofertas.map(of => (<option key={of._id} value={of._id}>{of.titulo}</option>))}
                  </select>
                </>
              )}
              {modalType === 'estagios' && (
                <>
                  <select value={formData.aluno || ''} onChange={(e) => setFormData({ ...formData, aluno: e.target.value })} required>
                    <option value="">Selecionar Aluno</option>
                    {alunos.map(al => (<option key={al._id} value={al._id}>{al.nome}</option>))}
                  </select>
                  <select value={formData.professorOrientador || ''} onChange={(e) => setFormData({ ...formData, professorOrientador: e.target.value })} required>
                    <option value="">Selecionar Professor Orientador</option>
                    {professores.map(prof => (<option key={prof._id} value={prof._id}>{prof.nome}</option>))}
                  </select>
                  <input type="date" placeholder="Data Início" value={formData.dataInicio || ''} onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })} required />
                  <input type="date" placeholder="Data Fim" value={formData.dataFim || ''} onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })} />
                </>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">{editingItem ? 'Guardar' : 'Criar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
