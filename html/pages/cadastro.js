import { cadastrarUsuario } from "../../api/login.js"; // Supondo que essas funções estejam em um arquivo separado

const cadastroButton = document.getElementById('cadastroButton');
// Cadastro de usuário
cadastroButton.onclick = (e) => {
  e.preventDefault(); // Impede o envio do formulário
  const email = document.getElementById('cadastroEmail').value;
  const senha = document.getElementById('cadastroSenha').value;
  
  // Chama a função de cadastro (cadastrarUsuario está em auth.js)
  cadastrarUsuario(email, senha)
  .then(user => {
    // Se o login for bem-sucedido, redireciona para a página inicial
    alert("Cadastro bem sucessido");
    console.log('Usuário cadastrado:', user.email);
    window.location.href = "login.html"; // Redireciona para a página inicial
  })
  .catch(error => {
    // Se ocorrer um erro, exibe uma mensagem de erro no console
    let mensagem = "";

    switch (error.code) {
      case "auth/email-already-in-use":
        mensagem = "Este e-mail já está em uso.";
        break;
      case "auth/invalid-email":
        mensagem = "O e-mail informado é inválido.";
        break;
      case "auth/weak-password":
        mensagem = "A senha deve ter pelo menos 6 caracteres.";
        break;
      default:
        mensagem = "Erro ao se cadastrar. Tente novamente.";
    }

    alert(mensagem);
    console.error("Erro ao se cadastrar:", error.message);
  });
};