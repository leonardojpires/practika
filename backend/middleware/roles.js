export const requireRole = (allowed) => {
  const list = Array.isArray(allowed) ? allowed : [allowed];
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    const role = req.user.role;
    if (!role) {
      return res.status(403).json({ error: "Role do utilizador não encontrada" });
    }

    if (!list.includes(role)) {
      return res.status(403).json({ error: "Acesso negado: role não autorizada" });
    }

    next();
  };
};

export const isAluno = requireRole("Aluno");
export const isProfessor = requireRole("Professor");
export const isEmpresa = requireRole("Empresa");
export const isGestor = requireRole(["GestorCoordenacao"]);