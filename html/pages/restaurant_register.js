import { adicionarDocumento } from "../../api/estabelecimentos.js";
const saveButton = document.getElementById('save')
saveButton.onclick=(e)=>{
    e.preventDefault()

    const nome = document.getElementById('restaurant-name').value
    const rua = document.getElementById('restaurant-address').value
    const numero = document.getElementById('restaurant-number').value
    const cep = document.getElementById('restaurant-cep').value
    const bairro = document.getElementById('restaurant-bairro').value
    const telefone = document.getElementById('restaurant-phone').value
    const descricao = document.getElementById('restaurant-description').value
    const checkboxes = document.querySelectorAll('input[name="restricoes"]:checked');
    const restricoes = Array.from(checkboxes).map(checkbox => checkbox.value);

    adicionarDocumento('estabelecimentos',{nome,rua,numero,bairro,cep,telefone,descricao,restricoes})
        .then(user => {
          // Se o login for bem-sucedido, redireciona para a página inicial
          alert("Restaurante cadastrado!");
          console.log('Restaurante cadastrado');
          
        })
        .catch(error => {
          // Se ocorrer um erro, exibe uma mensagem de erro no console
          console.error('Erro ao fazer cadastro:', error.message);
          alert("Cadastro não realizado.");
        });
}