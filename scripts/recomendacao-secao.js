/**
 * ═══════════════════════════════════════════════════════════════════
 * AniGeekNews – EXECUTIVE ENTERPRISE SECTION SYSTEM v2.0
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
'use strict';

/* ═══════════════════════════════════════════════════════════════════
   CONFIGURAÇÕES E CONSTANTES
═══════════════════════════════════════════════════════════════════ */

const CONFIG = {
  MAX_SECOES: 12,
  STORAGE_KEY: 'anigeek_secoes_order_v2',
  ANALYTICS_KEY: 'anigeek_analytics_v2',
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 250
};

const THEME = {
  primary: '#0a0a0a',
  secondary: '#1a1a1a',
  accent: '#c00',
  border: '#2a2a2a',
  hover: '#252525',
  text: '#ffffff',
  textMuted: '#888888',
  success: '#00c853',
  error: '#f44336'
};

/* ═══════════════════════════════════════════════════════════════════
   DADOS DAS SEÇÕES
═══════════════════════════════════════════════════════════════════ */

const SECOES = [
  { id: 'manchetes', nome: 'Manchetes', icon: '📰', cat: 'Geral' },
  { id: 'analises', nome: 'Análises', icon: '📊', cat: 'Editorial' },
  { id: 'entrevistas', nome: 'Entrevistas', icon: '🎤', cat: 'Editorial' },
  { id: 'lancamentos', nome: 'Lançamentos', icon: '🚀', cat: 'Novidades' },
  { id: 'podcast', nome: 'Podcast', icon: '🎧', cat: 'Mídia' },
  { id: 'futebol', nome: 'Futebol', icon: '⚽', cat: 'Esportes' },
  { id: 'tecnologia', nome: 'Tecnologia', icon: '💻', cat: 'Tech' },
  { id: 'reviews', nome: 'Reviews', icon: '⭐', cat: 'Editorial' },
  { id: 'trailers', nome: 'Trailers', icon: '🎬', cat: 'Mídia' },
  { id: 'streaming', nome: 'Streaming', icon: '📺', cat: 'Serviços' },
  { id: 'cosplay', nome: 'Cosplay', icon: '🎭', cat: 'Comunidade' },
  { id: 'eventos', nome: 'Eventos', icon: '🎪', cat: 'Comunidade' },
  { id: 'esports', nome: 'eSports', icon: '🎮', cat: 'Esportes' },
  { id: 'cinema', nome: 'Cinema', icon: '🎥', cat: 'Pop' },
  { id: 'tv', nome: 'TV & Séries', icon: '📡', cat: 'Pop' },
  { id: 'comunidade', nome: 'Comunidade', icon: '👥', cat: 'Social' },
  { id: 'ranking', nome: 'Ranking', icon: '🏆', cat: 'Dados' }
];

/* ═══════════════════════════════════════════════════════════════════
   STATE MANAGEMENT
═══════════════════════════════════════════════════════════════════ */

const State = {
  currentOrder: [],
  tempEditingOrder: [], // Usado apenas dentro do modal
  analytics: { clicks: {}, searches: 0 },
  
  init() {
    this.currentOrder = this.loadOrder();
    injectExecutiveStyles();
  },
  
  loadOrder() {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return SECOES.slice(0, 7).map(s => s.id);
  },
  
  saveOrder(order) {
    this.currentOrder = order;
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(order));
    this.trackEvent('order_saved', { count: order.length });
  },
  
  trackEvent(name, data) {
    // Simulação de analytics
    console.log(`[Analytics] ${name}`, data);
  }
};

/* ═══════════════════════════════════════════════════════════════════
   UTILIDADES
═══════════════════════════════════════════════════════════════════ */

const Utils = {
  debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },
  
  createSVG(name) {
    const icons = {
      settings: '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
      search: '<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
      close: '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
      drag: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm0 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm1.5 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5.5-10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm1.5 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1.5 6.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/></svg>'
    };
    return icons[name] || '';
  }
};

/* ═══════════════════════════════════════════════════════════════════
   ESTILOS (CSS-IN-JS)
═══════════════════════════════════════════════════════════════════ */

