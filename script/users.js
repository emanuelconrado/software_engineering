import { auth, db } from '../api/firebase_config.js'; // Importe a configuração do Firebase
import { doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Função para carregar os dados do usuário no formulário
const loadUserProfile = async (user) => {
    const userEmail = document.getElementById('userEmail');
    const userName = document.getElementById('userName');
    const editNome = document.getElementById('editNome');
  
    // Preencher o e-mail com o do usuário autenticado
    userEmail.textContent = user.email;
  
    try {
      // Buscar os dados do Firestore
      const userRef = doc(db, 'usuarios', user.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const dados = userSnap.data();
  
        userName.textContent = dados.nome || 'Não definido';
        editNome.value = dados.nome || '';
      } else {
        console.warn("Usuário não encontrado no Firestore.");
        userName.textContent = 'Não definido';
        editNome.value = '';
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error.message);
      userName.textContent = 'Erro';
    }
  };

// Função para salvar as alterações feitas no perfil
const saveUserProfile = async () => {
  const user = auth.currentUser;
  const newName = document.getElementById('editNome').value;

  try {
    if (user) {
      // Atualiza o nome e email no Firestore
      const userRef = doc(db, "usuarios", user.uid);
      await updateDoc(userRef, {
        nome: newName,
      });

      alert('Perfil atualizado com sucesso!');
      loadUserProfile(user); // Atualiza a página com os dados novos
    }
  } catch (error) {
    console.error("Erro ao salvar perfil:", error.message);
    alert("Erro ao salvar perfil. Tente novamente.");
  }
};

// Observa o estado de autenticação para carregar o perfil
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadUserProfile(user);
  } else {
    window.location.href = 'login.html'; // Se o usuário não estiver autenticado, redireciona para login
  }
});

// Evento para salvar as mudanças quando o botão for clicado
document.getElementById('saveButton').onclick = saveUserProfile;
