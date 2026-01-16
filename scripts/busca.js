/* scripts/busca.js */

const inputBusca = document.getElementById('input-busca-global');
const surface = document.getElementById('search-results-surface');
let timeoutBusca = null;

function renderizarSuperficie(lista) {
    if (!surface) return;
    if (lista.length === 0) {
        surface.innerHTML = '<div style="padding:15px; font-size:12px; color:#888; text-align:center;">Nenhum resultado encontrado.</div>';
    } else {
        surface.innerHTML = lista.map(news => {
            let thumb = news.thumb || news.capa || 'https://anigeeknews.com/default-og.jpg';
            return `
            <div class="result-item-list" onclick="window.focarNoticia('${news.id}')" style="cursor:pointer; display:flex; align-items:center; gap:12px; padding:12px; border-bottom:1px solid rgba(0,0,0,0.06);">
                <img src="${thumb}" style="width:52px; height:52px; object-fit:cover; border-radius:6px; flex-shrink:0;">
                <div style="flex:1; overflow:hidden;">
                    <div style="color: ${news.cor || '#ff0000'}; font-size:9px; font-weight:900; text-transform:uppercase;">${news.categoria || 'Notícia'}</div>
                    <h4 style="margin:0; font-size:13px; font-weight:700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${news.titulo}</h4>
                </div>
            </div>`;
        }).join('');
    }
    surface.style.display = 'block';
}

if (inputBusca) {
    inputBusca.addEventListener('input', (e) => {
        clearTimeout(timeoutBusca);
        const termo = e.target.value.toLowerCase().trim();
        if (termo === "") { surface.style.display = 'none'; return; }

        timeoutBusca = setTimeout(() => {
            const filtradas = (window.noticiasFirebase || []).filter(n => 
                n.titulo?.toLowerCase().includes(termo) || 
                n.categoria?.toLowerCase().includes(termo)
            ).slice(0, 8);
            renderizarSuperficie(filtradas);
        }, 150);
    });
}

window.focarNoticia = (id) => {
    if (surface) surface.style.display = 'none';
    if (inputBusca) inputBusca.value = "";
    
    const noticia = (window.noticiasFirebase || []).find(n => n.id === id);
    if (noticia && typeof window.abrirModalNoticia === 'function') {
        window.abrirModalNoticia(noticia);
    }
};

document.addEventListener('click', (e) => {
    if (surface && !e.target.closest('.search-bar-wrapper')) surface.style.display = 'none';
});
