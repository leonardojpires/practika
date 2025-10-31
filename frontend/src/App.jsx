import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [alunos, setAlunos] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    // Buscar Alunos
    fetch("http://localhost:5000/api/alunos")
      .then(res => res.json())
      .then(data => setAlunos(data));

    // Buscar Professores
    fetch("http://localhost:5000/api/professores")
      .then(res => res.json())
      .then(data => setProfessores(data));

    // Buscar Empresas
    fetch("http://localhost:5000/api/empresas")
      .then(res => res.json())
      .then(data => setEmpresas(data));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-5">Alunos</h1>
      <ul className="mb-10">
        {alunos.map(aluno => (
          <li key={aluno._id}>
            <strong>{aluno.nome}</strong> - {aluno.curso} - {aluno.competencias}
          </li>
        ))}
      </ul>

      <h1 className="text-3xl font-bold mb-5">Professores</h1>
      <ul className="mb-10">
        {professores.map(prof => (
          <li key={prof._id}>
            <strong>{prof.nome}</strong> - {prof.departamento}
          </li>
        ))}
      </ul>

      <h1 className="text-3xl font-bold mb-5">Empresas</h1>
      <ul className="mb-10">
        {empresas.map(emp => (
          <li key={emp._id}>
            <strong>{emp.nome}</strong> - {emp.nif} - {emp.validada ? "Validada" : "Não validada"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
