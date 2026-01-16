/* scripts/navegacao.js */

const displayPrincipal = document.getElementById('conteudo_de_destaque');

/**
 * Remove links ou scripts duplicados antes de injetar novas seções
 */
function limparDuplicados() {
    // Remove links duplicados de FontAwesome ou CSS da seção
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        if (link.href.includes("font-awesome") || link.id === "css-secao-dinamica") link.remove();
    });

    // Remove scripts que já foram injetados
    document.querySelectorAll('script[data-injetado="true"]').forEach(script => script.remove());
}

/**
 * Abre a notícia garantindo que o motor de renderização da seção seja injetado corretamente.
 */
async function abrirNoticiaUnica(item) {
    if (!displayPrincipal) return;

    try {
        // Limpa links e scripts duplicados
        limparDuplicados();

        // Carrega o CSS da seção de origem
        gerenciarCSSDaSecao(item.origem || 'manchetes');

        // Prepara o layout com o botão de Voltar
        displayPrincipal.innerHTML = `
            <div class="foco-noticia-wrapper" style="animation: fadeIn 0.4s ease; max-width: var(--container-w); margin: 0 auto; padding: 20px;">
                <div class="barra-ferramentas-foco" style="display: flex; justify-content: flex-start; padding-bottom: 20px; border-bottom: 1px dashed var(--border); margin-bottom: 30px;">
                    <button onclick="window.voltarParaLista()" class="btn-voltar-estilizado" style="background: none; border: 1px solid var(--text-main); color: var(--text-main); padding: 8px 18px; font-size: 10px; font-weight: 800; letter-spacing: 1px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: 0.3s; text-transform: uppercase;">
                        <i class="fa-solid fa-chevron-left" style="font-size: 14px;"></i> 
                        <span>Voltar para ${item.origem ? item.origem.toUpperCase() : 'Início'}</span>
                    </button>
                </div>
                <div id="container-principal">
                    <p style="text-align:center; padding:50px; color:var(--text-muted);">Carregando conteúdo...</p>
                </div>
            </div>
        `;

        // Busca o HTML da seção
        const response = await fetch(`./secoes/${item.origem || 'manchetes'}.html`);
        if (!response.ok) throw new Error("Falha ao carregar motor de renderização.");
        const htmlBase = await response.text();

        const parser = new DOMParser();
        const docSeçao = parser.parseFromString(htmlBase, 'text/html');
        const scripts = docSeçao.querySelectorAll("script");

        scripts.forEach(oldScript => {
            // Ignora scripts já carregados
            if (oldScript.src && document.querySelector(`script[src="${oldScript.src}"]`)) return;
            if (!oldScript.src && oldScript.textContent.includes("firebase")) return; // Ignora Firebase
            if (!oldScript.src && oldScript.textContent.includes("FontAwesome")) return; // Ignora FontAwesome

            const newScript = document.createElement("script");
            newScript.setAttribute("data-injetado", "true"); // marca como injetado
            newScript.type = oldScript.type || "text/javascript";
            if (oldScript.src) newScript.src = oldScript.src;
            else {
                let conteudo = oldScript.textContent;
                if (conteudo.includes('function renderizarNoticias')) {
                    conteudo += `\n window.renderizarNoticias = renderizarNoticias;`;
                }
                newScript.textContent = conteudo;
            }
            document.body.appendChild(newScript);
        });

        let tentativas = 0;
        const tentarRenderizar = () => {
            if (typeof window.renderizarNoticias === 'function') {
                const container = document.getElementById('container-principal');
                if (container) container.innerHTML = "";
                window.renderizarNoticias([item]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (tentativas < 20) {
                tentativas++;
                setTimeout(tentarRenderizar, 150);
            }
        };
        tentarRenderizar();

    } catch (err) {
        console.error("Erro na ponte de navegação:", err);
        displayPrincipal.innerHTML = `<div style="padding:100px; text-align:center;">Erro ao carregar conteúdo.</div>`;
    }
}

/**
 * Vigia de URL para Links Compartilhados (?id=...)
 */
function verificarLinkCompartilhado() {
    const params = new URLSearchParams(window.location.search);
    const idNoticia = params.get('id');

    if (idNoticia) {
        if (displayPrincipal) {
            displayPrincipal.innerHTML = '<div style="text-align: center; padding: 120px; color: var(--text-muted); font-family: sans-serif; letter-spacing: 1px;">BUSCANDO NOTÍCIA...</div>';
        }

        const checkData = setInterval(() => {
            if (window.noticiasFirebase && window.noticiasFirebase.length > 0) {
                const item = window.noticiasFirebase.find(n => n.id === idNoticia);
                if (item) {
                    if (typeof window.abrirModalNoticia === 'function') {
                        window.abrirModalNoticia(item);
                        carregarSecao('manchetes');
                    } else {
                        abrirNoticiaUnica(item);
                    }
                } else {
                    carregarSecao('manchetes');
                }
                clearInterval(checkData);
            }
        }, 100);
        
        setTimeout(() => clearInterval(checkData), 5000);
    }
}

/**
 * Limpa o ID da URL e restaura a visualização da lista
 */
window.voltarParaLista = function() {
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);

    const tagAtiva = document.querySelector('.filter-tag.active');
    const secaoDestino = tagAtiva ? tagAtiva.dataset.section : 'manchetes';
    
    carregarSecao(secaoDestino);
};

/**
 * Carrega CSS da seção (remove link antigo antes)
 */
function gerenciarCSSDaSecao(nome) {
    const linkAntigo = document.getElementById('css-secao-dinamica');
    if (linkAntigo) linkAntigo.remove();

    const novoLink = document.createElement('link');
    novoLink.id = 'css-secao-dinamica';
    novoLink.rel = 'stylesheet';
    novoLink.href = `./estilos/secoes/${nome}.css`;
    document.head.appendChild(novoLink);
}

/**
 * Carrega dinamicamente o feed de uma seção
 */
async function carregarSecao(nome) {
    if (!displayPrincipal) return;

    displayPrincipal.innerHTML = '<div style="text-align: center; padding: 120px; color: var(--text-muted); opacity: 0.5;">SINCRONIZANDO...</div>';

    try {
        limparDuplicados();
        gerenciarCSSDaSecao(nome);

        const response = await fetch(`./secoes/${nome}.html`);
        if (!response.ok) throw new Error("Arquivo não encontrado.");

        const html = await response.text();
        displayPrincipal.innerHTML = html;

        const scripts = displayPrincipal.querySelectorAll("script");
        scripts.forEach(oldScript => {
            if (oldScript.src && document.querySelector(`script[src="${oldScript.src}"]`)) return;
            if (!oldScript.src && oldScript.textContent.includes("firebase")) return;
            if (!oldScript.src && oldScript.textContent.includes("FontAwesome")) return;

            const newScript = document.createElement("script");
            newScript.setAttribute("data-injetado", "true");
            newScript.type = oldScript.type || "text/javascript";
            if (oldScript.src) newScript.src = oldScript.src;
            else newScript.textContent = oldScript.textContent;
            document.body.appendChild(newScript);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        displayPrincipal.innerHTML = `<div style="text-align:center; padding:100px;">Erro: ${nome} não carregado.</div>`;
    }
}

// Eventos de clique nas categorias
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

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')) {
        verificarLinkCompartilhado();
    } else {
        carregarSecao('manchetes');
    }
});

// Exposição global
window.carregarSecao = carregarSecao;
window.abrirNoticiaUnica = abrirNoticiaUnica;
