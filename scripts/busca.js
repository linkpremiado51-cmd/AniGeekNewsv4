/* scripts/busca.js */

const inputBusca = document.getElementById('input-busca-global');
const surface = document.getElementById('search-results-surface');
let timeoutBusca = null;

/**
 * Renderiza os resultados na superfície flutuante
 */
function renderizarSuperficie(lista) {
    if (!surface) return;

    if (lista.length === 0) {
        surface.innerHTML = '<div style="padding:20px; font-size:13px; color:#999; text-align:center; font-family:sans-serif;">Nenhum resultado para sua busca.</div>';
    } else {
        surface.innerHTML = lista.map(news => {
            // Usamos a propriedade .thumb que já foi normalizada no config-firebase.js
            // Se por algum motivo não houver, mantemos o fallback seguro.
            const imagemParaExibir = news.thumb || 'https://anigeeknews.com/default-og.jpg';
            
            return `
            <div class="result-item-list" 
                 onclick="window.focarNoticia('${news.id}')" 
                 style="cursor:pointer; display:flex; align-items:center; gap:12px; padding:12px; border-bottom:1px solid rgba(0,0,0,0.05); transition: background 0.2s;">
                
                <img src="${imagemParaExibir}" 
                     alt="${news.titulo}"
                     style="width:55px; height:55px; object-fit:cover; border-radius:8px; flex-shrink:0; background:#f0f0f0;" 
                     onerror="this.src='https://anigeeknews.com/default-og.jpg'">
                
                <div class="result-info" style="flex:1; overflow:hidden;">
                    <div class="result-cat" style="color: ${news.cor || '#ff0000'}; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">
                        ${news.categoria || 'NOTÍCIA'}
                    </div>
                    <h4 class="result-title" style="margin:0; font-size:14px; font-weight:700; color:#1a1a1a; line-height:1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${news.titulo}
                    </h4>
                </div>
            </div>`;
        }).join('');
    }
    surface.style.display = 'block';
}

/**
 * Filtro com Debounce (Melhor performance)
 */
if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
        clearTimeout(timeoutBusca);
        const termo = e.target.value.toLowerCase().trim();
        
        if (termo === "") { 
            if (surface) surface.style.display = 'none'; 
            return; 
        }

        timeoutBusca = setTimeout(() => {
            // Filtra no cache global unificado
            const filtradas = (window.noticiasFirebase || []).filter(n => 
                (n.titulo && n.titulo.toLowerCase().includes(termo)) || 
                (n.categoria && n.categoria.toLowerCase().includes(termo)) ||
                (n.resumo && n.resumo.toLowerCase().includes(termo))
            ).slice(0, 8); 

            renderizarSuperficie(filtradas);
        }, 150);
    });

    inputBusca.addEventListener('click', () => {
        if (inputBusca.value.trim() !== "") surface.style.display = 'block';
    });
}

/**
 * Aciona o Modal Global
 */
window.focarNoticia = (id) => {
    if (surface) surface.style.display = 'none';
    if (inputBusca) inputBusca.value = "";
    
    // Busca o objeto completo no cache global
    const noticia = (window.noticiasFirebase || []).find(n => n.id === id);
    
    if (noticia) {
        // Envia para o Modal Manager (ele cuidará da playlist e da cor dinâmica)
        if (typeof window.abrirModalNoticia === 'function') {
            window.abrirModalNoticia(noticia);
        } else {
            console.error("❌ O modal-manager.js não foi carregado corretamente.");
        }
    }
};

/**
 * Fecha ao clicar fora
 */
document.addEventListener('click', (e) => {
    if (surface && !e.target.closest('.search-bar-wrapper')) {
        surface.style.display = 'none';
    }
});
