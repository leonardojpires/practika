# 🚀 Guia de Deploy no Render

## 📋 Pré-requisitos

1. Conta no [Render](https://render.com)
2. Repositório GitHub com o projeto
3. MongoDB Atlas configurado
4. Firebase Project com Service Account Key

---

## 🔧 BACKEND - Web Service

### Passo 1: Criar Web Service
1. No Render Dashboard → **New** → **Web Service**
2. Conectar repositório GitHub: `leonardojpires/practika`
3. Configurar:
   - **Name:** `practika-backend`
   - **Region:** Frankfurt (ou mais próximo)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Passo 2: Adicionar Environment Variables

Ir para **Environment** e adicionar:

```bash
# Node.js Version
NODE_VERSION=18.17.0

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Firebase Admin SDK
FIREBASE_PROJECT_ID=practika-app-f5ea2
FIREBASE_PRIVATE_KEY_ID=<obter_do_service_account_json>
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n<conteudo_da_key>\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@practika-app-f5ea2.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=<obter_do_service_account_json>
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40practika-app-f5ea2.iam.gserviceaccount.com
```

⚠️ **IMPORTANTE - FIREBASE_PRIVATE_KEY:**
- Copiar do ficheiro JSON da Service Account
- Manter as quebras de linha como `\n`
- Envolver em aspas duplas no Render
- Exemplo: `"-----BEGIN PRIVATE KEY-----\nMIIEvQI...\n-----END PRIVATE KEY-----\n"`

### Passo 3: Deploy
- Clicar em **Create Web Service**
- Aguardar build e deploy
- Copiar a URL gerada (ex: `https://practika-backend.onrender.com`)

---

## 🌐 FRONTEND - Static Site

### Passo 1: Criar Static Site
1. No Render Dashboard → **New** → **Static Site**
2. Conectar mesmo repositório GitHub
3. Configurar:
   - **Name:** `practika-frontend`
   - **Region:** Frankfurt
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install; npm run build`
   - **Publish Directory:** `dist`

### Passo 2: Adicionar Environment Variables

```bash
# Node.js Version
NODE_VERSION=18.17.0

# Firebase Client SDK (já públicos)
VITE_FIREBASE_API_KEY=AIzaSyBUOoIXkkNYDNxwj-_GC1NNL6zxgGW-rNo
VITE_FIREBASE_AUTH_DOMAIN=practika-app-f5ea2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=practika-app-f5ea2
VITE_FIREBASE_STORAGE_BUCKET=practika-app-f5ea2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=440708238791
VITE_FIREBASE_APP_ID=1:440708238791:web:83d98a335ff986bc1b9de2

# Backend URL (usar a URL do backend deployado)
VITE_API_URL=https://practika-backend.onrender.com/api
```

⚠️ **Substituir** `https://practika-backend.onrender.com` pela URL real do backend!

### Passo 3: Deploy
- Clicar em **Create Static Site**
- Aguardar build e deploy

---

## 🔍 Como Obter Firebase Service Account Key

1. Firebase Console → Project Settings (⚙️)
2. Service Accounts → Generate New Private Key
3. Download do ficheiro JSON
4. Extrair valores:
   ```json
   {
     "project_id": "...",           → FIREBASE_PROJECT_ID
     "private_key_id": "...",       → FIREBASE_PRIVATE_KEY_ID
     "private_key": "-----BEGIN...", → FIREBASE_PRIVATE_KEY
     "client_email": "...",         → FIREBASE_CLIENT_EMAIL
     "client_id": "...",            → FIREBASE_CLIENT_ID
     "client_x509_cert_url": "..."  → FIREBASE_CLIENT_CERT_URL
   }
   ```

---

## ✅ Verificação Pós-Deploy

### Backend
- Testar: `https://practika-backend.onrender.com/api/test`
- Deve retornar: `{"message": "Backend a funcionar!"}`

### Frontend
- Aceder: `https://practika-frontend.onrender.com`
- Verificar se carrega a Landing Page
- Testar login/registo

---

## 🐛 Troubleshooting

### Backend não inicia
- Verificar logs no Render Dashboard
- Confirmar todas as variáveis de ambiente
- Verificar `FIREBASE_PRIVATE_KEY` (aspas e `\n`)
- Confirmar `MONGO_URI` está correto

### Frontend não conecta ao Backend
- Verificar se `VITE_API_URL` aponta para o backend correto
- Testar URL do backend manualmente
- Verificar CORS no backend

### Erros de Build
- Verificar versão do Node.js (deve ser >=18)
- Confirmar `package.json` tem todas as dependências
- Verificar se `npm install` funciona localmente

### Service Free Tier dorme após 15min
- Primeira request demora ~30s (cold start)
- Considerar upgrade ou usar cron-job.org para manter ativo

---

## 📝 Notas Importantes

1. **Free Tier Limitations:**
   - Backend pode dormir após inatividade
   - 750h/mês de compute time
   - Cold start de ~30 segundos

2. **Rebuild/Redeploy:**
   - Mudanças no GitHub triggeram rebuild automático
   - Ou manualmente: Dashboard → Manual Deploy

3. **Logs:**
   - Acessíveis em cada serviço no Dashboard
   - Úteis para debugging

4. **Domínios Custom:**
   - Possível adicionar domínio próprio
   - Settings → Custom Domains

---

## 🔗 Links Úteis

- [Render Docs](https://render.com/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
