import { cadastrarUsuario } from "../../api/login.js";

const cadastroButton = document.getElementById('cadastroButton');

cadastroButton.onclick = (e) => {
  e.preventDefault();

  const nome = document.getElementById('cadastroNome').value;
  const email = document.getElementById('cadastroEmail').value;
  const senha = document.getElementById('cadastroSenha').value;

  cadastrarUsuario(email, senha, nome)
    .then(user => {
      alert("Cadastro bem-sucedido!");
      console.log('Usuário cadastrado:', user.email);
      window.location.href = "login.html";
    })
    .catch(error => {
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
