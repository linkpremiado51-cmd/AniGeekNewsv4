/* scripts/navegacao.js */

const displayPrincipal = document.getElementById('conteudo_de_destaque');

/**
 * Gerencia o carregamento de CSS específico para cada seção
 */
function gerenciarCSSDaSecao(nome) {
    const linkAntigo = document.getElementById('css-secao-dinamica');
    if (linkAntigo) {
        linkAntigo.remove();
    }

    const novoLink = document.createElement('link');
    novoLink.id = 'css-secao-dinamica';
    novoLink.rel = 'stylesheet';
    novoLink.href = `./estilos/secoes/${nome}.css`;

    document.head.appendChild(novoLink);
}

/**
 * Carrega dinamicamente o conteúdo HTML de uma seção específica
 */
async function carregarSecao(nome) {
    if (!displayPrincipal) return;

    displayPrincipal.innerHTML = '<div style="text-align: center; padding: 99px; color: var(--text-muted);">Carregando conteúdo...</div>';
    
    try {
        gerenciarCSSDaSecao(nome);

        const response = await fetch(`./secoes/${nome}.html`);
        if (!response.ok) throw new Error("Erro 404: Arquivo não encontrado.");
        
        const html = await response.text();
        displayPrincipal.innerHTML = html;

        const scripts = displayPrincipal.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            newScript.type = oldScript.type || "text/javascript";
            if (oldScript.src) newScript.src = oldScript.src;
            newScript.text = oldScript.text;
            document.body.appendChild(newScript);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        displayPrincipal.innerHTML = `
            <div style="text-align: center; padding: 100px; color: var(--accent-news);">
                Erro ao carregar seção: ${nome} <br> 
                <small>${err.message}</small>
            </div>`;
    }
}

/**
 * LÓGICA DO MODAL GLOBAL
 * Preenche e exibe a notícia sobreposta ao conteúdo atual
 */
window.abrirModalNoticia = function(item) {
    const modal = document.getElementById('modal-noticia-global');
    if (!modal) return;

    // 1. Preenchimento de textos básicos
    document.getElementById('m-titulo').innerText = item.titulo || "";
    document.getElementById('m-categoria').innerText = item.categoria || "GEEK";
    document.getElementById('m-categoria').style.color = item.cor || "var(--primary)";
    document.getElementById('m-resumo').innerText = item.resumo || "";
    
    // 2. Mídia e Links
    const iframe = document.getElementById('m-video');
    iframe.src = item.videoPrincipal ? item.videoPrincipal.trim() : "";
    document.getElementById('m-link').href = item.linkArtigo || "#";

    // 3. Ficha Técnica Dinâmica
    const fichaContainer = document.getElementById('m-ficha');
    if (item.ficha && Array.isArray(item.ficha)) {
        fichaContainer.innerHTML = item.ficha.map(f => `
            <div class="info-item">
                <span style="display:block; font-size:10px; text-transform:uppercase; font-weight:700; color:#888;">${f.label}</span>
                <span style="font-size:13px; font-weight:600;">${f.valor}</span>
            </div>
        `).join('');
        fichaContainer.style.display = 'grid';
    } else {
        fichaContainer.style.display = 'none';
    }

    // 4. Exibição e bloqueio de scroll
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
};

/**
 * Fecha o modal e limpa os dados sensíveis (como vídeo)
 */
window.fecharModalGlobal = function() {
    const modal = document.getElementById('modal-noticia-global');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('m-video').src = ""; // Para o áudio do vídeo
        document.body.style.overflow = 'auto';

        // Limpa o parâmetro ID da URL sem recarregar a página
        const url = new URL(window.location);
        if (url.searchParams.has('id')) {
            url.searchParams.delete('id');
            window.history.pushState({}, '', url);
        }
    }
};

// Eventos de clique nos filtros
document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        carregarSecao(tag.dataset.section);
    });
});

window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('active');
};

window.addEventListener('DOMContentLoaded', () => {
    carregarSecao('manchetes');
});

window.carregarSecao = carregarSecao;
