# Backend API - Practika (Gestão de Estágios)

API REST para o sistema de gestão de estágios do ISTEC Porto.

## Setup e Execução

### Requisitos
- Node.js (v16+)
- MongoDB (local ou Atlas)
- npm

### Instalação
```bash
cd backend
npm install
```

### Configuração
Criar ficheiro `.env` na raiz de `backend/` com:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/practika_db
```

### Popular a Base de Dados (seed)
```bash
node seed.js
```
⚠️ **Atenção**: `seed.js` apaga todos os dados existentes e insere registos de exemplo.

### Criar um Administrador
Para converter um utilizador existente **OU criar um novo** Administrador:

**Converter utilizador existente:**
```bash
node createAdmin.js <email_do_utilizador>
```

**Criar novo administrador:**
```bash
node createAdmin.js <email_novo> <nome_completo>
```

**Exemplos:**
```bash
# Converter utilizador existente
node createAdmin.js deydecosta@teste.pt

# Criar novo administrador
node createAdmin.js admin@istec.pt "João Silva"
node createAdmin.js gestao@istec.pt "Maria Santos"
```

**O script:**
- ✅ Se o email **existe**: Converte o utilizador para Administrador
- ✅ Se o email **não existe**: Cria novo utilizador Administrador
- ✅ Cria no Firebase Authentication (se disponível)
- ✅ Define senha temporária: `Admin123!` (para novos utilizadores)
- ✅ Remove das listas de Alunos/Professores/Empresas
- ✅ Permite acesso ao BackOffice

⚠️ **Importante:** Altere a senha após o primeiro login!

### Iniciar o Servidor
```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

Servidor iniciará em `http://localhost:5000`

---

## Endpoints da API

Base URL: `http://localhost:5000/api`

### 🧪 Teste
#### GET /api/test
Verifica se o servidor está a funcionar.

**Resposta:**
```json
{
  "message": "Backend a funcionar!"
}
```

---

## 👨‍🎓 Alunos

### GET /api/alunos
Lista todos os alunos.

**Resposta:**
```json
[
  {
    "_id": "690dc7b517445006e857f646",
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "Aluno",
    "curso": "Engenharia Informática",
    "competencias": "JavaScript, Node.js, React",
    "cv": "link_para_cv.pdf",
    "createdAt": "2025-11-07T10:19:33.152Z",
    "updatedAt": "2025-11-07T10:19:33.152Z"
  }
]
```

### POST /api/alunos
Cria um novo aluno.

**Body:**
```json
{
  "nome": "Maria Santos",
  "email": "maria@example.com",
  "curso": "Engenharia Informática",
  "competencias": "Python, Django, React",
  "cv": "link_para_cv.pdf"
}
```

**Resposta:** `201 Created` com o aluno criado.

### GET /api/alunos/:id
Obter um aluno específico por ID.

**Resposta:** `200 OK` com o aluno, ou `404 Not Found`.

### PUT /api/alunos/:id
Atualizar dados de um aluno.

**Body:** Campos a atualizar (parcial ou completo).
```json
{
  "competencias": "JavaScript, Node.js, React, TypeScript",
  "cv": "novo_link.pdf"
}
```

**Resposta:** `200 OK` com aluno atualizado, ou `404 Not Found`.

### DELETE /api/alunos/:id
Remover um aluno.

**Resposta:** `200 OK` com `{ "message": "Aluno removido" }`, ou `404 Not Found`.

---

## 👨‍🏫 Professores

### GET /api/professores
Lista todos os professores.

### POST /api/professores
Cria um novo professor.

**Body:**
```json
{
  "nome": "Dra. Ana Costa",
  "email": "ana.costa@istec.pt",
  "departamento": "Engenharia Informática"
}
```

### GET /api/professores/:id
Obter um professor específico por ID.

### PUT /api/professores/:id
Atualizar dados de um professor.

### DELETE /api/professores/:id
Remover um professor.

---

## 🏢 Empresas

### GET /api/empresas
Lista todas as empresas.

