import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

export default function App() {
  const [view, setView] = useState("login"); 

  return (
    <div className="auth-root" style={{ minHeight: "100vh", padding: 32 }}>
      {view === "login" ? (
        <Login onSwitchToRegister={() => setView("register")} />
      ) : (
        <Register onSwitchToLogin={() => setView("login")} />
      )}
    </div>
  );
}
