/* scripts/busca.js */

// Seleção dos elementos baseada no seu index.html
const inputBusca = document.getElementById('input-busca-global');
const surface = document.getElementById('search-results-surface');
let timeoutBusca = null;

/**
 * Renderiza os resultados na superfície flutuante
 */
function renderizarSuperficie(lista) {
    if (!surface) return;

    if (lista.length === 0) {
        surface.innerHTML = `
            <div style="padding:15px; font-size:12px; color:#888; text-align:center;">
                Nenhum resultado encontrado.
            </div>
        `;
    } else {
        surface.innerHTML = lista.map(news => {
            let thumb = 'https://anigeeknews.com/default-og.jpg';
            if (news.thumb) thumb = news.thumb;
            else if (news.capa) thumb = news.capa;
            else if (news.relacionados?.[0]?.thumb) thumb = news.relacionados[0].thumb;

            return `
                <div class="result-item-list"
                     onclick="window.focarNoticia('${news.id}')"
                     style="cursor:pointer; display:flex; align-items:center; gap:12px; padding:12px; border-bottom:1px solid rgba(0,0,0,0.06);">

                    <img src="${thumb}"
                         style="width:52px; height:52px; object-fit:cover; border-radius:6px; background:#eee;"
                         loading="lazy">

                    <div style="flex:1; overflow:hidden;">
                        <div style="color:${news.cor || 'var(--primary)'}; font-size:9px; font-weight:900; text-transform:uppercase;">
                            ${news.categoria || 'Notícia'}
                        </div>
                        <h4 style="margin:0; font-size:13px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${news.titulo}
                        </h4>
                    </div>
                </div>
            `;
        }).join('');
    }

    surface.style.display = 'block';
}

/**
 * Input de busca com debounce
 */
if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
        clearTimeout(timeoutBusca);
        const termo = e.target.value.toLowerCase().trim();

        if (!termo) {
            surface.style.display = 'none';
            return;
        }

        timeoutBusca = setTimeout(() => {
            const filtradas = (window.noticiasFirebase || [])
                .filter(n =>
                    n.titulo?.toLowerCase().includes(termo) ||
                    n.categoria?.toLowerCase().includes(termo) ||
                    n.resumo?.toLowerCase().includes(termo)
                )
                .slice(0, 8);

            renderizarSuperficie(filtradas);
        }, 150);
    });

    inputBusca.addEventListener('click', () => {
        if (inputBusca.value.trim()) surface.style.display = 'block';
    });
}

/**
 * 🔥 FUNÇÃO GLOBAL — ABERTURA DE NOTÍCIA (BUSCA)
 */
window.focarNoticia = (id) => {
    if (surface) surface.style.display = 'none';
    if (inputBusca) inputBusca.value = "";

    const noticia = (window.noticiasFirebase || []).find(n => n.id === id);
    if (!noticia) {
        console.warn("Notícia não encontrada:", id);
        return;
    }

    // Atualiza URL (link compartilhável)
    const url = new URL(window.location);
    url.searchParams.set('id', id);
    window.history.pushState({ id }, '', url);

    // 🔁 Decide automaticamente como abrir
    if (typeof window.abrirModalNoticia === 'function') {
        window.abrirModalNoticia(noticia);
    } 
    else if (typeof window.abrirNoticiaUnica === 'function') {
        window.abrirNoticiaUnica(noticia);
    } 
    else {
        console.error("Nenhum método de abertura de notícia disponível.");
    }
};

/**
 * Fecha a superfície ao clicar fora
 */
document.addEventListener('click', (e) => {
    if (surface && !e.target.closest('.search-bar-wrapper')) {
        surface.style.display = 'none';
    }
});

console.log("🔍 Busca Global: integrada com Modal e Navegação SPA.");
