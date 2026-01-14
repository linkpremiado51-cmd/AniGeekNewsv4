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

// --- UNIFICAÇÃO GLOBAL PARA A BUSCA ---
window.noticiasFirebase = [];

/**
 * Função inteligente que sincroniza qualquer coleção com a lisTa global de busca
 * @param {string} nomeColecao - Nome da pasta no Firebase (ex: 'lancamentos')
 */
function sincronizarComBusca(nomeColecao) {
    onSnapshot(collection(db, nomeColecao), (snapshot) => {
        // Remove os itens antigos desta coleção para evitar duplicados na busca
        window.noticiasFirebase = window.noticiasFirebase.filter(item => item.origem !== nomeColecao);
        
        // Adiciona os itens novos marcando a origem
        snapshot.docs.forEach(doc => {
            window.noticiasFirebase.push({ 
                id: doc.id, 
                origem: nomeColecao, 
                ...doc.data() 
            });
        });
        
        console.log(`✅ [Busca] Sincronizado: ${nomeColecao} (${snapshot.size} itens)`);
    });
}

// Exportando ferramentas para uso em outros scripts
window.db = db;
window.collection = collection;
window.onSnapshot = onSnapshot;

// --- INICIALIZAÇÃO DAS ESCUTAS ---
// Agora a busca olha para as três coleções ao mesmo tempo
sincronizarComBusca("noticias");
sincronizarComBusca("lancamentos");
sincronizarComBusca("analises");

console.log("🔥 Motor AniGeekNews v2 Inicializado.");