function injectExecutiveStyles() {
  if (document.getElementById('anigeek-styles')) return;
  const css = `
    /* Reset & Base */
    .ag-hidden { display: none !important; }
    
    /* Scrollbar Container */
    #filterScroller {
      display: flex; gap: 0; padding: 0; background: ${THEME.primary};
      border-bottom: 1px solid ${THEME.border}; overflow-x: auto;
      scrollbar-width: thin; scrollbar-color: ${THEME.border} transparent;
    }
    #filterScroller::-webkit-scrollbar { height: 3px; }
    #filterScroller::-webkit-scrollbar-thumb { background: ${THEME.accent}; }

    /* Tags da Barra */
    .filter-tag {
      background: transparent; border: none; border-right: 1px solid ${THEME.border};
      color: ${THEME.textMuted}; padding: 14px 24px; cursor: pointer;
      font-family: 'Segoe UI', system-ui, sans-serif; font-size: 12px;
      font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
      transition: all 0.2s; white-space: nowrap; position: relative;
    }
    .filter-tag:hover { color: ${THEME.text}; background: ${THEME.hover}; }
    .filter-tag.active { 
      color: ${THEME.text}; background: ${THEME.secondary}; 
      border-bottom: 2px solid ${THEME.accent};
    }
    .filter-tag svg { vertical-align: text-bottom; margin-right: 6px; }

    /* Modal Overlay & Content */
    #sec-modal {
      position: fixed; inset: 0; background: rgba(0,0,0,0.85); 
      backdrop-filter: blur(5px); z-index: 99999;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; animation: agFadeIn 0.2s forwards;
    }
    #sec-modal-content {
      width: 90%; max-width: 500px; background: ${THEME.secondary};
      border: 1px solid ${THEME.border}; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
      display: flex; flex-direction: column; max-height: 85vh;
      transform: translateY(20px); animation: agSlideUp 0.3s forwards;
    }

    /* Modal Internals */
    .ag-modal-header {
      padding: 20px; border-bottom: 1px solid ${THEME.border};
      display: flex; justify-content: space-between; align-items: center;
    }
    .ag-modal-title { font-size: 16px; color: ${THEME.text}; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .ag-close-btn { background: transparent; border: none; color: ${THEME.textMuted}; cursor: pointer; }
    .ag-close-btn:hover { color: ${THEME.accent}; transform: rotate(90deg); transition: 0.3s; }

    .ag-search-wrap { padding: 15px 20px; border-bottom: 1px solid ${THEME.border}; position: relative; }
    #sec-search {
      width: 100%; background: ${THEME.primary}; border: 1px solid ${THEME.border};
      padding: 12px 12px 12px 40px; color: ${THEME.text}; outline: none;
      font-size: 14px; box-sizing: border-box;
    }
    #sec-search:focus { border-color: ${THEME.accent}; }
    .ag-search-icon { position: absolute; left: 32px; top: 27px; color: ${THEME.textMuted}; pointer-events: none; }

    #sec-list { flex: 1; overflow-y: auto; padding: 10px 0; }

    /* Section Row (Draggable) */
    .ag-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.05);
      user-select: none; transition: background 0.2s;
    }
    .ag-row:hover { background: ${THEME.hover}; }
    .ag-row.dragging { opacity: 0.4; background: ${THEME.primary}; }
    
    .ag-info { display: flex; align-items: center; gap: 12px; flex: 1; }
    .ag-drag-handle { cursor: grab; color: ${THEME.textMuted}; padding: 4px; opacity: 0.5; }
    .ag-row:hover .ag-drag-handle { opacity: 1; color: ${THEME.text}; }
    
    .ag-name { font-size: 14px; font-weight: 500; color: ${THEME.text}; }
    .ag-cat { font-size: 10px; background: ${THEME.border}; color: ${THEME.textMuted}; padding: 2px 6px; border-radius: 4px; margin-left: 8px; text-transform: uppercase; }

    /* Toggle Button */
    .ag-toggle {
      background: transparent; border: 1px solid ${THEME.border};
      color: ${THEME.textMuted}; font-size: 10px; padding: 6px 12px;
      text-transform: uppercase; cursor: pointer; min-width: 80px;
      font-weight: 700; transition: 0.2s;
    }
    .ag-toggle:hover { border-color: ${THEME.text}; color: ${THEME.text}; }
    .ag-toggle.active { background: ${THEME.accent}; border-color: ${THEME.accent}; color: white; }
    .ag-toggle:disabled { opacity: 0.3; cursor: not-allowed; }

    .ag-modal-footer {
      padding: 20px; border-top: 1px solid ${THEME.border};
      display: flex; gap: 10px;
    }
    .ag-btn { flex: 1; padding: 12px; border: none; font-weight: 700; cursor: pointer; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; }
    .ag-btn-save { background: ${THEME.text}; color: ${THEME.primary}; }
    .ag-btn-save:hover { background: white; }
    .ag-btn-cancel { background: transparent; border: 1px solid ${THEME.border}; color: ${THEME.textMuted}; }
    .ag-btn-cancel:hover { color: ${THEME.text}; border-color: ${THEME.text}; }

    @keyframes agFadeIn { to { opacity: 1; } }
    @keyframes agSlideUp { to { transform: translateY(0); } }
  `;
  const style = document.createElement('style');
  style.id = 'anigeek-styles';
  style.textContent = css;
  document.head.appendChild(style);
}

