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
import { readFileSync } from 'fs';

dotenv.config();

// Usar a mesma URI da API (MONGO_URI). Fallback para practika_db
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/practika_db';

// Inicializar Firebase Admin
let firebaseAvailable = false;
try {
  const serviceAccount = JSON.parse(
    readFileSync('./practika-app-1fcf9-firebase-adminsdk-fbsvc-08e6142e6c.json', 'utf8')
  );
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  firebaseAvailable = true;
  console.log('Firebase Admin configurado com sucesso\n');
} catch (error) {
  console.log('\nERRO: Firebase Admin nao esta configurado!');
  console.log('============================================================');
  console.log('Para criar utilizadores com senha, precisas do Firebase configurado.');
  console.log('\nPASSOS PARA CONFIGURAR:');
  console.log('   1. Vai a: https://console.firebase.google.com');
  console.log('   2. Seleciona o teu projeto');
  console.log('   3. Vai a Project Settings > Service Accounts');
  console.log('   4. Clica em "Generate new private key"');
  console.log('   5. Guarda o ficheiro como "serviceAccountKey.json"');
  console.log('   6. Coloca na pasta: ' + process.cwd());
  console.log('   7. Executa este script novamente');
  console.log('============================================================\n');
  process.exit(1);
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
      const senhaTemporaria = 'Admin123!';
      
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
          console.log('   Email: ' + email);
          console.log('   Senha temporaria: ' + senhaTemporaria);
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
      if (firebaseUserCreated) {
        console.log('   Senha: ' + senhaTemporaria);
        console.log('\n   IMPORTANTE: Altere a senha apos o primeiro login!');
      } else {
        console.log('   Senha: (usa a senha que ja tens configurada no Firebase)');
      }
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
