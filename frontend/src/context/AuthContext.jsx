import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';

const AuthContext = createContext(null);

export function useAuth(){
  return useContext(AuthContext);
}

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // dados vindos do backend (role, etc.)
  const [loading, setLoading] = useState(true);

  async function register({ nome, email, password, role, ...extraFields }){
    // Chama backend para criar utilizador (Firebase + Mongo)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ nome, email, password, role, ...extraFields })
    });
    if(!res.ok){
      const payload = await res.json().catch(()=>({}));
      throw new Error(payload.error || payload.message || 'Falha no registo');
    }
    // Depois faz login automático via Firebase auth SDK
    await signInWithEmailAndPassword(auth, email, password);
    return await res.json();
  }

  // Manter registerAluno para retrocompatibilidade
  async function registerAluno({ nome, email, password, curso }){
    return register({ nome, email, password, role: 'Aluno', curso });
  }

  async function login(email, password){
    await signInWithEmailAndPassword(auth, email, password);
    // token e verificação backend ocorre no listener
  }

  async function logout(){
    await signOut(auth);
    setUserData(null);
  }

  async function resetPassword(email){
    await sendPasswordResetEmail(auth, email);
  }

  async function fetchBackendUser(currentUser){
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify`,{
        headers:{ Authorization: `Bearer ${token}` }
      });
      if(res.ok){
        const data = await res.json();
        setUserData(data.user);
      } else {
        setUserData(null);
      }
    } catch(err){
      setUserData(null);
    }
  }

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{
      setUser(u);
      if(u){
        fetchBackendUser(u);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return ()=>unsub();
  },[]);

  const value = { user, userData, register, registerAluno, login, logout, resetPassword, fetchBackendUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
