/* scripts/navegacao.js */

const displayPrincipal = document.getElementById('conteudo_de_destaque');

/**
 * Gerencia o carregAmento de CSS específico para cada seção
 */
function gerenciarCSSDaSecao(nome) {
    // Remove qualquer CSS de seção que já esteja carregado para evitar conflitos
    const linkAntigo = document.getElementById('css-secao-dinamica');
    if (linkAntigo) {
        linkAntigo.remove();
    }

    // Cria o novo link para o CSS da seção atual
    const novoLink = document.createElement('link');
    novoLink.id = 'css-secao-dinamica';
    novoLink.rel = 'stylesheet';
    novoLink.href = `./estilos/secoes/${nome}.css`; // Caminho conforme nossa ramificação

    document.head.appendChild(novoLink);
}

/**
 * Carrega dinamicamente o conteúdo HTML de uma seção específica
 * @param {string} nome - O nome do arquivo (ex: 'manchetes', 'analises')
 */
async function carregarSecao(nome) {
    if (!displayPrincipal) return;

    displayPrincipal.innerHTML = '<div style="text-align: center; padding: 99px; color: var(--text-muted);">Carregando conteúdo...</div>';
    
    try {
        // 1. Carrega o CSS específico da seção primeiro
        gerenciarCSSDaSecao(nome);

        // 2. Busca o arquivo HTML na subpasta /secoes/
        const response = await fetch(`./secoes/${nome}.html`);
        if (!response.ok) throw new Error("Erro 404: Arquivo não encontrado.");
        
        const html = await response.text();
        displayPrincipal.innerHTML = html;

        // 3. Ativa scripts do HTML carregado
        const scripts = displayPrincipal.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            newScript.type = oldScript.type || "text/javascript";
            if (oldScript.src) newScript.src = oldScript.src;
            newScript.text = oldScript.text;
            document.body.appendChild(newScript);
        });

        // Rola para o topo ao trocar de seção
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        displayPrincipal.innerHTML = `
            <div style="text-align: center; padding: 100px; color: var(--accent-news);">
                Erro ao carregar seção: ${nome} <br> 
                <small>${err.message}</small>
            </div>`;
    }
}

// Escuta os cliques nos botões de filtro (Manchetes, Análises, etc.)
document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        carregarSecao(tag.dataset.section);
    });
});

// Função para abrir/fechar o menu mobile
window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('active');
    }
};

// Inicialização: carrega as manchetes por padrão ao abrir o site
window.addEventListener('DOMContentLoaded', () => {
    carregarSecao('manchetes');
});

// Exporta a função para o escopo global
window.carregarSecao = carregarSecao;
