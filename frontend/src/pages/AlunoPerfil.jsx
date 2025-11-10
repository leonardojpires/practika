import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Perfil.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function AlunoPerfil() {
  const { user, userData, fetchBackendUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    curso: ''
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        nome: userData.nome || '',
        email: userData.email || '',
        curso: userData.curso || ''
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userData?.mongoId) {
        throw new Error('ID do utilizador não encontrado');
      }

      const token = await user.getIdToken();
      const res = await fetch(`${API_URL}/alunos/${userData.mongoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Erro na resposta:', errorData);
        throw new Error(errorData.error || 'Erro ao atualizar perfil');
      }

      const updatedData = await res.json();
      console.log('Perfil atualizado:', updatedData);

      alert('Perfil atualizado com sucesso!');
      setEditing(false);
      
      // Recarregar dados do usuário
      if (fetchBackendUser) {
        await fetchBackendUser(user);
      }
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: userData.nome || '',
      email: userData.email || '',
      curso: userData.curso || ''
    });
    setEditing(false);
  };

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <div className="perfil-avatar">
          <i className="fas fa-user-graduate"></i>
        </div>
        <div className="perfil-info">
          <h1>{userData?.nome}</h1>
          <p className="role-badge">Aluno</p>
        </div>
      </div>

      <div className="perfil-content">
        <div className="perfil-section">
          <div className="section-header">
            <h2>Informações Pessoais</h2>
            {!editing && (
              <button className="btn-edit" onClick={() => setEditing(true)}>
                <i className="fas fa-edit"></i> Editar
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="perfil-form">
              <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="curso">Curso</label>
                <input
                  type="text"
                  id="curso"
                  name="curso"
                  value={formData.curso}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCancel} disabled={loading}>
                  Cancelar
                </button>
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? 'A guardar...' : 'Guardar Alterações'}
                </button>
              </div>
            </form>
          ) : (
            <div className="perfil-details">
              <div className="detail-item">
                <i className="fas fa-user"></i>
                <div>
                  <span className="detail-label">Nome</span>
                  <span className="detail-value">{userData?.nome}</span>
                </div>
              </div>

              <div className="detail-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{userData?.email}</span>
                </div>
              </div>

              <div className="detail-item">
                <i className="fas fa-graduation-cap"></i>
                <div>
                  <span className="detail-label">Curso</span>
                  <span className="detail-value">{userData?.curso}</span>
                </div>
              </div>

              <div className="detail-item">
                <i className="fas fa-id-badge"></i>
                <div>
                  <span className="detail-label">Tipo de Conta</span>
                  <span className="detail-value">{userData?.role}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
