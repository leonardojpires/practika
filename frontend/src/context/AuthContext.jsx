import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const AuthContext = createContext(null);

export function useAuth(){
  return useContext(AuthContext);
}

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // dados vindos do backend (role, etc.)
  const [loading, setLoading] = useState(true);

  async function registerAluno({ nome, email, password, curso }){
    // Chama backend para criar utilizador (Firebase + Mongo)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ nome, email, password, role:'Aluno', curso })
    });
    if(!res.ok){
      const payload = await res.json().catch(()=>({}));
      throw new Error(payload.error || payload.message || 'Falha no registo');
    }
    // Depois faz login automático via Firebase auth SDK
    await signInWithEmailAndPassword(auth, email, password);
    return await res.json();
  }

  async function login(email, password){
    await signInWithEmailAndPassword(auth, email, password);
    // token e verificação backend ocorre no listener
  }

  async function logout(){
    await signOut(auth);
    setUserData(null);
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
      console.error('Erro a obter utilizador backend', err);
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

  const value = { user, userData, registerAluno, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
