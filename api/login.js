import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getApp, initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { firebaseConfig } from "./firebase-env.js";

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Função de Cadastro
export async function cadastrarUsuario(email, senha) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log("Usuário cadastrado:", user.uid);
    return user; // Retorna o usuário
  } catch (error) {
    console.error("Erro ao cadastrar:", error.message);
    throw error; // Lança o erro para ser tratado no botão
  }
}

// Função de Login
export async function loginUsuario(email, senha) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;
    console.log("Usuário logado:", user.email);
    return user; // Retorna o usuário
  } catch (error) {
    console.error("Erro ao logar:", error.message);
    throw error; // Lança o erro para ser tratado no botão
  }
}
