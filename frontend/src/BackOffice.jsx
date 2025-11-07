import React, { useEffect, useState } from 'react'
import './styles/BackOffice.css'

const initialStats = [
  { label: 'Empresas Ativas', value: '150', icon: 'fa-building', change: '+12%', positive: true, color: 'blue' },
  { label: 'Alunos Registados', value: '500', icon: 'fa-user-graduate', change: '+23%', positive: true, color: 'green' },
  { label: 'Estágios Ativos', value: '320', icon: 'fa-briefcase', change: '+8%', positive: true, color: 'amber' },
  { label: 'Taxa de Colocação', value: '95%', icon: 'fa-chart-pie', change: '+5%', positive: true, color: 'green' },
]

const initialRecent = [
  { student: 'Joana Silva', company: 'INOVA Tech', area: 'Desenvolvimento Web', status: 'ativo' },
  { student: 'Ricardo Costa', company: 'SoftVision', area: 'Design UI/UX', status: 'pendente' },
  { student: 'Marta Lopes', company: 'DataCore', area: 'Data Science', status: 'ativo' },
  { student: 'Pedro Alves', company: 'NextCloud', area: 'Infraestrutura', status: 'cancelado' },
]

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status}`}>
      {status === 'ativo' ? 'Ativo' : status === 'pendente' ? 'Pendente' : status === 'concluido' ? 'Concluído' : 'Cancelado'}
    </span>
  )
}

export default function BackOffice() {
  const [stats, setStats] = useState(initialStats)
  const [recentInternships, setRecentInternships] = useState(initialRecent)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const results = await Promise.allSettled([
          fetch('http://localhost:5000/api/alunos'),
          fetch('http://localhost:5000/api/empresas'),
          fetch('http://localhost:5000/api/estagios')
        ])

        if (!mounted) return

        const [alunosRes, empresasRes, estagiosRes] = results

        let alunos = []
        let empresas = []
        let estagios = []

        if (alunosRes.status === 'fulfilled' && alunosRes.value.ok) alunos = await alunosRes.value.json()
        if (empresasRes.status === 'fulfilled' && empresasRes.value.ok) empresas = await empresasRes.value.json()
        if (estagiosRes.status === 'fulfilled' && estagiosRes.value.ok) estagios = await estagiosRes.value.json()

        // update stats counts if data is available
        setStats(prev => prev.map(s => {
          if (s.label.includes('Empresas')) return { ...s, value: empresas.length ?? s.value }
          if (s.label.includes('Alunos')) return { ...s, value: alunos.length ?? s.value }
          if (s.label.includes('Estágios')) return { ...s, value: estagios.length ?? s.value }
          return s
        }))

        if (estagios && estagios.length) {
          setRecentInternships(estagios.slice(0, 10).map(e => ({
            student: e.alunoNome || e.student || e.nome || '—',
            company: e.empresaNome || e.company || e.companyName || '—',
            area: e.area || e.area_estagio || '—',
            status: e.status || 'pendente'
          })))
        }
      } catch (err) {
        // ignore network errors — keep initial data
        console.warn('BackOffice load failed', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="backoffice">
      {/* Sidebar */}
      <aside className="backoffice-sidebar">
        <div className="backoffice-logo">
          <i className="fas fa-graduation-cap" />
          <span>ISTEC BackOffice</span>
        </div>
        <ul className="backoffice-menu">
          <li className="backoffice-menu-item active">
            <a href="#">
              <i className="fas fa-chart-line" /> <span>Dashboard</span>
            </a>
          </li>
          <li className="backoffice-menu-item">
            <a href="#">
              <i className="fas fa-users" /> <span>Utilizadores</span>
            </a>
          </li>
          <li className="backoffice-menu-item">
            <a href="#">
              <i className="fas fa-briefcase" /> <span>Ofertas</span>
            </a>
          </li>
          <li className="backoffice-menu-item">
            <a href="#">
              <i className="fas fa-file-alt" /> <span>Relatórios</span>
            </a>
          </li>
          <li className="backoffice-menu-item">
            <a href="#">
              <i className="fas fa-envelope" /> <span>Mensagens</span>
            </a>
          </li>
          <li className="backoffice-menu-item">
            <a href="#">
              <i className="fas fa-cog" /> <span>Definições</span>
            </a>
          </li>
        </ul>
        
        <div className="backoffice-user">
          <div className="backoffice-user-info">
            <div className="backoffice-user-avatar">
              <i className="fas fa-user" />
            </div>
            <div className="backoffice-user-details">
              <h4>Coordenação</h4>
              <p>Admin</p>
            </div>
          </div>
          <button className="backoffice-logout-btn">
            <i className="fas fa-sign-out-alt" /> Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="backoffice-main">
        {/* Header */}
        <div className="backoffice-header">
          <h1>Painel de Controlo</h1>
          <p>Bem-vindo ao sistema de gestão de estágios</p>
        </div>

        {/* Stats Grid */}
        <div className="backoffice-stats">
          {stats.map((s) => (
            <div key={s.label} className="backoffice-stat-card">
              <div className="backoffice-stat-header">
                <h3>{s.label}</h3>
                <div className={`backoffice-stat-icon ${s.color}`}>
                  <i className={`fas ${s.icon}`} />
                </div>
              </div>
              <div className="backoffice-stat-value">{s.value}</div>
              <div className={`backoffice-stat-change ${s.positive ? 'positive' : 'negative'}`}>
                <i className={`fas fa-arrow-${s.positive ? 'up' : 'down'}`} />
                <span>{s.change} vs mês anterior</span>
              </div>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="backoffice-section">
          <div className="backoffice-section-header">
            <h2>Estágios Recentes</h2>
            <div className="backoffice-table-actions">
              <input 
                type="text" 
                className="backoffice-search" 
                placeholder="Pesquisar..." 
              />
              <button className="backoffice-filter-btn">
                <i className="fas fa-filter" />
                <span>Filtros</span>
              </button>
              <button className="backoffice-add-btn">
                <i className="fas fa-plus" />
                <span>Novo Estágio</span>
              </button>
            </div>
          </div>
          
          <div className="backoffice-table-container">
            <table className="backoffice-table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Empresa</th>
                  <th>Área</th>
                  <th>Estado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {recentInternships.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.student}</td>
                    <td>{row.company}</td>
                    <td>{row.area}</td>
                    <td><StatusBadge status={row.status} /></td>
                    <td>
                      <div className="backoffice-action-btns">
                        <button className="backoffice-action-btn edit" title="Editar">
                          <i className="fas fa-edit" />
                        </button>
                        <button className="backoffice-action-btn delete" title="Eliminar">
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
