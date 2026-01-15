export async function inicializarMegaMenu() {
    // Carrega CSS
    if (!document.getElementById('menu-css')) {
        const link = document.createElement('link');
        link.id = 'menu-css';
        link.rel = 'stylesheet';
        link.href = 'menu/menu.css';
        document.head.appendChild(link);
    }

    // Container no index.html
    const container = document.getElementById('megaMenuContainer');
    if (!container) return;

    // Carrega HTML
    const response = await fetch('menu/menu.html');
    container.innerHTML = await response.text();

    const overlay = document.getElementById('megaOverlay');
    const btnFechar = document.getElementById('btnFecharMega');

    if (!overlay || !btnFechar) return;

    /* =========================================
       FUNÇÃO CENTRAL DE FECHAMENTO
       ========================================= */
    const fecharMegaMenu = () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    /* =========================================
       TOGGLE PELO BOTÃO QUE ABRE O MENU
       ========================================= */
    window.abrirMegaMenu = () => {
        const menuAberto = overlay.classList.contains('active');

        if (menuAberto) {
            fecharMegaMenu();
        } else {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    /* =========================================
       BOTÃO X
       ========================================= */
    btnFechar.onclick = fecharMegaMenu;

    /* =========================================
       CLICK FORA DO CONTEÚDO
       ========================================= */
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            fecharMegaMenu();
        }
    };

    /* =========================================
       CONEXÃO COM carregarSecao()
       ========================================= */
    const linksSecao = overlay.querySelectorAll('[data-secao]');

    linksSecao.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const secao = link.dataset.secao;
            if (!secao) return;

            if (typeof window.carregarSecao === 'function') {
                window.carregarSecao(secao);
            }

            fecharMegaMenu();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}
