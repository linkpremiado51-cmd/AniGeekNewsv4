/**
 * AniGeekNews v2 – Sistema de Recomendação e Personalização de Seções
 * 
 * Responsabilidades:
 * - Gerenciar a lista de seções disponíveis
 * - Salvar/recuperar preferências do usuário (localStorage)
 * - Renderizar dinamicamente os filtros na barra de navegação
 * - Criar e gerenciar o modal de personalização
 * - Integrar com window.carregarSecao() para navegação
 */

(function () {
  // === CONFIGURAÇÃO ===
  const SECOES_DISPONIVEIS = [
    { id: 'manchetes', nome: 'Manchetes' },
    { id: 'analises', nome: 'Análises' },
    { id: 'entrevistas', nome: 'Entrevistas' },
    { id: 'lancamentos', nome: 'Lançamentos' },
    { id: 'podcast', nome: 'Podcast' },
    { id: 'futebol', nome: 'Futebol' }
  ];

  const CHAVE_LOCAL_STORAGE = 'pref_secoes_visiveis';

  // === UTILITÁRIOS ===
  function getPreferencias() {
    const salvo = localStorage.getItem(CHAVE_LOCAL_STORAGE);
    if (salvo) {
      try {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn('[recomendacao-secao] Preferência corrompida, usando padrão.');
      }
    }
    return SECOES_DISPONIVEIS.map(s => s.id);
  }

  function salvarPreferencias(selecionadas) {
    localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(selecionadas));
  }

  // === CRIAÇÃO DINÂMICA DO MODAL ===
  function criarModalSeccoes() {
    if (document.getElementById('modal-secoes')) return; // Evita duplicação

    const modal = document.createElement('div');
    modal.id = 'modal-secoes';
    modal.style.cssText = `
      display: none;
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.7);
      z-index: 9999;
      justify-content: center;
      align-items: center;
    `;

    modal.innerHTML = `
      <div style="background: var(--bg); color: var(--text-main); padding: 25px; border-radius: 12px; max-width: 400px; width: 90%;">
        <h3 style="margin-top:0; font-size:18px;">Escolha suas seções</h3>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:15px;">Selecione quais abas deseja ver:</p>
        <div id="lista-secoes-config"></div>
        <div style="margin-top:20px; display:flex; gap:10px;">
          <button id="btn-salvar-secoes" style="flex:1; padding:10px; background:var(--primary); color:white; border:none; border-radius:4px; font-weight:bold;">Salvar</button>
          <button id="btn-cancelar-secoes" style="flex:1; padding:10px; background:#eee; color:var(--text-main); border:none; border-radius:4px;">Cancelar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Eventos dos botões
    document.getElementById('btn-salvar-secoes').addEventListener('click', salvarPreferenciasDoModal);
    document.getElementById('btn-cancelar-secoes').addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  function preencherModalComPreferencias() {
    const container = document.getElementById('lista-secoes-config');
    const preferencias = new Set(getPreferencias());
    container.innerHTML = '';

    SECOES_DISPONIVEIS.forEach(secao => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.marginBottom = '10px';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = `chk-${secao.id}`;
      input.value = secao.id;
      input.checked = preferencias.has(secao.id);

      const label = document.createElement('label');
      label.htmlFor = `chk-${secao.id}`;
      label.textContent = secao.nome;
      label.style.marginLeft = '8px';
      label.style.cursor = 'pointer';
      label.style.fontSize = '14px';

      div.appendChild(input);
      div.appendChild(label);
      container.appendChild(div);
    });
  }

  function salvarPreferenciasDoModal() {
    const checkboxes = document.querySelectorAll('#lista-secoes-config input[type="checkbox"]');
    const selecionadas = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    if (selecionadas.length === 0) {
      alert("Você deve manter pelo menos uma seção visível.");
      return;
    }

    salvarPreferencias(selecionadas);
    document.getElementById('modal-secoes').style.display = 'none';
    renderizarFiltros();
  }

  function abrirModalSeccoes() {
    criarModalSeccoes();
    preencherModalComPreferencias();
    document.getElementById('modal-secoes').style.display = 'flex';
  }

  // === RENDERIZAÇÃO DOS FILTROS ===
  function renderizarFiltros() {
    const container = document.getElementById('filterScroller');
    if (!container) return;

    const preferencias = getPreferencias();
    const preferenciasSet = new Set(preferencias);

    container.innerHTML = '';

    // Adiciona os filtros selecionados
    SECOES_DISPONIVEIS.forEach(secao => {
      if (preferenciasSet.has(secao.id)) {
        const btn = document.createElement('button');
        btn.className = 'filter-tag';
        btn.dataset.section = secao.id;
        btn.textContent = secao.nome;
        btn.addEventListener('click', () => {
          document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
          btn.classList.add('active');
          if (typeof window.carregarSecao === 'function') {
            window.carregarSecao(secao.id);
          }
        });
        container.appendChild(btn);
      }
    });

    // Adiciona o botão de configuração
    const btnConfig = document.createElement('button');
    btnConfig.className = 'filter-tag config-btn';
    btnConfig.title = 'Personalizar seções';
    btnConfig.innerHTML = '<i class="fas fa-cog"></i>';
    btnConfig.style.cssText = `
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 16px;
      padding: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      border-radius: 4px;
    `;
    btnConfig.onmouseover = () => {
      btnConfig.style.color = 'var(--text-main)';
      btnConfig.style.background = 'rgba(0,0,0,0.05)';
    };
    btnConfig.onmouseout = () => {
      btnConfig.style.color = '';
      btnConfig.style.background = '';
    };
    btnConfig.onclick = abrirModalSeccoes;
    container.appendChild(btnConfig);

    // Ativa a primeira aba por padrão
    const primeiroFiltro = container.querySelector('.filter-tag:not(.config-btn)');
    if (primeiroFiltro && !container.querySelector('.filter-tag.active')) {
      primeiroFiltro.classList.add('active');
      if (typeof window.carregarSecao === 'function') {
        window.carregarSecao(primeiroFiltro.dataset.section);
      }
    }
  }

  // === INICIALIZAÇÃO ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderizarFiltros);
  } else {
    renderizarFiltros();
  }
})();
