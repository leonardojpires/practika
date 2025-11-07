import React, { useEffect, useState } from 'react'
import { useAuth } from './context/AuthContext'
import './styles/BackOffice.css'

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
  const { userData, user } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({ alunos: 0, professores: 0, empresas: 0, estagios: 0, ofertas: 0, candidaturas: 0 })
  
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

      const [alunosRes, professoresRes, empresasRes, estagiosRes, ofertasRes, candidaturasRes] = await Promise.all([
        fetch(`${API_URL}/alunos`, { headers }).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/professores`, { headers }).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/empresas`, { headers }).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/estagios`, { headers }).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/ofertas`, { headers }).then(r => r.json()).catch(() => []),
        fetch(`${API_URL}/candidaturas`, { headers }).then(r => r.json()).catch(() => []),
      ])

      setAlunos(alunosRes)
      setProfessores(professoresRes)
      setEmpresas(empresasRes)
      setEstagios(estagiosRes)
      setOfertas(ofertasRes)
      setCandidaturas(candidaturasRes)

      setStats({
        alunos: alunosRes.length,
        professores: professoresRes.length,
        empresas: empresasRes.length,
        estagios: estagiosRes.length,
        ofertas: ofertasRes.length,
        candidaturas: candidaturasRes.length
      })
    } catch (err) {
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
          <span>ISTEC BackOffice</span>
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
        
        <div className="backoffice-user">
          <div className="backoffice-user-info">
            <div className="backoffice-user-avatar">
              <i className="fas fa-user" />
            </div>
            <div className="backoffice-user-details">
              <h4>{userData?.nome || user?.email}</h4>
              <p>{userData?.role || 'Admin'}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="backoffice-main">
        <div className="backoffice-header">
          <h1>
            {activeTab === 'dashboard' && 'Painel de Controlo'}
            {activeTab === 'alunos' && 'Gestão de Alunos'}
            {activeTab === 'professores' && 'Gestão de Professores'}
            {activeTab === 'empresas' && 'Gestão de Empresas'}
            {activeTab === 'ofertas' && 'Gestão de Ofertas'}
            {activeTab === 'candidaturas' && 'Gestão de Candidaturas'}
            {activeTab === 'estagios' && 'Gestão de Estágios'}
          </h1>
          <p>Bem-vindo ao sistema de gestão de estágios</p>
        </div>

        {loading && <div className="loading">A carregar...</div>}
        {error && <div className="error-message">{error}</div>}

        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
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
                  <div className="backoffice-stat-icon amber">
                    <i className="fas fa-building" />
                  </div>
                </div>
                <div className="backoffice-stat-value">{stats.empresas}</div>
              </div>
              <div className="backoffice-stat-card">
                <div className="backoffice-stat-header">
                  <h3>Estágios</h3>
                  <div className="backoffice-stat-icon green">
                    <i className="fas fa-briefcase" />
                  </div>
                </div>
                <div className="backoffice-stat-value">{stats.estagios}</div>
              </div>
              <div className="backoffice-stat-card">
                <div className="backoffice-stat-header">
                  <h3>Ofertas</h3>
                  <div className="backoffice-stat-icon blue">
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
          </div>
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
                      <td>{aluno.competencias?.join(', ') || '—'}</td>
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
                    <th>Área</th>
                    <th>Duração</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {ofertas.map(oferta => (
                    <tr key={oferta._id}>
                      <td>{oferta.titulo}</td>
                      <td>{oferta.empresa?.nome || '—'}</td>
                      <td>{oferta.area_estagio}</td>
                      <td>{oferta.duracao_meses} meses</td>
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
                    <th>Área</th>
                    <th>Data Início</th>
                    <th>Data Fim</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {estagios.map(est => (
                    <tr key={est._id}>
                      <td>{est.aluno?.nome || '—'}</td>
                      <td>{est.professorOrientador?.nome || '—'}</td>
                      <td>{est.area_estagio}</td>
                      <td>{est.data_inicio ? new Date(est.data_inicio).toLocaleDateString() : '—'}</td>
                      <td>{est.data_fim ? new Date(est.data_fim).toLocaleDateString() : '—'}</td>
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
                  <input type="text" placeholder="Competências (separadas por vírgula)" value={formData.competencias?.join(', ') || ''} onChange={(e) => setFormData({ ...formData, competencias: e.target.value.split(',').map(s => s.trim()) })} />
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
                  <input type="text" placeholder="Área de Estágio" value={formData.area_estagio || ''} onChange={(e) => setFormData({ ...formData, area_estagio: e.target.value })} required />
                  <input type="number" placeholder="Duração (meses)" value={formData.duracao_meses || ''} onChange={(e) => setFormData({ ...formData, duracao_meses: parseInt(e.target.value) })} required />
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
                  <input type="text" placeholder="Área de Estágio" value={formData.area_estagio || ''} onChange={(e) => setFormData({ ...formData, area_estagio: e.target.value })} required />
                  <input type="date" placeholder="Data Início" value={formData.data_inicio || ''} onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })} required />
                  <input type="date" placeholder="Data Fim" value={formData.data_fim || ''} onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })} required />
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
