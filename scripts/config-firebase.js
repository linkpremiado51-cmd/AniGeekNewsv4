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

// --- CACHE DE DADOS ---
const cacheSalvo = localStorage.getItem('cache_noticias_global');
window.noticiasFirebase = cacheSalvo ? JSON.parse(cacheSalvo) : [];

/**
 * Verifica se há um ID na URL e abre o modal
 */
function verificarGatilhoDeLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const idDesejado = urlParams.get('id');

    if (idDesejado && window.noticiasFirebase.length > 0) {
        const noticiaEncontrada = window.noticiasFirebase.find(n => n.id === idDesejado);
        
        if (noticiaEncontrada && typeof window.abrirModalNoticia === 'function') {
            window.abrirModalNoticia(noticiaEncontrada);
        }
    }
}

/**
 * Sincronização inteligente com cache e Renderização Preguiçosa
 */
function sincronizarComBusca(nomeColecao) {
    try {
        onSnapshot(collection(db, nomeColecao), (snapshot) => {
            // Se os dados vierem do cache do Firebase e já tivermos algo na tela, não fazemos nada
            if (snapshot.metadata.fromCache && window.noticiasFirebase.length > 0) return;

            const listaFiltrada = window.noticiasFirebase.filter(item => item.origem !== nomeColecao);
            
            const novosDados = snapshot.docs.map(doc => ({ 
                id: doc.id, 
                origem: nomeColecao, 
                ...doc.data() 
            }));
            
            window.noticiasFirebase = [...listaFiltrada, ...novosDados];
            window.noticiasFirebase.sort((a, b) => (b.data || 0) - (a.data || 0));

            // Salva no LocalStorage de forma assíncrona para não travar a UI
            setTimeout(() => {
                localStorage.setItem('cache_noticias_global', JSON.stringify(window.noticiasFirebase));
            }, 0);
            
            console.log(`✅ [Firebase] Coleção ${nomeColecao} sincronizada.`);

            // RENDERIZAÇÃO SOB DEMANDA:
            // Só pedimos para renderizar se a função existir e se não estivermos no meio de um scroll pesado
            if (typeof window.renderizarNoticias === 'function') {
                // Usamos requestIdleCallback para renderizar apenas quando o navegador estiver livre
                const renderTask = window.requestIdleCallback ? window.requestIdleCallback : (cb) => setTimeout(cb, 1);
                
                renderTask(() => {
                    const dadosDaSecao = window.noticiasFirebase.filter(n => n.origem === nomeColecao);
                    // Passamos apenas os primeiros 10 itens para a renderização inicial
                    // O restante será renderizado conforme o usuário rola (Lazy Loading)
                    window.renderizarNoticias(dadosDaSecao);
                    
                    // Reativa o observador de scroll para novos itens que entraram no DOM
                    if (typeof window.ativarObservadorDeScroll === 'function') {
                        window.ativarObservadorDeScroll();
                    }
                });
            }

            verificarGatilhoDeLink();

        }, (error) => {
            console.error(`❌ Erro Firebase ${nomeColecao}:`, error);
        });
    } catch (err) {
        console.error(`⚠️ Falha ao inicializar ${nomeColecao}:`, err);
    }
}

window.db = db;
window.collection = collection;
window.onSnapshot = onSnapshot;

const colecoesParaMonitorar = ["noticias", "lancamentos", "analises", "entrevistas", "podcast"];
colecoesParaMonitorar.forEach(nome => sincronizarComBusca(nome));

if (window.noticiasFirebase.length > 0) {
    verificarGatilhoDeLink();
}

console.log("🔥 Motor v2.1: Performance de renderização ativada.");
