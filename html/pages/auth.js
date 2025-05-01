import { loginUsuario } from "../../api/login.js";

const loginButton = document.getElementById('loginButton');

// Login de usuário
loginButton.onclick = (e) => {
  e.preventDefault(); // Impede o envio do formulário

  // Obtém os valores dos campos de email e senha
  const email = document.getElementById('loginEmail').value;
  const senha = document.getElementById('loginSenha').value;

  // Chama a função de login que está no arquivo de API
  loginUsuario(email, senha)
    .then(user => {
      // Se o login for bem-sucedido, redireciona para a página inicial
      localStorage.setItem('user', user)
      console.log('Usuário logado:', user.email);
      window.location.href = "../index.html"; // Redireciona para a página inicial
    })
    .catch(error => {
      // Se ocorrer um erro, exibe uma mensagem de erro no console
      console.error('Erro ao fazer login:', error.message);
      alert("E-mail ou senha inválidos. Tente novamente.");
    });
};

