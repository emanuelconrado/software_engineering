import { adicionarDocumento } from "../../api/estabelecimentos.js";
const saveButton = document.getElementById('save')
saveButton.onclick=(e)=>{
    e.preventDefault()
    const nome = document.getElementById('restaurant-name').value
    const rua = document.getElementById('restaurant-address').value
    const numero = document.getElementById('restaurant-number').value
    const cep = document.getElementById('restaurant-cep').value
    const telefone = document.getElementById('restaurant-phone').value
    const descricao = document.getElementById('restaurant-description').value
    const checkboxes = document.querySelectorAll('input[name="restricoes"]:checked');
    const restricoes = Array.from(checkboxes).map(checkbox => checkbox.value);
    adicionarDocumento('estabelecimentos',{nome,rua,numero,cep,telefone,descricao,restricoes})
}