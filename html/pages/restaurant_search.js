// restaurant_search.js
import { db } from '../../api/firebase_config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Elementos da página
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const restaurantsList = document.getElementById('restaurantsList');

// Carregar todos os restaurantes ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarRestaurantes);

// Função para carregar todos os restaurantes
async function carregarRestaurantes() {
    try {
        const querySnapshot = await getDocs(collection(db, 'estabelecimentos'));
        
        if (querySnapshot.empty) {
            restaurantsList.innerHTML = '<p class="no-results">Nenhum restaurante cadastrado.</p>';
            return;
        }
        
        let html = '';
        querySnapshot.forEach(doc => {
            const restaurante = {
                id: doc.id,
                ...doc.data()
            };
            html += criarCardRestaurante(restaurante);
        });
        
        restaurantsList.innerHTML = html;
        configurarBotoesRestaurante();
    } catch (error) {
        console.error("Erro ao carregar restaurantes:", error);
        restaurantsList.innerHTML = '<p class="error-message">Erro ao carregar restaurantes. Tente novamente.</p>';
    }
}

// Função para buscar restaurantes por nome
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const termoBusca = searchInput.value.trim().toLowerCase();
    
    if (!termoBusca) {
        carregarRestaurantes();
        return;
    }
    
    try {
        const q = query(
            collection(db, 'estabelecimentos'),
            where('nome', '>=', termoBusca),
            where('nome', '<=', termoBusca + '\uf8ff')
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            restaurantsList.innerHTML = '<p class="no-results">Nenhum restaurante encontrado com esse nome.</p>';
            return;
        }
        
        let html = '';
        querySnapshot.forEach(doc => {
            const restaurante = {
                id: doc.id,
                ...doc.data()
            };
            html += criarCardRestaurante(restaurante);
        });
        
        restaurantsList.innerHTML = html;
        configurarBotoesRestaurante();
    } catch (error) {
        console.error("Erro na busca:", error);
        restaurantsList.innerHTML = '<p class="error-message">Erro na busca. Tente novamente.</p>';
    }
});

// Função para criar o HTML de um card de restaurante
function criarCardRestaurante(restaurante) {
    return `
        <div class="restaurant-card"
             data-id="${restaurante.id}"
             data-rua="${restaurante.rua || ''}"
             data-numero="${restaurante.numero || ''}"
             data-bairro="${restaurante.bairro || ''}"
             data-cep="${restaurante.cep || ''} >
             
            <h3 class="restaurant-title">${restaurante.nome || 'Nome não informado'}</h3>
            
            <div class="restaurant-details">
                <p><strong>Endereço:</strong> ${restaurante.rua || ''}, ${restaurante.numero || ''} - ${restaurante.bairro || ''}</p>
                <p><strong>CEP:</strong> ${restaurante.cep || ''}</p>
                <p><strong>Telefone:</strong> ${restaurante.telefone || ''}</p>
                <p><strong>Restrições atendidas:</strong> ${restaurante.restricoes ? restaurante.restricoes.join(', ') : 'Nenhuma informação'}</p>
            </div>

            <div class="restaurant-actions">
                <a href="#" class="restaurant-button go-button">Como chegar lá?</a>
                <a href="#" class="restaurant-button menu-button">Cardápio</a>
            </div>
        </div>
    `;
}

// Configurar os event listeners dos botões
function configurarBotoesRestaurante() {
    document.querySelectorAll('.go-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.restaurant-card');
            const restaurantId = card.getAttribute('data-id');
            console.log('Redirecionar para restaurante ID:', restaurantId);
            // Lógica de redirecionamento para o restaurante
            const rua = card.getAttribute('data-rua')
            const numero = card.getAttribute('data-numero')
            const bairro = card.getAttribute('data-bairro')
            const endereco = `${rua}, ${numero} ${bairro}`;

            const destino = encodeURIComponent(endereco);
            console.log(endereco)
            const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
            window.open(url, '_blank');
        });
    });

    document.querySelectorAll('.menu-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.restaurant-card');
            const restaurantId = card.getAttribute('data-id');
            console.log('Abrir cardápio do restaurante ID:', restaurantId);
            // Lógica para abrir o cardápio
        });
    });
}