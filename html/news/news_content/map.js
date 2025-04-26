import { db } from '../../../api/firebase_config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let map; // necessário no escopo global
let markers = [];

document.addEventListener('DOMContentLoaded', () => {
  // Tenta obter a localização do usuário e centralizar o mapa nela
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Inicializa o mapa na posição do usuário
      map = L.map('map').setView([lat, lon], 14); // Aumenta o zoom para 14 (mais próximo)
      
      // Adiciona o mapa base
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Adiciona um marcador na posição atual do usuário
      L.marker([lat, lon]).addTo(map)
        .bindPopup('Você está aqui!')
        .openPopup();

      // Carregar os endereços do Firebase após a inicialização do mapa
      carregarEnderecosDoFirebase();
    },
    function (error) {
      // Se o usuário negar ou ocorrer erro, usa uma posição padrão (São Paulo)
      console.warn('Erro ao obter localização. Usando localização padrão.', error);

      // Posição padrão
      map = L.map('map').setView([-23.55052, -46.633308], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Carregar os endereços do Firebase após a inicialização do mapa
      carregarEnderecosDoFirebase();
    }
  );
});

function buscarEndereco(endereco, nome) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        console.warn(`Endereço não encontrado para ${nome}`);
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);

      const marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<strong>${nome}</strong><br>${endereco}`);

      markers.push(marker);
    })
    .catch(() => console.error("Erro ao buscar o endereço."));
}

async function carregarEnderecosDoFirebase() {
  try {
    const snapshot = await getDocs(collection(db, 'estabelecimentos'));

    snapshot.forEach(doc => {
      const data = doc.data();
      const nome = data.nome || 'Restaurante sem nome';
      const rua = data.rua || '';
      const numero = data.numero || '';
      const bairro = data.bairro || '';
      const cidade = data.cidade || 'São Paulo';
      const estado = data.estado || 'SP';
      const endereco = `${rua}, ${numero}, ${bairro}`;

      buscarEndereco(endereco, nome);
    });
  } catch (err) {
    console.error('Erro ao carregar restaurantes do Firebase:', err);
  }
}
