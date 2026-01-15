/* scripts/config-firebase.js */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* 🔥 ADIÇÃO SEGURA: Firebase Auth */
import { 
    getAuth 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

/* 🔥 Firestore (JÁ EXISTENTE) */
const db = getFirestore(app);

/* 🔥 Auth (NOVO – NÃO QUEBRA NADA) */
const auth = getAuth(app);

// --- UNIFICAÇÃO GLOBAL PARA A BUSCA E MODAL ---
window.noticiasFirebase = [];
let linkProcessado = false; // Evita que o modal fique reabrindo sozinho em updates do Firebase

/**
 * Verifica se há um ID na URL e abre o modal se a notícia for encontrada.
 */
window.verificarGatilhoDeLink = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const idDesejado = urlParams.get('id');

    if (idDesejado && window.noticiasFirebase.length > 0) {
        const noticiaEncontrada = window.noticiasFirebase.find(n => n.id === idDesejado);

        if (noticiaEncontrada && typeof window.abrirModalNoticia === 'function') {
            console.log("🎯 Link detectado! Abrindo modal para:", idDesejado);
            window.abrirModalNoticia(noticiaEncontrada);
            linkProcessado = true;
        }
    }
};

/**
 * Sincronização inteligente multisseção
 */
function sincronizarComBusca(nomeColecao) {
    try {
        onSnapshot(collection(db, nomeColecao), (snapshot) => {
            // 1. Remove apenas os dados dessa coleção
            window.noticiasFirebase = window.noticiasFirebase.filter(
                item => item.origem !== nomeColecao
            );

            // 2. Injeta os novos dados
            const novosDados = snapshot.docs.map(doc => ({
                id: doc.id,
                origem: nomeColecao,
                ...doc.data()
            }));

            window.noticiasFirebase.push(...novosDados);

            // 3. Ordena tudo por data
            window.noticiasFirebase.sort(
                (a, b) => (b.data || 0) - (a.data || 0)
            );

            console.log(`✅ [Firebase] Sincronizado: ${nomeColecao}`);

            // 4. Gatilho de link
            if (!linkProcessado) {
                window.verificarGatilhoDeLink();
            }

        }, (error) => {
            console.error(`❌ Erro ao sincronizar ${nomeColecao}:`, error);
        });
    } catch (err) {
        console.error(`⚠️ Falha ao inicializar coleção ${nomeColecao}:`, err);
    }
}

// Expõe para as páginas de seção (MANTIDO)
window.db = db;
window.collection = collection;
window.onSnapshot = onSnapshot;

/* 🔥 NOVO: expõe auth globalmente (opcional, não invasivo) */
window.auth = auth;

// 🔥 COLEÇÕES ATIVAS (AGORA COM FUTEBOL)
const colecoesParaMonitorar = [
    "noticias",
    "lancamentos",
    "analises",
    "entrevistas",
    "podcast",
    "futebol",
    "smartphones",
];

colecoesParaMonitorar.forEach(nome => sincronizarComBusca(nome));

// Escuta navegação do navegador (voltar / avançar)
window.addEventListener('popstate', window.verificarGatilhoDeLink);

console.log("🔥 Motor AniGeekNews v2: Firestore + Auth inicializados.");
