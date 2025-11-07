// routes.js
import express from "express";
import { Aluno, Professor, Empresa, Estagio, Candidatura } from "../models/models.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();

// Listar todos os Alunos (requer autenticação)
router.get("/alunos", verifyFirebaseToken, async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todos os Professores (requer autenticação)
router.get("/professores", verifyFirebaseToken, async (req, res) => {
  try {
    const professores = await Professor.find();
    res.json(professores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todas as Empresas (requer autenticação)
router.get("/empresas", verifyFirebaseToken, async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.json(empresas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todos os Estágios com aluno e professor populados (requer autenticação)
router.get("/estagios", verifyFirebaseToken, async (req, res) => {
  try {
    const estagios = await Estagio.find()
      .populate("aluno", "nome email curso competencias")
      .populate("professorOrientador", "nome email departamento");
    res.json(estagios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todas as Candidaturas com aluno e oferta populados (requer autenticação)
router.get("/candidaturas", verifyFirebaseToken, async (req, res) => {
  try {
    const candidaturas = await Candidatura.find()
      .populate("aluno", "nome email curso")
      .populate({
        path: "ofertaEstagio",
        select: "titulo descricao duracao local",
        populate: { path: "empresa", select: "nome email nif" }
      });
    res.json(candidaturas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
