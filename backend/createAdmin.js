/**
 * Script para criar ou atualizar um utilizador para Administrador
 * 
 * Uso:
 * node createAdmin.js <email> [nome]
 * 
 * Exemplos:
 * node createAdmin.js admin@istec.pt "Joao Silva"
 * node createAdmin.js deydecosta@teste.pt
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserAccount, GestorCoordenacao } from './models/models.js';
import admin from 'firebase-admin';
import './config/firebase.js';
import crypto from 'crypto';

dotenv.config();

// Usar a mesma URI da API (MONGO_URI). Fallback para practika_db
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/practika_db';

// Verificar Firebase Admin sem expor nomes de ficheiros sensíveis
let firebaseAvailable = false;
try {
  if (admin.apps && admin.apps.length > 0) {
    firebaseAvailable = true;
    console.log('Firebase Admin configurado (variáveis de ambiente)\n');
  } else {
    throw new Error('Firebase Admin não inicializado');
  }
} catch (error) {
  console.log('\nERRO: Firebase Admin nao esta configurado!');
  console.log('============================================================');
  console.log('Para criar utilizadores com senha, configura via variáveis de ambiente:');
  console.log(' - FIREBASE_PROJECT_ID');
  console.log(' - FIREBASE_PRIVATE_KEY_ID');
  console.log(' - FIREBASE_PRIVATE_KEY');
  console.log(' - FIREBASE_CLIENT_EMAIL');
  console.log(' - FIREBASE_CLIENT_ID');
  console.log(' - FIREBASE_CLIENT_CERT_URL');
  console.log('\nOu coloca um ficheiro de credenciais padrão (serviceAccountKey.json) na pasta backend/');
  console.log('============================================================\n');
  process.exit(1);
}

// Gera uma password aleatória alfanumérica com o tamanho indicado
function generatePassword(length = 8) {
  // Gera bytes aleatórios e converte para base64, mantendo apenas [A-Za-z0-9]
  const raw = crypto.randomBytes(Math.ceil(length * 1.5)).toString('base64');
  const clean = raw.replace(/[^a-zA-Z0-9]/g, '');
  return clean.slice(0, length);
}

async function createOrUpdateAdmin(email, nome) {
  try {
  await mongoose.connect(MONGO_URI);
    console.log('Conectado a base de dados MongoDB');

    if (!email) {
      console.error('Erro: Fornece o email do utilizador como argumento');
      console.log('Uso: node createAdmin.js <email> [nome]');
      console.log('\nExemplos:');
      console.log('  node createAdmin.js admin@istec.pt "Joao Silva"');
      console.log('  node createAdmin.js deydecosta@teste.pt');
      process.exit(1);
    }

    // Buscar utilizador pelo email
    const existingUser = await UserAccount.findOne({ email });

    if (existingUser) {
      // Utilizador ja existe - converter para admin
      console.log('\nUtilizador encontrado:');
      console.log('   Nome: ' + existingUser.nome);
      console.log('   Email: ' + existingUser.email);
      console.log('   Role atual: ' + existingUser.role);
      console.log('   ID: ' + existingUser._id);

      if (existingUser.role === 'GestorCoordenacao') {
        console.log('\nEste utilizador ja e um Administrador!');
        process.exit(0);
      }

      // Atualizar para Administrador (GestorCoordenacao)
      const userData = {
        firebaseUid: existingUser.firebaseUid,
        nome: existingUser.nome,
        email: existingUser.email
      };

      await UserAccount.findByIdAndDelete(existingUser._id);
      console.log('\nUtilizador antigo removido');

      // Criar novo GestorCoordenacao
      const adminUser = new GestorCoordenacao(userData);
      await adminUser.save();

      console.log('\nUtilizador convertido para Administrador com sucesso!');
      console.log('   Nome: ' + adminUser.nome);
      console.log('   Email: ' + adminUser.email);
      console.log('   Role: ' + adminUser.role);
      console.log('   Novo ID: ' + adminUser._id);
      
      // Verificar se tem senha no Firebase
      try {
  const firebaseUser = await admin.auth().getUser(existingUser.firebaseUid);
        console.log('\nInformacao de Login:');
        console.log('   Email: ' + email);
        console.log('   Senha: (usa a senha que ja tens configurada)');
        console.log('\nAgora podes fazer login e aceder ao BackOffice!');
      } catch (fbError) {
        console.log('\nAVISO: Utilizador nao tem conta no Firebase!');
        console.log('Para fazer login, e necessario criar a conta no Firebase primeiro.');
      }

    } else {
      // Utilizador nao existe - criar novo
      console.log('\nUtilizador nao encontrado na BD. A criar novo Administrador...');

  const nomeAdmin = nome || 'Administrador';
  const senhaTemporaria = generatePassword(8);
      
      // Criar no Firebase primeiro
      let firebaseUid = null;
      let firebaseUserCreated = false;
      
        try {
          // Verificar se ja existe no Firebase
          let existingFirebaseUser = null;
          try {
            existingFirebaseUser = await admin.auth().getUserByEmail(email);
            console.log('Utilizador ja existe no Firebase Authentication');
            firebaseUid = existingFirebaseUser.uid;
            console.log('   UID: ' + firebaseUid);
            // Redefinir password para uma nova aleatória, garantindo acesso imediato
            await admin.auth().updateUser(firebaseUid, { password: senhaTemporaria });
            console.log('   Password redefinida para acesso inicial.');
          } catch (notFoundError) {
            // Utilizador nao existe no Firebase, criar novo
            const firebaseUser = await admin.auth().createUser({
              email: email,
              password: senhaTemporaria,
              displayName: nomeAdmin,
              emailVerified: true
            });
            firebaseUid = firebaseUser.uid;
            firebaseUserCreated = true;
            console.log('Utilizador criado no Firebase Authentication');
            console.log('   UID: ' + firebaseUid);
          }
        } catch (firebaseError) {
        console.error('Erro ao criar/verificar no Firebase: ' + firebaseError.message);
        process.exit(1);
      }

      // Criar na base de dados MongoDB
      const newAdmin = new GestorCoordenacao({
        firebaseUid: firebaseUid,
        nome: nomeAdmin,
        email: email
      });
      
      await newAdmin.save();

      console.log('\nNovo Administrador criado com sucesso na BD MongoDB!');
      console.log('   Nome: ' + newAdmin.nome);
      console.log('   Email: ' + newAdmin.email);
      console.log('   Role: ' + newAdmin.role);
      console.log('   ID MongoDB: ' + newAdmin._id);
      
      console.log('\n============================================================');
      console.log('LOGIN PRONTO! Podes aceder com:');
      console.log('============================================================');
      console.log('   Email: ' + email);
      console.log('   Senha temporaria: ' + senhaTemporaria);
      console.log('\n   IMPORTANTE: Altere a senha apos o primeiro login!');
      console.log('\n   URL: http://localhost:5173/login');
      console.log('   Acesso: BackOffice disponivel apos login');
      console.log('============================================================');
    }

  } catch (error) {
    console.error('Erro: ' + error.message);
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nConexao com a base de dados encerrada');
  }
}

// Obter argumentos da linha de comando
const email = process.argv[2];
const nome = process.argv[3];

// Executar a funcao
createOrUpdateAdmin(email, nome);
