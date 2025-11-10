import { auth } from "../config/firebase.js";
import { UserAccount } from "../models/models.js";

/**
 * Middleware para verificar o token Firebase
 * Autentica o utilizador através do token JWT fornecido no header Authorization
 */
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Obtém o token do header Authorization (formato: "Bearer <token>")
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        error: "Token de autenticação não fornecido ou inválido" 
      });
    }

    const token = authHeader.split("Bearer ")[1];

    // Verifica o token com Firebase Admin
  const decodedToken = await auth.verifyIdToken(token);
    
    // Adiciona as informações do utilizador ao request
    // role poderá vir em custom claims (decodedToken.role). Caso não venha, buscar na BD pelo discriminator
    let role = decodedToken.role;
    if (!role && decodedToken.email) {
      try {
        const user = await UserAccount.findOne({ email: decodedToken.email }).select("role");
        role = user?.role;
      } catch (e) {
        // Se falhar o lookup, continua sem travar aqui; será tratado abaixo
      }
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      displayName: decodedToken.name,
      role,
    };

    next();
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    return res.status(403).json({ 
      error: "Token inválido ou expirado",
      details: error.message 
    });
  }
};

/**
 * Middleware opcional - apenas adiciona info do user se o token existir
 * Útil para rotas que podem ser públicas ou privadas
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await auth.verifyIdToken(token);
      let role = decodedToken.role;
      if (!role && decodedToken.email) {
        try {
          const user = await UserAccount.findOne({ email: decodedToken.email }).select("role");
          role = user?.role;
        } catch {}
      }
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        displayName: decodedToken.name,
        role,
      };
    }

    next();
  } catch (error) {
    // Em caso de erro, apenas continua sem autenticação
    next();
  }
};
