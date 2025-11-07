import React from "react";
import './styles/Landing.css';

export default function Landing({ onNavigateToLogin, onNavigateToRegister }) {
  return (
    <div className="landing-page">
      <main>
        {/* Hero */}
        <section id="home" className="landing-hero">
          <div className="landing-hero-content">
            <h1><i className="fas fa-graduation-cap"></i>Gestor de Estágios ISTEC</h1>
            <p>A plataforma que conecta alunos, empresas e professores orientadores num único sistema integrado de gestão de estágios curriculares e profissionais.</p>
            <div className="landing-hero-buttons">
              <button onClick={onNavigateToRegister} className="landing-btn landing-btn-primary">Registar Agora</button>
              <a href="#features" className="landing-btn landing-btn-secondary">Saber Mais</a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="landing-features">
          <div className="landing-container">
            <h2 className="landing-section-title">Funcionalidades Principais</h2>
            <div className="landing-features-grid">
              <div className="landing-feature-card">
                <div className="landing-feature-icon"><i className="fas fa-building" /></div>
                <h3>Gestão de Ofertas</h3>
                <p>Empresas podem criar e gerir ofertas de estágio de forma simples e eficiente.</p>
              </div>
              <div className="landing-feature-card">
                <div className="landing-feature-icon"><i className="fas fa-user-graduate" /></div>
                <h3>Candidaturas Online</h3>
                <p>Alunos podem candidatar-se facilmente e acompanhar o estado das suas candidaturas.</p>
              </div>
              <div className="landing-feature-card">
                <div className="landing-feature-icon"><i className="fas fa-chalkboard-teacher" /></div>
                <h3>Acompanhamento</h3>
                <p>Professores podem monitorizar o progresso dos seus alunos e comunicar com empresas.</p>
              </div>
              <div className="landing-feature-card">
                <div className="landing-feature-icon"><i className="fas fa-chart-line" /></div>
                <h3>Relatórios & Analytics</h3>
                <p>Relatórios e estatísticas para melhor gestão e tomada de decisões estratégicas.</p>
              </div>
              <div className="landing-feature-card">
                <div className="landing-feature-icon"><i className="fas fa-lock" /></div>
                <h3>Autenticação Segura</h3>
                <p>Integração com credenciais institucionais para máxima segurança.</p>
              </div>
              <div className="landing-feature-card">
                <div className="landing-feature-icon"><i className="fas fa-comments" /></div>
                <h3>Comunicação Direta</h3>
                <p>Mensagens integradas para facilitar a comunicação entre todas as partes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="landing-roles">
          <div className="landing-container">
            <h2 className="landing-section-title">Áreas de Acesso</h2>
            <div className="landing-roles-grid">
              <div className="landing-role-card">
                <h3><i className="fas fa-briefcase" /> Empresas</h3>
                <ul>
                  <li>Registo e validação</li>
                  <li>Criar ofertas de estágio</li>
                  <li>Gerir candidaturas</li>
                </ul>
              </div>
              <div className="landing-role-card">
                <h3><i className="fas fa-user-graduate" /> Alunos</h3>
                <ul>
                  <li>Autenticação @istec.pt</li>
                  <li>Criar perfil profissional</li>
                  <li>Pesquisar estágios</li>
                </ul>
              </div>
              <div className="landing-role-card">
                <h3><i className="fas fa-chalkboard-teacher" /> Professores</h3>
                <ul>
                  <li>Consultar alunos orientados</li>
                  <li>Acompanhar atividades</li>
                  <li>Submeter relatórios</li>
                </ul>
              </div>
              <div className="landing-role-card">
                <h3><i className="fas fa-cogs" /> Coordenação</h3>
                <ul>
                  <li>Validar empresas</li>
                  <li>Atribuir orientadores</li>
                  <li>Exportar relatórios</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="landing-stats">
          <div className="landing-container">
            <div className="landing-stats-grid">
              <div className="landing-stat-item">
                <h3>500+</h3>
                <p>Alunos Registados</p>
              </div>
              <div className="landing-stat-item">
                <h3>150+</h3>
                <p>Empresas Parceiras</p>
              </div>
              <div className="landing-stat-item">
                <h3>300+</h3>
                <p>Estágios Realizados</p>
              </div>
              <div className="landing-stat-item">
                <h3>95%</h3>
                <p>Taxa de Colocação</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="landing-cta">
          <div className="landing-container">
            <h2>Pronto para começar?</h2>
            <p>Junte-se à plataforma que está a transformar a gestão de estágios no ISTEC</p>
            <div className="landing-hero-buttons">
              <button onClick={onNavigateToRegister} className="landing-btn landing-btn-primary">Sou Aluno</button>
              <button onClick={onNavigateToRegister} className="landing-btn landing-btn-secondary">Sou Empresa</button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="landing-footer">
          <div className="landing-footer-content">
            <div className="landing-footer-section">
              <h3>Sobre</h3>
              <p>Plataforma de gestão integrada de estágios curriculares e profissionais do ISTEC.</p>
            </div>
            <div className="landing-footer-section">
              <h3>Links Rápidos</h3>
              <ul>
                <li><a href="#home">Início</a></li>
                <li><a href="#features">Funcionalidades</a></li>
                <li><a href="#roles">Áreas</a></li>
                <li><a href="#contact">Contacto</a></li>
              </ul>
            </div>
            <div className="landing-footer-section">
              <h3>Suporte</h3>
              <ul>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="#help">Ajuda</a></li>
                <li><a href="#terms">Termos de Uso</a></li>
              </ul>
            </div>
            <div className="landing-footer-section">
              <h3>Contacto</h3>
              <p><i className="fas fa-envelope" /> estagios@istec.pt</p>
              <p><i className="fas fa-phone" /> +351 220 100 200</p>
              <p><i className="fas fa-map-marker-alt" /> Porto, Portugal</p>
            </div>
          </div>
          <div className="landing-footer-bottom">
            © {new Date().getFullYear()} ISTEC - Gestor de Estágios. Todos os direitos reservados.
          </div>
        </footer>
      </main>
    </div>
  );
}
