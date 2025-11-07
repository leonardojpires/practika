import { auth } from "../config/firebase.js";

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
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      displayName: decodedToken.name,
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
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        displayName: decodedToken.name,
      };
    }

    next();
  } catch (error) {
    // Em caso de erro, apenas continua sem autenticação
    next();
  }
};
