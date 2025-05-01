// restaurant_search.js
import { db } from '../../api/firebase_config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Elementos da página
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const restaurantsList = document.getElementById('restaurantsList');

// Função para normalizar strings
function normalizarString(str) {
    if (!str) return '';
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase();
}

// Carregar todos os restaurantes ao iniciar a página
document.addEventListener('DOMContentLoaded', carregarRestaurantes);

// Função para carregar todos os restaurantes
async function carregarRestaurantes() {
    try {
        restaurantsList.innerHTML = '<p class="loading-message">Carregando restaurantes...</p>';
        
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
    const termoBusca = normalizarString(searchInput.value.trim());
    
    if (!termoBusca) {
        carregarRestaurantes();
        return;
    }
    
    try {
        restaurantsList.innerHTML = '<p class="loading-message">Buscando restaurantes...</p>';
        
        const nomes = query(
            collection(db, 'estabelecimentos'),
            where('nome', '>=', termoBusca),
            where('nome', '<=', termoBusca + '\uf8ff')
        );

        const restricoes = query(
            collection(db, 'estabelecimentos'),
            where('restricoes', 'array-contains', termoBusca)
        );
        
        
        const [snapshotNome, snapshotRestricoes] = await Promise.all([
            getDocs(nomes),
            getDocs(restricoes)
        ]);

        const docsMap = new Map();
        snapshotNome.forEach(doc => docsMap.set(doc.id, doc.data()));
        snapshotRestricoes.forEach(doc => docsMap.set(doc.id, doc.data()));

        const querySnapshot = Array.from(docsMap.values());

        if (querySnapshot.length === 0) {
            // Se não encontrou nada, faz filtro no cliente
            const allRestaurants = await getDocs(collection(db, 'estabelecimentos'));
            let html = '';
            let encontrados = false;
            
            allRestaurants.forEach(doc => {
                const restaurante = {
                    id: doc.id,
                    ...doc.data()
                };
                
                const nomeNormalizado = normalizarString(restaurante.nome || '');
                
                if (nomeNormalizado.includes(termoBusca)) {
                    html += criarCardRestaurante(restaurante);
                    encontrados = true;
                }
            });
            
            restaurantsList.innerHTML = encontrados
                ? html
                : '<p class="no-results">Nenhum restaurante encontrado com esse nome.</p>';
        } else {
            let html = '';
            docsMap.forEach((data, id) => {
                const restaurante = {
                    id,
                    ...data
                };
                html += criarCardRestaurante(restaurante);
            });

            restaurantsList.innerHTML = html;
        }
        
        configurarBotoesRestaurante();
        configurarPainelLateral();
    } catch (error) {
        console.error("Erro na busca:", error);
        restaurantsList.innerHTML = '<p class="error-message">Erro na busca. Tente novamente.</p>';
    }
});

function formatarData(timestamp) {
    if (!timestamp || !timestamp.toDate) return 'Data desconhecida';
    
    const data = timestamp.toDate();
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}


// Restante do código permanece igual...
function criarCardRestaurante(restaurante) {
    return `
        <div class="restaurant-card"
             data-id="${restaurante.id}"
             data-rua="${restaurante.rua || ''}"
             data-numero="${restaurante.numero || ''}"
             data-bairro="${restaurante.bairro || ''}"
             data-cep="${restaurante.cep || ''}">
             
            <h3 class="restaurant-title">${restaurante.nome || 'Nome não informado'}</h3>
            
            <div class="restaurant-details">
                <p><strong>Endereço:</strong> ${restaurante.rua || ''}, ${restaurante.numero || ''} - ${restaurante.bairro || ''}</p>
                <p><strong>CEP:</strong> ${restaurante.cep || ''}</p>
                <p><strong>Telefone:</strong> ${restaurante.telefone || ''}</p>
                <p><strong>Restrições atendidas:</strong> ${restaurante.restricoes ? restaurante.restricoes.join(', ') : 'Nenhuma informação'}</p>
            </div>

            <div class="restaurant-actions">
                <a href="#" class="restaurant-button go-button">Como chegar lá?</a>
                <a href="#" class="restaurant-button menu-button">Avaliações</a>
            </div>
        </div>
    `;
}

function configurarBotoesRestaurante() {
    document.querySelectorAll('.menu-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.restaurant-card');
            const restaurantId = card.getAttribute('data-id');

            localStorage.setItem('selectedRestaurantId', restaurantId);
            window.open('../news/news_content/reviews_search.html', '_blank');
        });
    });

    document.querySelectorAll('.go-button').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.restaurant-card');
            const restaurantId = card.getAttribute('data-id');
            const rua = card.getAttribute('data-rua');
            const numero = card.getAttribute('data-numero');
            const bairro = card.getAttribute('data-bairro');
            const endereco = `${rua}, ${numero} ${bairro}`;
            const destino = encodeURIComponent(endereco);
            const url = `https://www.google.com/maps/dir/?api=1&destination=${destino}`;
            window.open(url, '_blank');
        });
    });

    document.querySelectorAll('.restaurant-card').forEach(card => {
        card.addEventListener('mouseenter', async (e) => {
            const restaurantId = card.getAttribute('data-id');
    
            // Verifica se já existe o painel de avaliações
            let existingContainer = card.querySelector('.review-container');
            if (existingContainer) {
                return; // Se o painel já estiver aberto, não faz nada
            }
    
            // Cria o container para as avaliações
            const reviewContainer = document.createElement('div');
            reviewContainer.classList.add('review-container');
            reviewContainer.innerHTML = '<p>Carregando avaliações...</p>';
            card.appendChild(reviewContainer);
    
            try {
                const reviewsRef = collection(db, 'estabelecimentos', restaurantId, 'avaliacoes');
                const snapshot = await getDocs(reviewsRef);
    
                if (snapshot.empty) {
                    reviewContainer.innerHTML = '<p>Este restaurante ainda não possui avaliações.</p>';
                    return;
                }
    
                let html = '<h4>Avaliações:</h4>';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    html += `
                        <div class="review">
                            <p><strong>Autor:</strong> ${data.autor || 'Anônimo'}</p>
                            <p><strong>Nota:</strong> ${data.nota || 'Não informada'}</p>
                            <p><strong>Comentário:</strong> ${data.comentario || 'Sem comentário'}</p>
                            <p><strong>Data da avaliação:</strong> ${formatarData(data.data) || 'Sem data'}</p>
                        </div>
                    `;
                });
    
                reviewContainer.innerHTML = html;
            } catch (err) {
                console.error('Erro ao carregar avaliações:', err);
                reviewContainer.innerHTML = '<p>Erro ao carregar avaliações.</p>';
            }
        });
    
        // Quando o mouse sai do card, removemos o painel de avaliações
        card.addEventListener('mouseleave', () => {
            const reviewContainer = card.querySelector('.review-container');
            if (reviewContainer) {
                reviewContainer.remove();
            }
        });
    }); 
}

function configurarPainelLateral() {
    document.querySelectorAll('.restaurant-card').forEach(card => {
        const panel = card.querySelector('.side-panel');

        // Ao passar o mouse sobre o card, mostrar o painel lateral
        card.addEventListener('mouseover', () => {
            panel.style.display = 'block'; // Mostrar o painel
        });

        // Ao sair o mouse do card, esconder o painel lateral
        card.addEventListener('mouseout', () => {
            panel.style.display = 'none'; // Esconder o painel
        });
    });
}

// Chama a função para configurar os eventos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    configurarPainelLateral();
});   