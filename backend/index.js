// Garantir que as variáveis de ambiente são carregadas antes de qualquer import
// que possa depender de `process.env` (ex.: models que fazem mongoose.connect()).
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/routes.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api", routes);
app.use("/api/auth", authRoutes);

// Rota de teste
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend a funcionar!" });
});

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("Erro ao conectar MongoDB:", err);
    process.exit(1);
  });

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
