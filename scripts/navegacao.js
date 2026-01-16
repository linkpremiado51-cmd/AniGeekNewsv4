/* scripts/navegacao.js */

const displayPrincipal = document.getElementById('conteudo_de_destaque');

/* ======================================================
   ABERTURA DE NOTÍCIA (PÁGINA CHEIA)
====================================================== */
async function abrirNoticiaUnica(item) {
    if (!displayPrincipal) return;

    try {
        gerenciarCSSDaSecao(item.origem || 'manchetes');

        displayPrincipal.innerHTML = `
            <div class="foco-noticia-wrapper" style="animation: fadeIn 0.4s ease; max-width: var(--container-w); margin: 0 auto; padding: 20px;">
                <div class="barra-ferramentas-foco" style="display:flex; justify-content:flex-start; padding-bottom:20px; border-bottom:1px dashed var(--border); margin-bottom:30px;">
                    <button onclick="window.voltarParaLista()" class="btn-voltar-estilizado"
                        style="background:none; border:1px solid var(--text-main); color:var(--text-main);
                        padding:8px 18px; font-size:10px; font-weight:800; letter-spacing:1px;
                        cursor:pointer; display:flex; align-items:center; gap:12px; text-transform:uppercase;">
                        <i class="fa-solid fa-chevron-left"></i>
                        <span>Voltar para ${item.origem ? item.origem.toUpperCase() : 'Início'}</span>
                    </button>
                </div>
                <div id="container-principal">
                    <p style="text-align:center; padding:50px; color:var(--text-muted);">
                        Carregando conteúdo...
                    </p>
                </div>
            </div>
        `;

        const response = await fetch(`./secoes/${item.origem || 'manchetes'}.html`);
        if (!response.ok) throw new Error("Falha ao carregar motor da seção.");

        const htmlBase = await response.text();
        const doc = new DOMParser().parseFromString(htmlBase, 'text/html');

        doc.querySelectorAll("script").forEach(oldScript => {
            const s = document.createElement("script");
            s.type = oldScript.type || 'module';

            let conteudo = oldScript.textContent;
            if (conteudo.includes('function renderizarNoticias')) {
                conteudo += `\nwindow.renderizarNoticias = renderizarNoticias;`;
            }

            s.textContent = conteudo;
            document.head.appendChild(s);
        });

        let tentativas = 0;
        const aguardarRender = () => {
            if (typeof window.renderizarNoticias === 'function') {
                document.getElementById('container-principal').innerHTML = '';
                window.renderizarNoticias([item]);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (tentativas++ < 20) {
                setTimeout(aguardarRender, 150);
            }
        };
        aguardarRender();

    } catch (err) {
        console.error("Erro ao abrir notícia:", err);
        displayPrincipal.innerHTML = `<div style="padding:100px;text-align:center;">Erro ao carregar conteúdo.</div>`;
    }
}

/* ======================================================
   TRATAMENTO DE URL (?id=...)
====================================================== */
function verificarLinkCompartilhado() {
    const idNoticia = new URLSearchParams(window.location.search).get('id');
    if (!idNoticia) return;

    if (displayPrincipal) {
        displayPrincipal.innerHTML = `
            <div style="text-align:center; padding:120px; color:var(--text-muted);">
                BUSCANDO NOTÍCIA...
            </div>`;
    }

    const intervalo = setInterval(() => {
        if (window.noticiasFirebase?.length) {
            const item = window.noticiasFirebase.find(n => n.id === idNoticia);

            if (item) {
                if (typeof window.abrirModalNoticia === 'function') {
                    window.abrirModalNoticia(item);
                    carregarSecao('manchetes', false);
                } else {
                    abrirNoticiaUnica(item);
                }
            } else {
                carregarSecao('manchetes', false);
            }

            clearInterval(intervalo);
        }
    }, 100);

    setTimeout(() => clearInterval(intervalo), 5000);
}

/* ======================================================
   VOLTAR PARA LISTA
====================================================== */
window.voltarParaLista = function () {
    const url = new URL(window.location);
    url.searchParams.delete('id');
    window.history.pushState({}, '', url);

    const ativa = document.querySelector('.filter-tag.active');
    carregarSecao(ativa?.dataset.section || 'manchetes');
};

/* ======================================================
   CSS DINÂMICO
====================================================== */
function gerenciarCSSDaSecao(nome) {
    document.getElementById('css-secao-dinamica')?.remove();

    const link = document.createElement('link');
    link.id = 'css-secao-dinamica';
    link.rel = 'stylesheet';
    link.href = `./estilos/secoes/${nome}.css`;
    document.head.appendChild(link);
}

/* ======================================================
   CARREGAMENTO DE SEÇÃO
====================================================== */
async function carregarSecao(nome, atualizarURL = true) {
    if (!displayPrincipal) return;

    displayPrincipal.innerHTML = `
        <div style="text-align:center; padding:120px; color:var(--text-muted); opacity:.6;">
            SINCRONIZANDO...
        </div>`;

    try {
        if (atualizarURL) {
            const url = new URL(window.location);
            url.searchParams.set('secao', nome);
            url.searchParams.delete('id');
            window.history.pushState({}, '', url);
        }

        gerenciarCSSDaSecao(nome);

        const response = await fetch(`./secoes/${nome}.html`);
        if (!response.ok) throw new Error();

        displayPrincipal.innerHTML = await response.text();

        displayPrincipal.querySelectorAll("script").forEach(old => {
            const s = document.createElement("script");
            s.type = old.type || "text/javascript";
            s.textContent = old.textContent;
            if (old.src) s.src = old.src;
            document.body.appendChild(s);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch {
        displayPrincipal.innerHTML = `<div style="padding:100px;text-align:center;">Erro ao carregar ${nome}.</div>`;
    }
}

/* ======================================================
   FILTROS
====================================================== */
document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', () => {
        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        carregarSecao(tag.dataset.section);
    });
});

/* ======================================================
   INICIALIZAÇÃO
====================================================== */
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);

    if (params.has('id')) {
        verificarLinkCompartilhado();
    } else if (params.has('secao')) {
        carregarSecao(params.get('secao'), false);
    } else {
        carregarSecao('manchetes', false);
    }
});

/* ======================================================
   🔥 CORREÇÃO CRÍTICA: PUSHSTATE / BUSCA / BACK
====================================================== */
window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);

    if (params.has('id')) {
        verificarLinkCompartilhado();
    } else if (params.has('secao')) {
        carregarSecao(params.get('secao'), false);
    } else {
        carregarSecao('manchetes', false);
    }
});

/* ======================================================
   EXPOSIÇÃO GLOBAL
====================================================== */
window.carregarSecao = carregarSecao;
window.abrirNoticiaUnica = abrirNoticiaUnica;
