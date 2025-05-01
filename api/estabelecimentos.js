// script.js
import { db } from './firebase_config.js';
import {
  collection,
  getDocs,
  addDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Ler dados da collection
async function lerCollection(nomeCollection) {
  const ref = collection(db, nomeCollection);
  const snapshot = await getDocs(ref);
  const dados = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  console.log(dados);
  return dados;
}

// Adicionar novo documento
export async function adicionarDocumento(nomeCollection, dados) {
  try {
    const ref = collection(db, nomeCollection);
    const docRef = await addDoc(ref, dados);
    console.log("Documento adicionado com ID:", docRef.id);
  } catch (e) {
    console.error("Erro ao adicionar documento:", e);
  }
}

export async function adicionarSubDocumento(nomeCollectionPai, idDocumentoPai, nomeSubcolecao, dados) {
  try {
    const docPaiRef = doc(db, nomeCollectionPai, idDocumentoPai);
    const subCollectionRef = collection(docPaiRef, nomeSubcolecao);
    const docRef = await addDoc(subCollectionRef, dados);
    console.log("Documento adicionado na subcoleção com ID:", docRef.id);
  } catch (e) {
    console.error("Erro ao adicionar subdocumento:", e);
  }
}

// lerCollection('estabelecimentos')

// exemplo como adicionar um estabelecimento
// adicionarDocumento('estabelecimentos',{
  //  nome:'forneria',rua:'avenida tambau',numero:'99',cep:'586666',telefone:'83987491749',bairro:'manaira',restricoes:['lactose','ovo']
// })