/* ═══════════════════════════════════════════════════════════════════
   LÓGICA DA NAVBAR
═══════════════════════════════════════════════════════════════════ */

function renderBar() {
  const wrap = document.getElementById('filterScroller');
  if (!wrap) return;

  wrap.innerHTML = '';
  
  State.currentOrder.forEach((id, index) => {
    const sec = SECOES.find(s => s.id === id);
    if (!sec) return;

    const btn = document.createElement('button');
    btn.className = `filter-tag ${index === 0 ? 'active' : ''}`;
    btn.innerHTML = `${sec.icon} ${sec.nome}`;
    btn.onclick = (e) => activateSection(e.currentTarget, sec.id);
    btn.onkeydown = (e) => handleKeyboardNav(e, btn);
    
    wrap.appendChild(btn);
  });

  // Botão Config
  const cfg = document.createElement('button');
  cfg.className = 'filter-tag';
  cfg.innerHTML = Utils.createSVG('settings');
  cfg.title = "Personalizar Feed";
  cfg.onclick = openModal;
  wrap.appendChild(cfg);

  // Trigger inicial
  if (State.currentOrder.length > 0) {
    window.carregarSecao?.(State.currentOrder[0]);
  }
}

function activateSection(btn, id) {
  document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  
  State.trackEvent('section_click', { id });
  window.carregarSecao?.(id);
}

function handleKeyboardNav(e, btn) {
  if (e.key === 'ArrowRight') {
    btn.nextElementSibling?.focus();
  } else if (e.key === 'ArrowLeft') {
    btn.previousElementSibling?.focus();
  }
}

/* ═══════════════════════════════════════════════════════════════════
   LÓGICA DO MODAL (CORE)
═══════════════════════════════════════════════════════════════════ */

