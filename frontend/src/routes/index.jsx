import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import BackOffice from '../pages/BackOffice';
import { useAuth } from '../context/AuthContext';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Public Only Route (redirect if logged in)
function PublicOnlyRoute({ children }) {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/backoffice" replace />;
  }
  
  return children;
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
    path: '/backoffice',
    element: (
      <ProtectedRoute>
        <BackOffice />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