**Resposta:**
```json
[
  {
    "_id": "690dc7b517445006e857f64e",
    "nome": "Tech Solutions",
    "email": "contact@techsolutions.com",
    "role": "Empresa",
    "nif": "123456789",
    "validada": true,
    "createdAt": "2025-11-07T10:19:33.163Z",
    "updatedAt": "2025-11-07T10:19:33.163Z"
  }
]
```

### POST /api/empresas
Cria uma nova empresa.

**Body:**
```json
{
  "nome": "Acme Corp",
  "email": "contact@acme.com",
  "nif": "555666777"
}
```
⚠️ Por defeito, `validada` será `false`. O gestor deve validar a empresa.

### GET /api/empresas/:id
Obter uma empresa específica por ID.

### PATCH /api/empresas/:id/validar
**Endpoint especial para gestor**: Marca uma empresa como validada.

**Resposta:** `200 OK` com empresa atualizada (`validada: true`).

### PUT /api/empresas/:id
Atualizar dados de uma empresa.

### DELETE /api/empresas/:id
Remover uma empresa.

### GET /api/empresas/:id/ofertas
Lista todas as ofertas de estágio de uma empresa específica.

**Resposta:**
```json
[
  {
    "_id": "690dc7b517445006e857f654",
    "titulo": "Desenvolvedor Frontend",
    "descricao": "React + Tailwind",
    "duracao": "3 meses",
    "local": "Lisboa",
    "empresa": "690dc7b517445006e857f64e"
  }
]
```

---

## 💼 Ofertas de Estágio

### GET /api/ofertas
Lista todas as ofertas de estágio (com empresa populada).

**Resposta:**
```json
[
  {
    "_id": "690dc7b517445006e857f654",
    "titulo": "Desenvolvedor Frontend",
    "descricao": "React + Tailwind",
    "duracao": "3 meses",
    "local": "Lisboa",
    "empresa": {
      "_id": "690dc7b517445006e857f64e",
      "nome": "Tech Solutions",
      "email": "contact@techsolutions.com",
      "nif": "123456789"
    }
  }
]
```

### POST /api/ofertas
Cria uma nova oferta de estágio.

**Body:**
```json
{
  "titulo": "Backend Developer",
  "descricao": "Node.js + MongoDB + Express",
  "duracao": "6 meses",
  "local": "Porto",
  "empresa": "690dc7b517445006e857f64e"
}
```
⚠️ `empresa` deve ser um ObjectId válido de uma empresa existente.

### GET /api/ofertas/:id
Obter uma oferta específica por ID (com empresa populada).

### PUT /api/ofertas/:id
Atualizar dados de uma oferta.

### DELETE /api/ofertas/:id
Remover uma oferta.

---

## 📋 Candidaturas

### GET /api/candidaturas
Lista todas as candidaturas (com aluno e oferta+empresa populados).

**Resposta:**
```json
[
  {
    "_id": "690dc7b517445006e857f658",
    "estado": "PENDENTE",
    "aluno": {
      "_id": "690dc7b517445006e857f646",
      "nome": "João Silva",
      "email": "joao@email.com",
      "curso": "Engenharia Informática"
    },
    "ofertaEstagio": {
      "_id": "690dc7b517445006e857f654",
      "titulo": "Desenvolvedor Frontend",
      "descricao": "React + Tailwind",
      "duracao": "3 meses",
      "local": "Lisboa",
      "empresa": {
        "_id": "690dc7b517445006e857f64e",
        "nome": "Tech Solutions",
        "email": "contact@techsolutions.com",
        "nif": "123456789"
      }
    }
  }
]
```

### POST /api/candidaturas
Cria uma nova candidatura.

**Body:**
```json
{
  "aluno": "690dc7b517445006e857f646",
  "ofertaEstagio": "690dc7b517445006e857f654"
}
```
⚠️ Ambos `aluno` e `ofertaEstagio` devem ser ObjectIds válidos.  
Por defeito, `estado` será `"PENDENTE"`.

### PATCH /api/candidaturas/:id/estado
Atualiza o estado de uma candidatura (aceitar/recusar).

