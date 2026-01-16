/* scripts/modal-manager.js */

// 1. Injeta a estrutura HTML do modal no Body assim que o script carrega
const estruturaHTML = `
<div id="modal-noticia-global">
    <div class="modal-content">
        <button class="close-modal" onclick="window.fecharModalGlobal()">&times;</button>
        <div id="m-categoria"></div>
        <h2 id="m-titulo"></h2>
        <p id="m-resumo"></p>
        <div id="m-ficha"></div>
        <iframe id="m-video" src="" allowfullscreen></iframe>
        <div style="text-align: center; margin-top: 10px;">
            <a id="m-link" href="#" target="_blank" class="btn-ver-artigo-modal">LER ARTIGO COMPLETO</a>
        </div>
    </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', estruturaHTML);

// 2. Funções do Modal
export const abrirModalNoticia = (noticia) => {
    const modal = document.getElementById('modal-noticia-global');
    if (!modal) return;

    const corNoticia = noticia.cor || "#ff0055";
    modal.style.setProperty('--tema-cor', corNoticia);

    document.getElementById('m-categoria').innerText = noticia.categoria || "Geek";
    document.getElementById('m-titulo').innerText = noticia.titulo;
    document.getElementById('m-resumo').innerText = noticia.resumo || "";
    document.getElementById('m-video').src = noticia.videoPrincipal || "";
    document.getElementById('m-link').href = noticia.linkArtigo || "#";

    const fichaContainer = document.getElementById('m-ficha');
    if (noticia.ficha && noticia.ficha.length > 0) {
        fichaContainer.style.display = 'grid';
        fichaContainer.innerHTML = noticia.ficha.map(item => `
            <div class="info-item">
                <span class="info-label">${item.label}</span>
                <span class="info-valor">${item.valor}</span>
            </div>
        `).join('');
    } else {
        fichaContainer.style.display = 'none';
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    if (noticia.id) {
        const url = new URL(window.location);
        url.searchParams.set('id', noticia.id);
        window.history.pushState({}, '', url);
    }
};

export const fecharModalGlobal = () => {
    const modal = document.getElementById('modal-noticia-global');
    if (!modal) return;
    
    modal.style.display = 'none';
    document.getElementById('m-video').src = ""; 
    document.body.style.overflow = 'auto'; 
    
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);
};

// 3. Exporta para o escopo global (para funcionar com os cliques do resultado de busca)
window.abrirModalNoticia = abrirModalNoticia;
window.fecharModalGlobal = fecharModalGlobal;

// Fechar ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('modal-noticia-global');
    if (event.target == modal) {
        fecharModalGlobal();
    }
};
