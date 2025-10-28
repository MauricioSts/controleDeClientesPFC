// Vercel Serverless Function para criar requisição de upgrade
import admin from 'firebase-admin';

// Inicializar Firebase Admin apenas uma vez
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

const db = admin.firestore();

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório' });
  }

  try {
    console.log('📝 Criando upgrade para:', email);
    
    // Criar documento na coleção pending_upgrades
    const docRef = await db.collection('pending_upgrades').add({
      email: email,
      status: 'pending',
      plan: 'pro',
      processed: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Upgrade criado com ID:', docRef.id);

    return res.status(200).json({ 
      success: true, 
      id: docRef.id,
      message: 'Requisição criada com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao criar upgrade:', error);
    return res.status(500).json({ 
      error: 'Erro ao criar requisição',
      details: error.message 
    });
  }
}

