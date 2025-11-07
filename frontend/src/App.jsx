import React, { useState } from 'react'
import Landing from './Landing'
import BackOffice from './BackOffice'

export default function App() {
  const [page, setPage] = useState('landing') // 'landing' | 'backoffice'

  return (
    <div className="min-h-screen bg-white">
      {/* Global top nav to switch pages */}
      <header className="w-full bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-graduation-cap text-xl text-indigo-600" />
            <span className="font-bold">ISTEC</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPage('landing')} className={`px-3 py-1 rounded ${page === 'landing' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
              Landing
            </button>
            <button onClick={() => setPage('backoffice')} className={`px-3 py-1 rounded ${page === 'backoffice' ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
              BackOffice
            </button>
          </div>
        </div>
      </header>

      <main>
        {page === 'landing' ? <Landing /> : <BackOffice />}
      </main>
    </div>
  )
}