function openModal() {
  if (document.getElementById('sec-modal')) return;

  // Clone o estado atual para edição temporária
  State.tempEditingOrder = [...State.currentOrder];

  const modal = document.createElement('div');
  modal.id = 'sec-modal';
  modal.innerHTML = `
    <div id="sec-modal-content">
      <div class="ag-modal-header">
        <span class="ag-modal-title">Personalizar Seções</span>
        <button class="ag-close-btn" id="sec-close-top">${Utils.createSVG('close')}</button>
      </div>
      
      <div class="ag-search-wrap">
        <span class="ag-search-icon">${Utils.createSVG('search')}</span>
        <input id="sec-search" placeholder="Buscar por nome ou categoria (ex: games)..." autocomplete="off">
      </div>

      <div id="sec-list"></div>

      <div class="ag-modal-footer">
        <button class="ag-btn ag-btn-cancel" id="sec-cancel">Cancelar</button>
        <button class="ag-btn ag-btn-save" id="sec-save">Salvar Alterações</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Binds
  document.getElementById('sec-close-top').onclick = closeModal;
  document.getElementById('sec-cancel').onclick = closeModal;
  document.getElementById('sec-save').onclick = saveModal;
  
  const searchInput = document.getElementById('sec-search');
  searchInput.oninput = Utils.debounce((e) => renderModalList(e.target.value), CONFIG.DEBOUNCE_DELAY);
  searchInput.focus();

  renderModalList();
}

/* ═══════════════════════════════════════════════════════════════════
   RENDERIZAÇÃO DA LISTA (COM DRAG & DROP)
═══════════════════════════════════════════════════════════════════ */

function renderModalList(filter = '') {
  const list = document.getElementById('sec-list');
  if (!list) return;

  list.innerHTML = '';
  const term = filter.toLowerCase();
  
  // Combina lista: primeiro os ativos (na ordem correta), depois os inativos
  const activeObjs = State.tempEditingOrder
    .map(id => SECOES.find(s => s.id === id))
    .filter(Boolean);
    
  const inactiveObjs = SECOES.filter(s => !State.tempEditingOrder.includes(s.id));
  
  const displayList = [...activeObjs, ...inactiveObjs];

  displayList.forEach(sec => {
    // Filtro de busca
    if (term && !sec.nome.toLowerCase().includes(term) && !sec.cat.toLowerCase().includes(term)) return;

    const isActive = State.tempEditingOrder.includes(sec.id);
    const isMaxReached = State.tempEditingOrder.length >= CONFIG.MAX_SECOES;

    const row = document.createElement('div');
    row.className = 'ag-row';
    
    // Drag Attributes (apenas para ativos se não houver busca)
    if (isActive && !term) {
      row.draggable = true;
      row.dataset.id = sec.id;
      addDragEvents(row);
    }

    // HTML da Linha
    const dragIcon = (isActive && !term) ? `<div class="ag-drag-handle">${Utils.createSVG('drag')}</div>` : '<div style="width:24px"></div>';
    
    row.innerHTML = `
      <div class="ag-info">
        ${dragIcon}
        <span style="font-size:18px">${sec.icon}</span>
        <div>
          <span class="ag-name">${sec.nome}</span>
          <span class="ag-cat">${sec.cat}</span>
        </div>
      </div>
      <button class="ag-toggle ${isActive ? 'active' : ''}" 
        ${(!isActive && isMaxReached) ? 'disabled title="Limite atingido"' : ''}>
        ${isActive ? 'Remover' : 'Adicionar'}
      </button>
    `;

    // Click do Botão
    row.querySelector('button').onclick = () => toggleSection(sec.id, filter);
    list.appendChild(row);
  });
}

function toggleSection(id, currentFilter) {
  if (State.tempEditingOrder.includes(id)) {
    State.tempEditingOrder = State.tempEditingOrder.filter(item => item !== id);
  } else {
    if (State.tempEditingOrder.length < CONFIG.MAX_SECOES) {
      State.tempEditingOrder.push(id);
    }
  }
  renderModalList(currentFilter);
}

/* ═══════════════════════════════════════════════════════════════════
   LÓGICA DE DRAG & DROP (NATIVO HTML5)
═══════════════════════════════════════════════════════════════════ */

let dragSrcEl = null;

function addDragEvents(row) {
  row.addEventListener('dragstart', function(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
  });

  row.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  });

  row.addEventListener('drop', function(e) {
    e.stopPropagation();
    if (dragSrcEl !== this) {
      // Troca visual e lógica
      const idSource = dragSrcEl.dataset.id;
      const idTarget = this.dataset.id;
      
      const idxSource = State.tempEditingOrder.indexOf(idSource);
      const idxTarget = State.tempEditingOrder.indexOf(idTarget);
      
      // Move no array
      State.tempEditingOrder.splice(idxSource, 1);
      State.tempEditingOrder.splice(idxTarget, 0, idSource);
      
      renderModalList(); // Re-renderiza para limpar estados
    }
    return false;
  });

  row.addEventListener('dragend', function() {
    this.classList.remove('dragging');
  });
}

/* ═══════════════════════════════════════════════════════════════════
   FINALIZAÇÃO
═══════════════════════════════════════════════════════════════════ */

function saveModal() {
  State.saveOrder(State.tempEditingOrder);
  renderBar();
  closeModal();
}

function closeModal() {
  const modal = document.getElementById('sec-modal');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => modal.remove(), 200);
  }
}

// Inicializa o sistema
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', State.init.bind(State));
  document.addEventListener('DOMContentLoaded', renderBar);
} else {
  State.init();
  renderBar();
}

})();
