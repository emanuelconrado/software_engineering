import { adicionarDocumento } from "../../api/estabelecimentos.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../../api/firebase_config.js";  // Certifique-se de que o arquivo de configuração do Firestore está correto

const saveButton = document.getElementById('save');

saveButton.onclick = async (e) => {
  e.preventDefault();

  const nome = document.getElementById('restaurant-name').value;
  const rua = document.getElementById('restaurant-address').value;
  const numero = document.getElementById('restaurant-number').value;
  const cep = document.getElementById('restaurant-cep').value;
  const bairro = document.getElementById('restaurant-bairro').value;
  const telefone = document.getElementById('restaurant-phone').value;
  const descricao = document.getElementById('restaurant-description').value;
  const checkboxes = document.querySelectorAll('input[name="restricoes"]:checked');
  const restricoes = Array.from(checkboxes).map(checkbox => checkbox.value);

  function normalizarString(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")  // Remove acentos
      .replace(/[^a-zA-Z0-9]/g, "")     // Remove caracteres especiais
      .toLowerCase();                  // Converte para minúsculas
  }

  const nome_normalizado = normalizarString(nome);
  const dataCadastro = new Date(); // Gera a data/hora atual

  try {
    // Verifica se o restaurante já existe no banco de dados
    const querySnapshot = await getDocs(query(
      collection(db, 'estabelecimentos'),
      where('nome_normalizado', '==', nome_normalizado)
    ));

    if (!querySnapshot.empty) {
      // Se já existe um restaurante com o mesmo nome normalizado
      alert(`Já existe um restaurante com o nome "${nome}" cadastrado.`);
      return;  // Impede o cadastro
    }

    // Caso não exista, prossegue com o cadastro
    await adicionarDocumento('estabelecimentos', {
      nome,
      nome_normalizado,
      rua,
      numero,
      bairro,
      cep,
      telefone,
      descricao,
      restricoes,
      data: dataCadastro // Salva a data de cadastro
    });

    // Exibe o toast e recarrega a página após o sucesso
    mostrarToast(`Restaurante "${nome}" cadastrado em ${dataCadastro.toLocaleString('pt-BR')}`);
    
    // Recarga a página após 2 segundos para dar tempo de o toast aparecer
    setTimeout(() => {
      location.reload();  // Recarrega a página
    }, 2000);
    
  } catch (error) {
    console.error('Erro ao verificar duplicidade:', error);
    alert('Erro ao verificar duplicidade. Tente novamente.');
  }
};

// Função que mostra o "toast"
function mostrarToast(mensagem) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  toastMsg.textContent = mensagem;
  toast.classList.remove('hidden');
  toast.classList.add('show');

  // Esconde o toast depois de 4 segundos
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hidden');
  }, 4000);
}