**Body:**
```json
{
  "estado": "ACEITE"
}
```
Estados válidos: `"PENDENTE"`, `"ACEITE"`, `"RECUSADO"`.

**Resposta:** `200 OK` com candidatura atualizada, ou `400 Bad Request` se o estado for inválido.

---

## 🎓 Estágios

### GET /api/estagios
Lista todos os estágios (com aluno e professor orientador populados).

**Resposta:**
```json
[
  {
    "_id": "690dc7b517445006e857f65c",
    "dataInicio": "2025-09-01T00:00:00.000Z",
    "dataFim": "2025-12-01T00:00:00.000Z",
    "estado": "ATIVO",
    "aluno": {
      "_id": "690dc7b517445006e857f646",
      "nome": "João Silva",
      "email": "joao@email.com",
      "curso": "Engenharia Informática",
      "competencias": "JavaScript, Node.js, React"
    },
    "professorOrientador": {
      "_id": "690dc7b517445006e857f64a",
      "nome": "Dra. Maria Santos",
      "email": "maria@email.com",
      "departamento": "Engenharia"
    }
  }
]
```

### POST /api/estagios
Cria um novo estágio.

**Body:**
```json
{
  "dataInicio": "2025-09-01",
  "dataFim": "2025-12-01",
  "estado": "ATIVO",
  "aluno": "690dc7b517445006e857f646",
  "professorOrientador": "690dc7b517445006e857f64a"
}
```
Estados válidos: `"ATIVO"`, `"CONCLUIDO"`.

### GET /api/estagios/:id
Obter um estágio específico por ID (com aluno e professor populados).

### PUT /api/estagios/:id
Atualizar dados de um estágio.

**Exemplo (alterar estado):**
```json
{
  "estado": "CONCLUIDO",
  "dataFim": "2025-11-30"
}
```

### DELETE /api/estagios/:id
Remover um estágio.

---

## 🛠️ Códigos de Estado HTTP

- `200 OK` – Sucesso (GET, PUT, PATCH, DELETE)
- `201 Created` – Recurso criado com sucesso (POST)
- `400 Bad Request` – Dados inválidos no body
- `404 Not Found` – Recurso não encontrado
- `500 Internal Server Error` – Erro do servidor

---

## 📝 Notas Importantes

1. **Autenticação**: Atualmente **não implementada**. As rotas estão abertas. O sistema de autenticação Firebase será integrado por outro membro da equipa.

2. **Validação**: Mongoose valida os campos obrigatórios (`required: true`) definidos nos schemas. Erros de validação retornam `400 Bad Request`.

3. **ObjectIds**: Todos os IDs são ObjectIds do MongoDB (24 caracteres hexadecimais). Usar IDs inválidos retorna erro.

4. **Populate**: Vários endpoints fazem populate automático de relacionamentos (ex.: candidaturas retornam dados completos do aluno e oferta).

5. **CORS**: Habilitado por defeito (todas as origens permitidas).

6. **Timestamps**: Todos os documentos têm `createdAt` e `updatedAt` automáticos.

---

## 🧪 Testes Rápidos (PowerShell)

### Listar alunos
```powershell
Invoke-RestMethod -Method GET -Uri http://localhost:5000/api/alunos
```

### Criar aluno
```powershell
$body = @{ nome='Teste'; email='t@t.com'; curso='Eng'; competencias='JS' } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/alunos -Body $body -ContentType 'application/json'
```

### Criar candidatura
```powershell
$body = @{ aluno='<alunoId>'; ofertaEstagio='<ofertaId>' } | ConvertTo-Json
Invoke-RestMethod -Method POST -Uri http://localhost:5000/api/candidaturas -Body $body -ContentType 'application/json'
```

### Atualizar estado de candidatura
```powershell
$body = @{ estado='ACEITE' } | ConvertTo-Json
Invoke-RestMethod -Method PATCH -Uri http://localhost:5000/api/candidaturas/<id>/estado -Body $body -ContentType 'application/json'
```

---

## 📞 Suporte

Para questões ou problemas, contactar o responsável pelas rotas da API.

**Repositório**: practika  
**Branch atual**: master  
**Data**: Novembro 2025
