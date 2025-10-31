// routes.js
import express from "express";
import { Aluno, Professor, Empresa, Estagio, Candidatura } from "../models/models.js";

const router = express.Router();

// Listar todos os Alunos
router.get("/alunos", async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todos os Professores
router.get("/professores", async (req, res) => {
  try {
    const professores = await Professor.find();
    res.json(professores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todas as Empresas
router.get("/empresas", async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.json(empresas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todos os Estágios com aluno e professor populados
router.get("/estagios", async (req, res) => {
  try {
    const estagios = await Estagio.find()
      .populate("aluno", "nome email curso competencias")
      .populate("professorOrientador", "nome email departamento");
    res.json(estagios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar todas as Candidaturas com aluno e oferta populados
router.get("/candidaturas", async (req, res) => {
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
