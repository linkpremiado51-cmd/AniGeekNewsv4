/* scripts/busca.js */

function renderizarSuperficie(lista) {
    if (!surface) return;

    if (lista.length === 0) {
        surface.innerHTML = '<div style="padding:15px; font-size:12px; color:#888; text-align:center;">Nenhum resultado encontrado.</div>';
    } else {
        surface.innerHTML = lista.map(news => {
            // LÓGICA ESPECÍFICA PARA SUA ESTRUTURA:
            // 1. Tenta pegar thumb da raiz (caso exista)
            // 2. Se não existir, tenta pegar do primeiro item do array 'relacionados'
            let imagemUrl = 'https://anigeeknews.com/default-og.jpg'; // Fallback padrão

            if (news.thumb) {
                imagemUrl = news.thumb;
            } else if (news.relacionados && news.relacionados.length > 0 && news.relacionados[0].thumb) {
                imagemUrl = news.relacionados[0].thumb;
            }

            return `
            <div class="result-item-list" onclick="window.focarNoticia('${news.id}')" style="cursor:pointer; display:flex; align-items:center; gap:12px; padding:12px; border-bottom:1px solid rgba(0,0,0,0.06);">
                <img src="${imagemUrl}" 
                     style="width:55px; height:55px; object-fit:cover; border-radius:8px; flex-shrink:0; background:#eee;"
                     onerror="this.src='https://anigeeknews.com/default-og.jpg'">
                <div class="result-info" style="flex:1; overflow:hidden;">
                    <div class="result-cat" style="color: ${news.cor || '#ff0000'}; font-size:9px; font-weight:900; text-transform:uppercase;">
                        ${news.categoria || 'NOTÍCIA'}
                    </div>
                    <h4 class="result-title" style="margin:0; font-size:13px; font-weight:700; color:#333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${news.titulo}
                    </h4>
                </div>
            </div>`;
        }).join('');
    }
    surface.style.display = 'block';
}
