import React from "react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fas fa-graduation-cap text-2xl text-indigo-600" aria-hidden></i>
            <span className="font-bold text-lg">ISTEC Estágios</span>
          </div>
          <ul className="hidden md:flex items-center gap-8 text-sm text-slate-700">
            <li><a href="#home" className="hover:text-indigo-600">Início</a></li>
            <li><a href="#features" className="hover:text-indigo-600">Funcionalidades</a></li>
            <li><a href="#roles" className="hover:text-indigo-600">Áreas</a></li>
            <li><a href="#contact" className="hover:text-indigo-600">Contacto</a></li>
          </ul>
          <a href="#login" className="hidden md:inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700">Entrar</a>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section id="home" className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-20">
          <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden>
            {/* decorative svg */}
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <path fill="rgba(255,255,255,0.08)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>

          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-extrabold flex items-center justify-center gap-3"><i className="fas fa-graduation-cap text-3xl"></i>Gestor de Estágios ISTEC</h1>
              <p className="mt-4 text-lg md:text-xl text-white/90">A plataforma que conecta alunos, empresas e professores orientadores num único sistema integrado de gestão de estágios curriculares e profissionais.</p>
              <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <a href="#register" className="btn bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow hover:translate-y-[-3px] transition-transform">Registar Agora</a>
                <a href="#features" className="btn border border-white/30 text-white px-6 py-3 rounded-lg">Saber Mais</a>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-slate-900">Funcionalidades Principais</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="feature-card bg-white p-6 rounded-2xl shadow">
                <div className="feature-icon text-indigo-600 text-3xl"><i className="fas fa-building" /></div>
                <h3 className="mt-4 font-semibold text-indigo-600">Gestão de Ofertas</h3>
                <p className="mt-2 text-slate-600">Empresas podem criar e gerir ofertas de estágio de forma simples e eficiente.</p>
              </div>
              <div className="feature-card bg-white p-6 rounded-2xl shadow">
                <div className="feature-icon text-indigo-600 text-3xl"><i className="fas fa-user-graduate" /></div>
                <h3 className="mt-4 font-semibold text-indigo-600">Candidaturas Online</h3>
                <p className="mt-2 text-slate-600">Alunos podem candidatar-se facilmente e acompanhar o estado das suas candidaturas.</p>
              </div>
              <div className="feature-card bg-white p-6 rounded-2xl shadow">
                <div className="feature-icon text-indigo-600 text-3xl"><i className="fas fa-chalkboard-teacher" /></div>
                <h3 className="mt-4 font-semibold text-indigo-600">Acompanhamento</h3>
                <p className="mt-2 text-slate-600">Professores podem monitorizar o progresso dos seus alunos e comunicar com empresas.</p>
              </div>
              <div className="feature-card bg-white p-6 rounded-2xl shadow">
                <div className="feature-icon text-indigo-600 text-3xl"><i className="fas fa-chart-line" /></div>
                <h3 className="mt-4 font-semibold text-indigo-600">Relatórios & Analytics</h3>
                <p className="mt-2 text-slate-600">Relatórios e estatísticas para melhor gestão e tomada de decisões estratégicas.</p>
              </div>
              <div className="feature-card bg-white p-6 rounded-2xl shadow">
                <div className="feature-icon text-indigo-600 text-3xl"><i className="fas fa-lock" /></div>
                <h3 className="mt-4 font-semibold text-indigo-600">Autenticação Segura</h3>
                <p className="mt-2 text-slate-600">Integração com credenciais institucionais para máxima segurança.</p>
              </div>
              <div className="feature-card bg-white p-6 rounded-2xl shadow">
                <div className="feature-icon text-indigo-600 text-3xl"><i className="fas fa-comments" /></div>
                <h3 className="mt-4 font-semibold text-indigo-600">Comunicação Direta</h3>
                <p className="mt-2 text-slate-600">Mensagens integradas para facilitar a comunicação entre todas as partes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center">Áreas de Acesso</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-4">
              <div className="role-card rounded-2xl p-6 text-white" style={{background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)'}}>
                <h3 className="text-2xl font-semibold flex items-center gap-3"><i className="fas fa-briefcase" /> Empresas</h3>
                <ul className="mt-4 space-y-2 list-none">
                  <li>Registo e validação</li>
                  <li>Criar ofertas de estágio</li>
                  <li>Gerir candidaturas</li>
                </ul>
              </div>
              <div className="role-card rounded-2xl p-6 text-white" style={{background: 'linear-gradient(135deg,#f093fb 0%,#f5576c 100%)'}}>
                <h3 className="text-2xl font-semibold flex items-center gap-3"><i className="fas fa-user-graduate" /> Alunos</h3>
                <ul className="mt-4 space-y-2 list-none">
                  <li>Autenticação @istec.pt</li>
                  <li>Criar perfil profissional</li>
                  <li>Pesquisar estágios</li>
                </ul>
              </div>
              <div className="role-card rounded-2xl p-6 text-white" style={{background: 'linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)'}}>
                <h3 className="text-2xl font-semibold flex items-center gap-3"><i className="fas fa-chalkboard-teacher" /> Professores</h3>
                <ul className="mt-4 space-y-2 list-none">
                  <li>Consultar alunos orientados</li>
                  <li>Acompanhar atividades</li>
                  <li>Submeter relatórios</li>
                </ul>
              </div>
              <div className="role-card rounded-2xl p-6 text-white" style={{background: 'linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)'}}>
                <h3 className="text-2xl font-semibold flex items-center gap-3"><i className="fas fa-cogs" /> Coordenação</h3>
                <ul className="mt-4 space-y-2 list-none">
                  <li>Validar empresas</li>
                  <li>Atribuir orientadores</li>
                  <li>Exportar relatórios</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-slate-800 text-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <h3 className="text-4xl font-bold text-green-400">500+</h3>
                <p className="mt-2">Alunos Registados</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-green-400">150+</h3>
                <p className="mt-2">Empresas Parceiras</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-green-400">300+</h3>
                <p className="mt-2">Estágios Realizados</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-green-400">95%</h3>
                <p className="mt-2">Taxa de Colocação</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold">Pronto para começar?</h2>
            <p className="mt-3 text-lg">Junte-se à plataforma que está a transformar a gestão de estágios no ISTEC</p>
            <div className="mt-6 flex justify-center gap-4">
              <a href="#register-student" className="btn bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold">Sou Aluno</a>
              <a href="#register-company" className="btn border border-white/30 text-white px-6 py-3 rounded-lg">Sou Empresa</a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-slate-900 text-white py-12">
          <div className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-indigo-400 font-semibold">Sobre</h3>
              <p className="mt-3 text-slate-300">Plataforma de gestão integrada de estágios curriculares e profissionais do ISTEC.</p>
            </div>
            <div>
              <h3 className="text-indigo-400 font-semibold">Links Rápidos</h3>
              <ul className="mt-3 space-y-2">
                <li><a href="#home" className="text-slate-300 hover:text-white">Início</a></li>
                <li><a href="#features" className="text-slate-300 hover:text-white">Funcionalidades</a></li>
                <li><a href="#roles" className="text-slate-300 hover:text-white">Áreas</a></li>
                <li><a href="#contact" className="text-slate-300 hover:text-white">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-indigo-400 font-semibold">Suporte</h3>
              <ul className="mt-3 space-y-2">
                <li><a href="#faq" className="text-slate-300 hover:text-white">FAQ</a></li>
                <li><a href="#help" className="text-slate-300 hover:text-white">Ajuda</a></li>
                <li><a href="#terms" className="text-slate-300 hover:text-white">Termos de Uso</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-indigo-400 font-semibold">Contacto</h3>
              <p className="mt-3 text-slate-300"><i className="fas fa-envelope mr-2" /> estagios@istec.pt</p>
              <p className="mt-2 text-slate-300"><i className="fas fa-phone mr-2" /> +351 220 100 200</p>
              <p className="mt-2 text-slate-300"><i className="fas fa-map-marker-alt mr-2" /> Porto, Portugal</p>
            </div>
          </div>
          <div className="mt-8 text-center text-slate-400">© {new Date().getFullYear()} ISTEC - Gestor de Estágios. Todos os direitos reservados.</div>
        </footer>
      </main>
    </div>
  );
}
