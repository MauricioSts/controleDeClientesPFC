// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ⚙️ Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBqCntvBBI-NiYDY4xcRk_fCoHBN1xOnsI",
  authDomain: "pfcsports-ce4f6.firebaseapp.com",
  projectId: "pfcsports-ce4f6",
  storageBucket: "pfcsports-ce4f6.firebasestorage.app",
  messagingSenderId: "272433288995",
  appId: "1:272433288995:web:bdec4c84b1bf6baa1f9e96",
  measurementId: "G-P9N485EFBM",
};

// 🚀 Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// 🔥 Inicializa o Firestore e Auth e exporta
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
