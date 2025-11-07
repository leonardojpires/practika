import express from "express";
import { auth } from "../config/firebase.js";
import { UserAccount, Aluno, Professor, Empresa, GestorCoordenacao } from "../models/models.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * Cria um novo utilizador no Firebase e na base de dados MongoDB
 * Body: { email, password, nome, role, ...dadosEspecificos }
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, nome, role, ...dadosEspecificos } = req.body;

    // Validações
    if (!email || !password || !nome || !role) {
      return res.status(400).json({ 
        error: "Email, password, nome e role são obrigatórios" 
      });
    }

    // Verificar se o role é válido
    const rolesValidos = ["Aluno", "Professor", "Empresa", "GestorCoordenacao"];
    if (!rolesValidos.includes(role)) {
      return res.status(400).json({ 
        error: "Role inválido. Use: Aluno, Professor, Empresa ou GestorCoordenacao" 
      });
    }

    // Criar utilizador no Firebase
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: nome,
      emailVerified: false,
    });

    // Definir custom claims com o role
    await auth.setCustomUserClaims(userRecord.uid, { role });

    // Criar utilizador na base de dados MongoDB
    let user;
    const dadosBase = { nome, email, firebaseUid: userRecord.uid };

    switch (role) {
      case "Aluno":
        user = new Aluno({ 
          ...dadosBase, 
          curso: dadosEspecificos.curso || "",
          competencias: dadosEspecificos.competencias || "",
          cv: dadosEspecificos.cv || "",
        });
        break;
      case "Professor":
        user = new Professor({ 
          ...dadosBase, 
          departamento: dadosEspecificos.departamento || "" 
        });
        break;
      case "Empresa":
        user = new Empresa({ 
          ...dadosBase, 
          nif: dadosEspecificos.nif || "",
          validada: false 
        });
        break;
      case "GestorCoordenacao":
        user = new GestorCoordenacao(dadosBase);
        break;
    }

    await user.save();

    res.status(201).json({
      message: "Utilizador criado com sucesso",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        nome,
        role,
        mongoId: user._id,
      },
    });
  } catch (error) {
    console.error("Erro no registo:", error);
    
    // Se o erro for do Firebase, apagar o utilizador criado
    if (error.code && error.code.startsWith("auth/")) {
      return res.status(400).json({ 
        error: "Erro ao criar utilizador no Firebase",
        details: error.message 
      });
    }

    res.status(500).json({ 
      error: "Erro ao criar utilizador",
      details: error.message 
    });
  }
});

/**
 * POST /api/auth/login
 * Não é necessário no backend - o login é feito diretamente no Firebase no frontend
 * Esta rota serve apenas para verificar se o utilizador existe na BD após login
 */
router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email é obrigatório" });
    }

    // Buscar utilizador na base de dados
    const user = await UserAccount.findOne({ email });

    if (!user) {
      return res.status(404).json({ 
        error: "Utilizador não encontrado na base de dados" 
      });
    }

    res.json({
      message: "Utilizador encontrado",
      user: {
        _id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ 
      error: "Erro ao verificar utilizador",
      details: error.message 
    });
  }
});

/**
 * GET /api/auth/verify
 * Verifica o token e retorna os dados do utilizador autenticado
 * Requer autenticação (middleware verifyFirebaseToken)
 */
router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        error: "Token de autenticação não fornecido" 
      });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Buscar utilizador na base de dados
    const user = await UserAccount.findOne({ email: decodedToken.email });

    if (!user) {
      return res.status(404).json({ 
        error: "Utilizador não encontrado na base de dados" 
      });
    }

    res.json({
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        nome: user.nome,
        role: user.role,
        mongoId: user._id,
      },
    });
  } catch (error) {
    console.error("Erro na verificação:", error);
    res.status(403).json({ 
      error: "Token inválido ou expirado",
      details: error.message 
    });
  }
});

/**
 * DELETE /api/auth/delete-user/:uid
 * Apaga um utilizador do Firebase e da base de dados
 * Apenas para administradores ou o próprio utilizador
 */
router.delete("/delete-user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;

    // Apagar utilizador do Firebase
    await auth.deleteUser(uid);

    // Apagar utilizador da base de dados
    const user = await UserAccount.findOneAndDelete({ firebaseUid: uid });

    if (!user) {
      return res.status(404).json({ 
        error: "Utilizador não encontrado na base de dados" 
      });
    }

    res.json({
      message: "Utilizador apagado com sucesso",
      deletedUser: {
        uid,
        email: user.email,
        nome: user.nome,
      },
    });
  } catch (error) {
    console.error("Erro ao apagar utilizador:", error);
    res.status(500).json({ 
      error: "Erro ao apagar utilizador",
      details: error.message 
    });
  }
});

export default router;
