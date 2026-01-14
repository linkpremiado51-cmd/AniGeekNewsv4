import { restaurarNoticiasSalvas } from '/anigeeknews/modulo-noticias.js';

const dynamicContent = document.getElementById('dynamic-content');
let originalContent = dynamicContent ? dynamicContent.innerHTML : "";

function activateButton(section) {
    document.querySelectorAll('.filter-tag').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === section);
    });
}

/* Remove scripts antigos dos módulos (evita conflito) */
function limparScriptsModulos() {
    document.querySelectorAll('script[data-modulo]').forEach(s => s.remove());
}

async function loadFeed() {
    if (!dynamicContent) return;

    limparScriptsModulos();

    try {
        const response = await fetch('/anigeeknews/feed/feed.html');
        const html = await response.text();
        dynamicContent.innerHTML = html;

        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = '/anigeeknews/feed/feed.css';
        document.head.appendChild(cssLink);

        const script = document.createElement('script');
        script.src = '/anigeeknews/feed/feed.js';
        script.defer = true;
        script.setAttribute('data-modulo', 'feed');
        script.onload = () => restaurarNoticiasSalvas();
        document.body.appendChild(script);

    } catch (error) {
        dynamicContent.innerHTML =
            '<p style="padding:40px; text-align:center; color:#888;">Conteúdo do Feed indisponível.</p>';
    }
}

async function loadSection(section) {
    if (!dynamicContent) return;

    limparScriptsModulos();

    /* === MANCHEtes === */
    if (section === 'manchetes') {
        dynamicContent.innerHTML = originalContent;
        localStorage.setItem('currentSection', 'manchetes');
        restaurarNoticiasSalvas();
        return;
    }

    /* === FEED === */
    if (section === 'feed') {
        localStorage.setItem('currentSection', 'feed');
        loadFeed();
        return;
    }

    /* === SUBMÓDULO: CONTEÚDO DE DESTAQUE (dentro de Manchetes) === */
    if (section === 'destaque') {
        localStorage.setItem('currentSection', 'destaque');

        const html = await (await fetch('/anigeeknews/modulos/conteudo_de_destaque.html')).text();
        dynamicContent.innerHTML = html;

        // FORÇA o JavaScript do submódulo a rodar
        const script = document.createElement('script');
        script.src = '/anigeeknews/modulos/conteudo_de_destaque.js';
        script.defer = true;
        script.setAttribute('data-modulo', 'destaque');
        document.body.appendChild(script);

        return;
    }

    /* === OUTROS MÓDULOS === */
    try {
        const html = await (await fetch(`/anigeeknews/modulos/${section}.html`)).text();
        dynamicContent.innerHTML = html;
        setTimeout(restaurarNoticiasSalvas, 50);
    } catch {
        dynamicContent.innerHTML =
            '<p style="padding:40px; text-align:center; color:#888;">Conteúdo indisponível.</p>';
    }
}

/* Eventos dos botões */
document.querySelectorAll('.filter-tag').forEach(button => {
    button.addEventListener('click', () => {
        const section = button.dataset.section;
        localStorage.setItem('currentSection', section);
        activateButton(section);
        loadSection(section);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

/* Restaura aba salva */
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('currentSection') || 'manchetes';
    activateButton(saved);

    if (saved !== 'manchetes') loadSection(saved);
    else restaurarNoticiasSalvas();
});
