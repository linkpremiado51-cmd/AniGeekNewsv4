/* scripts/config-firebase.js */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBC_ad4X9OwCHKvcG_pNQkKEl76Zw2tu6o",
    authDomain: "anigeeknews.firebaseapp.com",
    projectId: "anigeeknews",
    storageBucket: "anigeeknews.firebasestorage.app",
    messagingSenderId: "769322939926",
    appId: "1:769322939926:web:6eb91a96a3f74670882737",
    measurementId: "G-G5T8CCRGZT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.noticiasFirebase = [];
let linkProcessado = false;

/**
 * Normaliza os dados para garantir que a imagem sempre funcione,
 * não importa se o campo no Firebase se chama 'capa', 'thumb' ou 'imagem'.
 */
function normalizarNoticia(doc, nomeColecao) {
    const data = doc.data();
    return {
        id: doc.id,
        origem: nomeColecao,
        ...data,
        // Garante que 'thumb' sempre tenha uma URL válida para a busca e modal
        thumb: data.thumb || data.capa || data.imagem || 'https://anigeeknews.com/default-og.jpg'
    };
}

window.verificarGatilhoDeLink = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const idDesejado = urlParams.get('id');

    if (idDesejado && window.noticiasFirebase.length > 0) {
        const noticiaEncontrada = window.noticiasFirebase.find(n => n.id === idDesejado);
        
        if (noticiaEncontrada && typeof window.abrirModalNoticia === 'function') {
            window.abrirModalNoticia(noticiaEncontrada);
            linkProcessado = true; 
        }
    }
};

function sincronizarComBusca(nomeColecao) {
    onSnapshot(collection(db, nomeColecao), (snapshot) => {
        // Remove dados antigos daquela coleção específica para evitar duplicatas
        window.noticiasFirebase = window.noticiasFirebase.filter(item => item.origem !== nomeColecao);
        
        // Mapeia e normaliza os novos dados
        const novosDados = snapshot.docs.map(doc => normalizarNoticia(doc, nomeColecao));
        
        window.noticiasFirebase.push(...novosDados);
        
        // Reordena por data (se o campo 'data' existir)
        window.noticiasFirebase.sort((a, b) => (b.data || 0) - (a.data || 0));

        if (!linkProcessado) window.verificarGatilhoDeLink();
        
    }, (error) => console.error("Erro Firebase:", error));
}

const colecoesParaMonitorar = ["noticias", "lancamentos", "analises", "entrevistas", "podcast", "futebol"];
colecoesParaMonitorar.forEach(nome => sincronizarComBusca(nome));

window.addEventListener('popstate', window.verificarGatilhoDeLink);
