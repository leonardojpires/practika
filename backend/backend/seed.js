import dotenv from "dotenv";
import mongoose from "mongoose";
import {
  Aluno,
  Professor,
  Empresa,
  GestorCoordenacao,
  OfertaEstagio,
  Candidatura,
  Estagio
} from "./models/models.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

async function seedDB() {
  try {
    await Aluno.deleteMany({});
    await Professor.deleteMany({});
    await Empresa.deleteMany({});
    await GestorCoordenacao.deleteMany({});
    await OfertaEstagio.deleteMany({});
    await Candidatura.deleteMany({});
    await Estagio.deleteMany({});

    const aluno1 = await Aluno.create({
      nome: "João Silva",
      email: "joao@email.com",
      curso: "Engenharia Informática",
      competencias: "JavaScript, Node.js, React",
      cv: "link_para_cv.pdf"
    });

    const aluno2 = await Aluno.create({
      nome: "Ana Costa",
      email: "ana@email.com",
      curso: "Engenharia Informática",
      competencias: "Python, Django, MongoDB",
      cv: "link_para_cv2.pdf"
    });

    const professor1 = await Professor.create({
      nome: "Dra. Maria Santos",
      email: "maria@email.com",
      departamento: "Engenharia"
    });

    const professor2 = await Professor.create({
      nome: "Dr. Pedro Oliveira",
      email: "pedro@email.com",
      departamento: "Engenharia Informática"
    });

    const empresa1 = await Empresa.create({
      nome: "Tech Solutions",
      email: "contact@techsolutions.com",
      nif: "123456789",
      validada: true
    });

    const empresa2 = await Empresa.create({
      nome: "Innovatech",
      email: "contact@innovatech.com",
      nif: "987654321",
      validada: true
    });

    const gestor1 = await GestorCoordenacao.create({
      nome: "Carlos Ferreira",
      email: "carlos@email.com"
    });

    const oferta1 = await OfertaEstagio.create({
      titulo: "Desenvolvedor Frontend",
      descricao: "React + Tailwind",
      duracao: "3 meses",
      local: "Lisboa",
      empresa: empresa1._id
    });

    const oferta2 = await OfertaEstagio.create({
      titulo: "Backend Node.js",
      descricao: "Node.js + MongoDB",
      duracao: "6 meses",
      local: "Porto",
      empresa: empresa2._id
    });

    await Candidatura.create({
      estado: "PENDENTE",
      aluno: aluno1._id,
      ofertaEstagio: oferta1._id
    });

    await Candidatura.create({
      estado: "ACEITE",
      aluno: aluno2._id,
      ofertaEstagio: oferta2._id
    });
    
    await Estagio.create({
      dataInicio: new Date("2025-09-01"),
      dataFim: new Date("2025-12-01"),
      estado: "ATIVO",
      aluno: aluno1._id,
      professorOrientador: professor1._id
    });

    await Estagio.create({
      dataInicio: new Date("2025-06-01"),
      dataFim: new Date("2025-12-01"),
      estado: "CONCLUIDO",
      aluno: aluno2._id,
      professorOrientador: professor2._id
    });

    console.log("✅ DB Seed completed!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

seedDB();
