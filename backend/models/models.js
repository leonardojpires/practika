import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userAccountSchema = new Schema(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firebaseUid: { type: String, unique: true, sparse: true },
  },
  { discriminatorKey: "role", timestamps: true }
);

const UserAccount = model("UserAccount", userAccountSchema);

const alunoSchema = new Schema({
  curso: { type: String, required: true },
  competencias: { type: String },
  cv: { type: String },
});

const Aluno = UserAccount.discriminator("Aluno", alunoSchema);

const professorSchema = new Schema({
  departamento: { type: String, required: true },
});

const Professor = UserAccount.discriminator("Professor", professorSchema);

const empresaSchema = new Schema({
  nif: { type: String, required: true, unique: true },
  validada: { type: Boolean, default: false },
});

const Empresa = UserAccount.discriminator("Empresa", empresaSchema);

const gestorSchema = new Schema({});

const GestorCoordenacao = UserAccount.discriminator(
  "GestorCoordenacao",
  gestorSchema
);

const ofertaEstagioSchema = new Schema({
  titulo: { type: String, required: true },
  descricao: { type: String },
  duracao: { type: String },
  local: { type: String },
  empresa: { type: Schema.Types.ObjectId, ref: "Empresa", required: true },
});

const OfertaEstagio = model("OfertaEstagio", ofertaEstagioSchema);

const candidaturaSchema = new Schema({
  estado: {
    type: String,
    enum: ["PENDENTE", "ACEITE", "RECUSADO"],
    default: "PENDENTE",
  },
  aluno: { type: Schema.Types.ObjectId, ref: "Aluno", required: true },
  ofertaEstagio: {
    type: Schema.Types.ObjectId,
    ref: "OfertaEstagio",
    required: true,
  },
});

const Candidatura = model("Candidatura", candidaturaSchema);

const estagioSchema = new Schema({
  dataInicio: { type: Date, required: true },
  dataFim: { type: Date },
  estado: {
    type: String,
    enum: ["ATIVO", "CONCLUIDO"],
    default: "ATIVO",
  },
  aluno: { type: Schema.Types.ObjectId, ref: "Aluno", required: true },
  professorOrientador: {
    type: Schema.Types.ObjectId,
    ref: "Professor",
    required: true,
  },
});

const Estagio = model("Estagio", estagioSchema);

export {
  UserAccount,
  Aluno,
  Professor,
  Empresa,
  GestorCoordenacao,
  OfertaEstagio,
  Candidatura,
  Estagio,
};

if (process.env.NODE_ENV !== "production") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));
}
