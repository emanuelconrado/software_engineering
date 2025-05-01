import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../api/firebase_config.js";
import { auth } from "../api/firebase_config.js";

// Função de Cadastro
export async function cadastrarUsuario(email, senha, nome){
  try {
    // Cria o usuário no Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Cria um documento no Firestore com os dados do usuário
    await setDoc(doc(db, "usuarios", user.uid), {
      nome: nome,
      email: email,
      createdAt: new Date(),
    });

    return user; // Retorna o usuário criado
  } catch (error) {
    throw error; // Lança o erro para ser tratado no front-end
  }
};

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
