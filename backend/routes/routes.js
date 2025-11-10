// routes.js
import express from "express";
import {
  Aluno,
  Professor,
  Empresa,
  Estagio,
  Candidatura,
  OfertaEstagio,
} from "../models/models.js";
import { verifyFirebaseToken } from "../middleware/auth.js";
import { isAluno, isProfessor, isEmpresa, isGestor, requireRole } from "../middleware/roles.js";

const router = express.Router();

// --- ALUNOS (CRUD) ------------------------------------------------------
// Listar todos os alunos
router.get("/alunos", async (req, res) => {
  try {
    const alunos = await Aluno.find();
    res.json(alunos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar aluno
router.post("/alunos", async (req, res) => {
  try {
    const aluno = await Aluno.create(req.body);
    res.status(201).json(aluno);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Obter aluno por id
router.get("/alunos/:id", async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);
    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json(aluno);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar aluno
router.put("/alunos/:id", async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json(aluno);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar parcialmente aluno (PATCH)
router.patch("/alunos/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json(aluno);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remover aluno
router.delete("/alunos/:id", async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json({ message: "Aluno removido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROFESSORES (CRUD) -------------------------------------------------
router.get("/professores", async (req, res) => {
  try {
    const professores = await Professor.find();
    res.json(professores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/professores", async (req, res) => {
  try {
    const professor = await Professor.create(req.body);
    res.status(201).json(professor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/professores/:id", async (req, res) => {
  try {
    const professor = await Professor.findById(req.params.id);
    if (!professor)
      return res.status(404).json({ error: "Professor não encontrado" });
    res.json(professor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/professores/:id", async (req, res) => {
  try {
    const professor = await Professor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!professor)
      return res.status(404).json({ error: "Professor não encontrado" });
    res.json(professor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar parcialmente professor (PATCH)
router.patch("/professores/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const professor = await Professor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!professor)
      return res.status(404).json({ error: "Professor não encontrado" });
    res.json(professor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/professores/:id", async (req, res) => {
  try {
    const professor = await Professor.findByIdAndDelete(req.params.id);
    if (!professor)
      return res.status(404).json({ error: "Professor não encontrado" });
    res.json({ message: "Professor removido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- EMPRESAS (CRUD + validar) -----------------------------------------
router.get("/empresas", async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.json(empresas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/empresas", async (req, res) => {
  try {
    const empresa = await Empresa.create(req.body);
    res.status(201).json(empresa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/empresas/:id", async (req, res) => {
  try {
    const empresa = await Empresa.findById(req.params.id);
    if (!empresa) return res.status(404).json({ error: "Empresa não encontrada" });
    res.json(empresa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validar uma empresa (gestor irá usar)
router.patch("/empresas/:id/validar", verifyFirebaseToken, isGestor, async (req, res) => {
  try {
    const empresa = await Empresa.findByIdAndUpdate(
      req.params.id,
      { validada: true },
      { new: true }
    );
    if (!empresa) return res.status(404).json({ error: "Empresa não encontrada" });
    res.json(empresa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/empresas/:id", async (req, res) => {
  try {
    const empresa = await Empresa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!empresa) return res.status(404).json({ error: "Empresa não encontrada" });
    res.json(empresa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar parcialmente empresa (PATCH)
router.patch("/empresas/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const empresa = await Empresa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!empresa) return res.status(404).json({ error: "Empresa não encontrada" });
    res.json(empresa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/empresas/:id", async (req, res) => {
  try {
    const empresa = await Empresa.findByIdAndDelete(req.params.id);
    if (!empresa) return res.status(404).json({ error: "Empresa não encontrada" });
    res.json({ message: "Empresa removida" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- OFERTAS DE ESTÁGIO (CRUD) -----------------------------------------
router.get("/ofertas", async (req, res) => {
  try {
    const ofertas = await OfertaEstagio.find().populate("empresa", "nome email nif");
    res.json(ofertas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/ofertas", verifyFirebaseToken, isEmpresa, async (req, res) => {
  try {
    const oferta = await OfertaEstagio.create(req.body);
    res.status(201).json(oferta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/ofertas/:id", async (req, res) => {
  try {
    const oferta = await OfertaEstagio.findById(req.params.id).populate("empresa", "nome email nif");
    if (!oferta) return res.status(404).json({ error: "Oferta não encontrada" });
    res.json(oferta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/ofertas/:id", async (req, res) => {
  try {
    const oferta = await OfertaEstagio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!oferta) return res.status(404).json({ error: "Oferta não encontrada" });
    res.json(oferta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar parcialmente uma oferta (ex: ativar/desativar)
router.patch("/ofertas/:id", verifyFirebaseToken, isEmpresa, async (req, res) => {
  try {
    const oferta = await OfertaEstagio.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!oferta) return res.status(404).json({ error: "Oferta não encontrada" });
    res.json(oferta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/ofertas/:id", verifyFirebaseToken, isEmpresa, async (req, res) => {
  try {
    const oferta = await OfertaEstagio.findByIdAndDelete(req.params.id);
    if (!oferta) return res.status(404).json({ error: "Oferta não encontrada" });
    
    // Apagar também todas as candidaturas associadas
    await Candidatura.deleteMany({ ofertaEstagio: req.params.id });
    
    res.json({ message: "Oferta e candidaturas associadas removidas com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ofertas de uma empresa
router.get("/empresas/:id/ofertas", async (req, res) => {
  try {
    const ofertas = await OfertaEstagio.find({ empresa: req.params.id });
    res.json(ofertas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CANDIDATURAS ------------------------------------------------------
// Listar candidaturas (com populates)
router.get("/candidaturas", async (req, res) => {
  try {
    const candidaturas = await Candidatura.find()
      .populate("aluno", "nome email curso")
      .populate({ path: "ofertaEstagio", populate: { path: "empresa" } });
    res.json(candidaturas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar candidaturas de um aluno específico
router.get("/candidaturas/aluno/:alunoId", verifyFirebaseToken, async (req, res) => {
  try {
    const candidaturas = await Candidatura.find({ aluno: req.params.alunoId })
      .populate("aluno", "nome email curso")
      .populate({ path: "ofertaEstagio", populate: { path: "empresa" } })
      .sort({ createdAt: -1 });
    res.json(candidaturas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar candidaturas para ofertas de uma empresa específica
router.get("/candidaturas/empresa/:empresaId", verifyFirebaseToken, async (req, res) => {
  try {
    // Primeiro buscar todas as ofertas desta empresa
    const ofertas = await OfertaEstagio.find({ empresa: req.params.empresaId });
    const ofertaIds = ofertas.map(o => o._id);
    
    // Depois buscar candidaturas dessas ofertas
    const candidaturas = await Candidatura.find({ ofertaEstagio: { $in: ofertaIds } })
      .populate("aluno", "nome email curso")
      .populate({ path: "ofertaEstagio", populate: { path: "empresa" } })
      .sort({ createdAt: -1 });
    
    res.json(candidaturas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar candidatura
router.post("/candidaturas", verifyFirebaseToken, isAluno, async (req, res) => {
  try {
    // esperar body: { aluno: id, ofertaEstagio: id }
    const candidatura = await Candidatura.create(req.body);
    res.status(201).json(candidatura);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Atualizar estado da candidatura (ACEITE / RECUSADO / PENDENTE)
router.patch("/candidaturas/:id/estado", verifyFirebaseToken, requireRole(["Empresa", "GestorCoordenacao"]), async (req, res) => {
  try {
    const { estado } = req.body; // espera-se string
    if (!["PENDENTE", "ACEITE", "RECUSADO"].includes(estado))
      return res.status(400).json({ error: "Estado inválido" });

    const candidatura = await Candidatura.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );
    if (!candidatura) return res.status(404).json({ error: "Candidatura não encontrada" });
    res.json(candidatura);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apagar candidatura
router.delete("/candidaturas/:id", verifyFirebaseToken, async (req, res) => {
  try {
    const candidatura = await Candidatura.findByIdAndDelete(req.params.id);
    if (!candidatura) return res.status(404).json({ error: "Candidatura não encontrada" });
    res.json({ message: "Candidatura apagada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ESTÁGIOS ----------------------------------------------------------
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

router.post("/estagios", verifyFirebaseToken, requireRole(["Professor", "GestorCoordenacao"]), async (req, res) => {
  try {
    const estagio = await Estagio.create(req.body);
    res.status(201).json(estagio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/estagios/:id", async (req, res) => {
  try {
    const estagio = await Estagio.findById(req.params.id)
      .populate("aluno", "nome email curso")
      .populate("professorOrientador", "nome email departamento");
    if (!estagio) return res.status(404).json({ error: "Estágio não encontrado" });
    res.json(estagio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/estagios/:id", async (req, res) => {
  try {
    const estagio = await Estagio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!estagio) return res.status(404).json({ error: "Estágio não encontrado" });
    res.json(estagio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/estagios/:id", async (req, res) => {
  try {
    const estagio = await Estagio.findByIdAndDelete(req.params.id);
    if (!estagio) return res.status(404).json({ error: "Estágio não encontrado" });
    res.json({ message: "Estágio removido" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
