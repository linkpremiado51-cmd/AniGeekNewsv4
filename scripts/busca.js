/* scripts/busca.js */

// Seleção dos elementos baseada no seu index.html
const inputBusca = document.getElementById('input-busca-global');
const surface = document.getElementById('search-results-surface');

/**
 * Renderiza os resultados na superfície flutuante abaixo da barra de busca
 */
function renderizarSuperficie(lista) {
    if (!surface) return;

    if (lista.length === 0) {
        surface.innerHTML = '<div style="padding:15px; font-size:12px; color:#888; text-align:center;">Nenhum resultado encontrado.</div>';
    } else {
        surface.innerHTML = lista.map(news => {
            // Tenta pegar a thumb do primeiro vídeo relacionado ou a principal, senão usa padrão
            const thumb = news.thumb || (news.relacionados && news.relacionados[0] ? news.relacionados[0].thumb : 'https://anigeeknews.com/default-og.jpg');
            
            return `
            <div class="result-item-list" onclick="window.focarNoticia('${news.id}')" style="cursor:pointer; display:flex; align-items:center; gap:10px; padding:10px; border-bottom:1px solid rgba(0,0,0,0.05);">
                <img src="${thumb}" class="result-img" style="width:50px; height:50px; object-fit:cover; border-radius:4px; flex-shrink:0;">
                <div class="result-info">
                    <div class="result-cat" style="color: ${news.cor || 'var(--primary)'}; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">${news.categoria}</div>
                    <h4 class="result-title" style="margin:2px 0 0 0; font-size:13px; font-weight:700; color:var(--text-main); line-height:1.2;">${news.titulo}</h4>
                </div>
            </div>`;
        }).join('');
    }
    surface.style.display = 'block';
}

/**
 * Lógica de filtragem enquanto o usuário digita
 */
if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        
        if (termo === "") { 
            if (surface) surface.style.display = 'none'; 
            return; 
        }

        // Filtra a lista centralizada pelo config-firebase.js que contém todas as coleções
        const filtradas = (window.noticiasFirebase || []).filter(n => 
            (n.titulo && n.titulo.toLowerCase().includes(termo)) || 
            (n.categoria && n.categoria.toLowerCase().includes(termo)) ||
            (n.resumo && n.resumo.toLowerCase().includes(termo))
        );

        renderizarSuperficie(filtradas);
    });
}

/**
 * Função chamada ao clicar em um resultado da busca
 */
window.focarNoticia = (id) => {
    // 1. Limpa a interface de busca
    if (surface) surface.style.display = 'none';
    if (inputBusca) inputBusca.value = "";
    
    // 2. Localiza a notícia no banco de dados global já carregado
    const noticia = (window.noticiasFirebase || []).find(n => n.id === id);
    
    if (noticia) {
        // 3. Atualiza a URL de forma silenciosa para permitir compartilhamento
        const url = new URL(window.location);
        url.searchParams.set('id', id);
        window.history.pushState({ id: id }, '', url);

        // 4. Dispara o Modal Global (definido no navegacao.js)
        if (typeof window.abrirModalNoticia === 'function') {
            window.abrirModalNoticia(noticia);
        } else {
            console.error("Erro: Função abrirModalNoticia não encontrada.");
        }
    }
};

/**
 * Fecha a superfície de resultados se clicar fora da barra de busca
 */
document.addEventListener('click', (e) => {
    if (surface && !e.target.closest('.search-bar-wrapper')) {
        surface.style.display = 'none';
    }
});

console.log("🔍 Busca Global: Integrada ao Modal com sucesso.");
