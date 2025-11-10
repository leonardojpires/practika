import React from 'react';
import { createBrowserRouter, Navigate, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import RoleLayout from '../components/layout/RoleLayout';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import BackOffice from '../pages/BackOffice';
import AlunoHome from '../pages/AlunoHome';
import EmpresaHome from '../pages/EmpresaHome';
import ProfessorHome from '../pages/ProfessorHome';
import AlunoPerfil from '../pages/AlunoPerfil';
import EmpresaPerfil from '../pages/EmpresaPerfil';
import ProfessorPerfil from '../pages/ProfessorPerfil';
import { useAuth } from '../context/AuthContext';

// Protected Route wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { user, userData } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Se allowedRoles é especificado, verificar role
  if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
    // Redirecionar para a home apropriada do role
    return <Navigate to="/home" replace />;
  }
  
  return children;
}

// Public Only Route (redirect if logged in)
function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return children;
}

// Home Route - redireciona baseado no role
function HomeRoute() {
  const { userData, user, logout } = useAuth();
  const navigate = useNavigate();
  const [waitTime, setWaitTime] = React.useState(0);
  
  React.useEffect(() => {
    const timer = setInterval(() => {
      setWaitTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (!userData) {
    if (waitTime > 5) {
      // Se passou mais de 5 segundos, mostrar opção de logout
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#e74c3c' }}></i>
          <h2>Erro ao carregar dados do utilizador</h2>
          <p style={{ color: '#7f8c8d' }}>
            Não foi possível carregar as informações da tua conta.<br/>
            Por favor, tenta fazer logout e login novamente.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              style={{
                padding: '0.8rem 2rem',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-sign-out-alt"></i> Fazer Logout
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '0.8rem 2rem',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-sync"></i> Tentar Novamente
            </button>
          </div>
        </div>
      );
    }
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div className="loading">A carregar...</div>
        <p style={{ color: '#7f8c8d' }}>A obter informações do utilizador...</p>
      </div>
    );
  }
  
  switch (userData.role) {
    case 'Aluno':
      return <AlunoHome />;
    case 'Empresa':
      return <EmpresaHome />;
    case 'Professor':
      return <ProfessorHome />;
    case 'GestorCoordenacao':
      return <Navigate to="/backoffice" replace />;
    default:
      return <Navigate to="/" replace />;
  }
}

// Perfil Route - redireciona baseado no role
function PerfilRoute() {
  const { userData } = useAuth();
  
  if (!userData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div className="loading">A carregar...</div>
      </div>
    );
  }
  
  switch (userData.role) {
    case 'Aluno':
      return <AlunoPerfil />;
    case 'Empresa':
      return <EmpresaPerfil />;
    case 'Professor':
      return <ProfessorPerfil />;
    default:
      return <Navigate to="/" replace />;
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Landing />
      }
    ]
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        )
      }
    ]
  },
  {
    path: '/register',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        )
      }
    ]
  },
  {
    path: '/home',
    element: <RoleLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomeRoute />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/perfil',
    element: <RoleLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <PerfilRoute />
          </ProtectedRoute>
        )
      }
    ]
  },
  {
    path: '/backoffice',
    element: (
      <ProtectedRoute allowedRoles={['GestorCoordenacao']}>
        <BackOffice />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
