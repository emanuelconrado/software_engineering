import { auth, db } from '../../../api/firebase_config.js'; // Importe a configuração do Firebase
import { doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { adicionarSubDocumento } from '../../../api/estabelecimentos.js'

const form = document.getElementById('reviewForm');
const message = document.getElementById('message');
const restauranteId = localStorage.getItem('selectedRestaurantId'); 

let idAutor = 'Anônimo';


form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nota = parseInt(document.getElementById('reviewRating').value);
  const comentario = document.getElementById('reviewComment').value.trim();

  if (nota < 1 || nota > 5 || !comentario) {
    message.textContent = 'Preencha todos os campos corretamente.';
    return;
  }

  console.log(idAutor)

  const userRef = doc(db, 'usuarios', idAutor);
  const userSnap = await getDoc(userRef);


  const dados = userSnap.data();

  try {
    // Verifique se restaurantId é um valor válido antes de continuar
    if (!restauranteId) {
      message.textContent = 'ID do restaurante não encontrado.';
      return;
    }


    // Cria o novo documento dentro da subcoleção
    await adicionarSubDocumento('estabelecimentos', restauranteId, 'avaliacoes', {
      nota: nota,
      comentario: comentario,
      autor: dados.nome,
      data:  new Date()
    });

    message.textContent = 'Avaliação enviada com sucesso!';
    form.reset();
  } catch (err) {
    console.error('Erro ao enviar avaliação:', err);
    message.textContent = 'Erro ao enviar avaliação.';
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    idAutor = user.uid
  } else {
    window.location.href = 'login.html'; // Se o usuário não estiver autenticado, redireciona para login
  }
});