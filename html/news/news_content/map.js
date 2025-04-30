import { db } from '../../../api/firebase_config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let map;
let markers = [];

const mapSearchForm = document.getElementById('mapSearchForm');
const mapSearchInput = document.getElementById('mapSearchInput');

document.addEventListener('DOMContentLoaded', () => {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      map = L.map('map').setView([lat, lon], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.marker([lat, lon]).addTo(map)
        .bindPopup('Você está aqui!')
        .openPopup();

      carregarEnderecosDoFirebase();
    },
    function (error) {
      console.warn('Erro ao obter localização. Usando localização padrão.', error);
      map = L.map('map').setView([-23.55052, -46.633308], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      carregarEnderecosDoFirebase();
    }
  );
});

function normalizarString(str) {
  if (!str) return '';
  return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();
}

async function carregarEnderecosDoFirebase(input = '') {
  try {
    const termoBusca = normalizarString(input.trim());
    let docsMap = new Map();

    if (termoBusca === '') {
      const snapshot = await getDocs(collection(db, 'estabelecimentos'));
      snapshot.forEach(doc => docsMap.set(doc.id, doc.data()));
    } else {
      // Query por nome normalizado
      const queryNome = query(
        collection(db, 'estabelecimentos'),
        where('nome_normalizado', '>=', termoBusca),
        where('nome_normalizado', '<=', termoBusca + '\uf8ff')
      );

      // Query por restrição
      const queryRestricoes = query(
        collection(db, 'estabelecimentos'),
        where('restricoes', 'array-contains', termoBusca)
      );

      const [snapshotNome, snapshotRestricoes] = await Promise.all([
        getDocs(queryNome),
        getDocs(queryRestricoes)
      ]);

      // Combina os resultados sem duplicar
      snapshotNome.forEach(doc => docsMap.set(doc.id, doc.data()));
      snapshotRestricoes.forEach(doc => docsMap.set(doc.id, doc.data()));
    }

    // Renderiza os marcadores
    docsMap.forEach((data, id) => {
      const nome = data.nome || 'Restaurante sem nome';
      const restricoes = data.restricoes || [];
      const rua = data.rua || '';
      const numero = data.numero || '';
      const bairro = data.bairro || '';
      const endereco = `${rua}, ${numero}, ${bairro}`;

      buscarEndereco(endereco, nome, restricoes);
    });
  } catch (err) {
    console.error('Erro ao carregar restaurantes do Firebase:', err);
  }
}

mapSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const termo = mapSearchInput.value.trim();

  // Remove marcadores antigos
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  console.log(termo)

  carregarEnderecosDoFirebase(termo);
});


function buscarEndereco(endereco, nome, restricoes) {
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

      const restricoesFormatadas = restricoes.length
        ? `<br><strong>Restrições:</strong> ${restricoes.join(', ')}`
        : '<br><strong>Restrições:</strong> Nenhuma';

      const marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<strong>${nome}</strong><br>${endereco}${restricoesFormatadas}`);

      markers.push(marker);
    })
    .catch(() => console.error("Erro ao buscar o endereço."));
}
