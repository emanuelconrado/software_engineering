import { db } from '../../../api/firebase_config.js';
import { collection, addDoc, doc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

const form = document.getElementById('reviewForm');
const message = document.getElementById('message');
const restauranteId = localStorage.getItem('selectedRestaurantId');  // Verifique se o ID está correto

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nota = parseInt(document.getElementById('reviewRating').value);
  const comentario = document.getElementById('reviewComment').value.trim();

  console.log(restauranteId);

  if ( nota < 1 || nota > 5 || !comentario) {
    message.textContent = 'Preencha todos os campos corretamente.';
    return;
  }

  try {
    // Verifique se restaurantId é um valor válido antes de continuar
    if (!restauranteId) {
      message.textContent = 'ID do restaurante não encontrado.';
      return;
    }

    // Referência para o documento do restaurante
    const avaliacaoRef = doc(db, 'estabelecimentos', restauranteId, 'avaliacoes');
    
    // Verifique se a referência do restaurante é válida
    console.log('Restaurante:', avaliacaoRef);
    
    // Referência para a subcoleção 'avaliacoes' dentro do restaurante
    const avaliacoesCollectionRef = collection(avaliacaoRef, 'avaliacoes');
    
    // Verifique se a referência da subcoleção está correta
    console.log('Subcoleção Avaliações:', avaliacoesCollectionRef);

    // Adicionando a avaliação à subcoleção
    await addDoc(avaliacoesCollectionRef, {
      nota,
      comentario,
      autor: 'Anônimo',
      data: serverTimestamp(),
    });

    message.textContent = 'Avaliação enviada com sucesso!';
    form.reset();
  } catch (err) {
    console.error('Erro ao enviar avaliação:', err);
    message.textContent = 'Erro ao enviar avaliação.';
  }
});
