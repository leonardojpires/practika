import React, { useEffect, useState } from 'react'

const initialStats = [
  { label: 'Empresas Ativas', value: '150', icon: 'fa-building' },
  { label: 'Alunos Registados', value: '500', icon: 'fa-user-graduate' },
  { label: 'Estágios Ativos', value: '320', icon: 'fa-briefcase' },
  { label: 'Taxa de Colocação', value: '95%', icon: 'fa-chart-pie' },
]

const initialRecent = [
  { student: 'Joana Silva', company: 'INOVA Tech', area: 'Desenvolvimento Web', status: 'ativo' },
  { student: 'Ricardo Costa', company: 'SoftVision', area: 'Design UI/UX', status: 'pendente' },
  { student: 'Marta Lopes', company: 'DataCore', area: 'Data Science', status: 'ativo' },
  { student: 'Pedro Alves', company: 'NextCloud', area: 'Infraestrutura', status: 'cancelado' },
]

function StatusBadge({ status }) {
  const map = {
    ativo: 'bg-emerald-100 text-emerald-800',
    pendente: 'bg-amber-100 text-amber-800',
    cancelado: 'bg-rose-100 text-rose-800',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-semibold ${map[status] || 'bg-slate-100 text-slate-800'}`}>
      {status === 'ativo' ? 'Ativo' : status === 'pendente' ? 'Pendente' : 'Cancelado'}
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
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 flex flex-col">
        <div className="logo text-xl font-bold text-indigo-600 flex items-center gap-2 mb-6">
          <i className="fas fa-graduation-cap" />
          <span>ISTEC BackOffice</span>
        </div>
        <ul className="flex-1 space-y-2">
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-600 text-white font-medium" href="#">
              <i className="fas fa-chart-line" /> <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100" href="#">
              <i className="fas fa-users" /> <span>Utilizadores</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100" href="#">
              <i className="fas fa-briefcase" /> <span>Ofertas</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100" href="#">
              <i className="fas fa-file-alt" /> <span>Relatórios</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100" href="#">
              <i className="fas fa-envelope" /> <span>Mensagens</span>
            </a>
          </li>
          <li>
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100" href="#">
              <i className="fas fa-cog" /> <span>Definições</span>
            </a>
          </li>
        </ul>
        <div className="mt-4 text-sm text-slate-500">v1.0</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="topbar bg-white shadow-sm sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-3 py-2">
              <i className="fas fa-search text-slate-500" />
              <input className="bg-transparent outline-none text-sm" placeholder="Pesquisar..." />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <i className="fas fa-bell text-slate-500" />
            <div className="flex items-center gap-3">
              <img src="https://i.pravatar.cc/100" alt="user" className="w-10 h-10 rounded-full" />
              <span className="font-semibold text-indigo-700">Coordenação</span>
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <section className="dashboard p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold text-indigo-800 mb-6">Painel de Controlo</h1>

          {/* Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="card bg-white p-4 rounded-xl shadow flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-600">{s.value}</h3>
                  <p className="text-sm text-slate-500">{s.label}</p>
                </div>
                <i className={`fas ${s.icon} text-2xl text-emerald-500`} />
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="table-section bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold text-indigo-800 mb-4">Estágios Recentes</h2>
            <div className="overflow-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-sm text-slate-600 text-left">
                    <th className="px-4 py-2">Aluno</th>
                    <th className="px-4 py-2">Empresa</th>
                    <th className="px-4 py-2">Área</th>
                    <th className="px-4 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInternships.map((row) => (
                    <tr key={row.student} className="hover:bg-slate-50">
                      <td className="px-4 py-3">{row.student}</td>
                      <td className="px-4 py-3">{row.company}</td>
                      <td className="px-4 py-3">{row.area}</td>
                      <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer className="bg-white text-slate-500 text-center py-4 border-t">© {new Date().getFullYear()} ISTEC - BackOffice Estágios. Todos os direitos reservados.</footer>
      </main>
    </div>
  )
}
