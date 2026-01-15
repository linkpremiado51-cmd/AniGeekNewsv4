/* ======================================================
   AniGeekNews – Enterprise Section System v6
   • Grid Harmônico e Simétrico
   • Ícones SVG Profissionais
   • Gestão de Sessões e Subcategorias
   • Modo Fixo com Reordenamento
====================================================== */

(function(){

const CONFIG = {
  MAX_TABS: 12,
  KEYS: {
    ORDER: 'ag_v6_order',
    MODE:  'ag_v6_mode', // 'dynamic' ou 'fixed'
    STATS: 'ag_v6_stats'
  }
};

/* ===========================
   BANCO DE DADOS (HIERÁRQUICO)
=========================== */
// Mapeamento completo conforme solicitado
const CATALOGO = [
  {
    sessao: "MANCHETES",
    cor: "#FF4500", // Laranja avermelhado
    itens: [
      { id: 'destaques', label: 'Destaques do Dia' },
      { id: 'ultimas', label: 'Últimas Notícias' },
      { id: 'trending', label: 'Trending / Em Alta' },
      { id: 'exclusivos', label: 'Exclusivos' },
      { id: 'urgente', label: 'Urgente' },
      { id: 'maislidas', label: 'Mais Lidas' },
      { id: 'editorpick', label: 'Editor’s Pick' }
    ]
  },
  {
    sessao: "ANÁLISES",
    cor: "#8A2BE2", // Violeta
    itens: [
      { id: 'opiniao', label: 'Opinião' },
      { id: 'critica', label: 'Crítica Técnica' },
      { id: 'analisemercado', label: 'Análise de Mercado' },
      { id: 'comparativos', label: 'Comparativos' },
      { id: 'teorias', label: 'Teorias' },
      { id: 'explicacoes', label: 'Explicações' },
      { id: 'impacto', label: 'Impacto na Indústria' }
    ]
  },
  {
    sessao: "ENTREVISTAS",
    cor: "#20B2AA", // LightSeaGreen
    itens: [
      { id: 'devs', label: 'Desenvolvedores' },
      { id: 'criadores', label: 'Criadores de Conteúdo' },
      { id: 'atores', label: 'Atores / Dubladores' },
      { id: 'influencers', label: 'Influencers' },
      { id: 'pro_industria', label: 'Profissionais' },
      { id: 'comunidade_ent', label: 'Comunidade' }
    ]
  },
  {
    sessao: "LANÇAMENTOS",
    cor: "#32CD32", // LimeGreen
    itens: [
      { id: 'lanc_jogos', label: 'Jogos' },
      { id: 'lanc_animes', label: 'Animes' },
      { id: 'lanc_filmes', label: 'Filmes' },
      { id: 'lanc_series', label: 'Séries' },
      { id: 'lanc_tech', label: 'Tecnologia' },
      { id: 'lanc_mangas', label: 'Mangás / HQs' },
      { id: 'datas', label: 'Datas Confirmadas' },
      { id: 'rumores', label: 'Rumores' }
    ]
  },
  {
    sessao: "REVIEWS",
    cor: "#FFD700", // Gold
    itens: [
      { id: 'rev_jogos', label: 'Jogos' },
      { id: 'rev_animes', label: 'Animes' },
      { id: 'rev_filmes', label: 'Filmes' },
      { id: 'rev_series', label: 'Séries' },
      { id: 'rev_tech', label: 'Tecnologia' },
      { id: 'rev_geek', label: 'Produtos Geek' },
      { id: 'rev_eventos', label: 'Eventos' },
      { id: 'rev_stream', label: 'Streaming' }
    ]
  },
  {
    sessao: "TRAILERS",
    cor: "#DC143C", // Crimson
    itens: [
      { id: 'tr_jogos', label: 'Jogos' },
      { id: 'tr_animes', label: 'Animes' },
      { id: 'tr_filmes', label: 'Filmes' },
      { id: 'tr_series', label: 'Séries' },
      { id: 'tr_teasers', label: 'Teasers' },
      { id: 'tr_oficiais', label: 'Trailers Oficiais' },
      { id: 'tr_gameplay', label: 'Gameplay Reveal' }
    ]
  },
  {
    sessao: "STREAMING",
    cor: "#00BFFF", // DeepSkyBlue
    itens: [
      { id: 'st_netflix', label: 'Netflix' },
      { id: 'st_prime', label: 'Prime Video' },
      { id: 'st_disney', label: 'Disney+' },
      { id: 'st_hbo', label: 'HBO Max' },
      { id: 'st_crunchy', label: 'Crunchyroll' },
      { id: 'st_star', label: 'Star+' },
      { id: 'st_apple', label: 'Apple TV+' },
      { id: 'st_semana', label: 'Lançamentos da Semana' }
    ]
  },
  {
    sessao: "PODCAST",
    cor: "#9370DB", // MediumPurple
    itens: [
      { id: 'pod_recentes', label: 'Episódios Recentes' },
      { id: 'pod_geek', label: 'Temas Geek' },
      { id: 'pod_games', label: 'Games' },
      { id: 'pod_tech', label: 'Tecnologia' },
      { id: 'pod_pop', label: 'Cultura Pop' },
      { id: 'pod_ent', label: 'Entrevistas' },
      { id: 'pod_back', label: 'Bastidores' }
    ]
  },
  {
    sessao: "FUTEBOL",
    cor: "#2E8B57", // SeaGreen
    itens: [
      { id: 'fut_news', label: 'Notícias' },
      { id: 'fut_analise', label: 'Análises' },
      { id: 'fut_mercado', label: 'Mercado da Bola' },
      { id: 'fut_opiniao', label: 'Opinião' },
      { id: 'fut_estat', label: 'Estatísticas' },
      { id: 'fut_inter', label: 'Futebol Internacional' },
      { id: 'fut_nacional', label: 'Futebol Nacional' }
    ]
  },
  {
    sessao: "TECNOLOGIA",
    cor: "#4682B4", // SteelBlue
    itens: [
      { id: 'tech_smart', label: 'Smartphones' },
      { id: 'tech_hard', label: 'Hardware' },
      { id: 'tech_soft', label: 'Software' },
      { id: 'tech_ai', label: 'Inteligência Artificial' },
      { id: 'tech_gamestech', label: 'Games Tech' },
      { id: 'tech_sec', label: 'Segurança Digital' },
      { id: 'tech_inov', label: 'Inovação' },
      { id: 'tech_start', label: 'Startups' }
    ]
  },
  {
    sessao: "COSPLAY",
    cor: "#FF69B4", // HotPink
    itens: [
      { id: 'cosp_dest', label: 'Destaques' },
      { id: 'cosp_event', label: 'Eventos' },
      { id: 'cosp_ent', label: 'Entrevistas' },
      { id: 'cosp_guias', label: 'Guias' },
      { id: 'cosp_com', label: 'Comunidade' },
      { id: 'cosp_fotos', label: 'Fotos' }
    ]
  },
  {
    sessao: "EVENTOS",
    cor: "#FF8C00", // DarkOrange
    itens: [
      { id: 'evt_feiras', label: 'Feiras Geek' },
      { id: 'evt_camp', label: 'Campeonatos' },
      { id: 'evt_conv', label: 'Convenções' },
      { id: 'evt_lanc', label: 'Lançamentos Presenciais' },
      { id: 'evt_cal', label: 'Calendário' },
      { id: 'evt_live', label: 'Cobertura Ao Vivo' }
    ]
  },
  {
    sessao: "ESPORTS",
    cor: "#00008B", // DarkBlue
    itens: [
      { id: 'esp_camp', label: 'Campeonatos' },
      { id: 'esp_times', label: 'Times' },
      { id: 'esp_jog', label: 'Jogadores' },
      { id: 'esp_res', label: 'Resultados' },
      { id: 'esp_ana', label: 'Análises' },
      { id: 'esp_agd', label: 'Agenda' }
    ]
  },
  {
    sessao: "CINEMA",
    cor: "#8B0000", // DarkRed
    itens: [
      { id: 'cine_news', label: 'Notícias' },
      { id: 'cine_lanc', label: 'Lançamentos' },
      { id: 'cine_rev', label: 'Reviews' },
      { id: 'cine_bilh', label: 'Bilheteria' },
      { id: 'cine_bast', label: 'Bastidores' },
      { id: 'cine_prem', label: 'Premiações' }
    ]
  },
  {
    sessao: "TV & SÉRIES",
    cor: "#483D8B", // DarkSlateBlue
    itens: [
      { id: 'tv_news', label: 'Notícias' },
      { id: 'tv_lanc', label: 'Lançamentos' },
      { id: 'tv_rev', label: 'Reviews' },
      { id: 'tv_renov', label: 'Renovadas / Canceladas' },
      { id: 'tv_eps', label: 'Episódios' },
      { id: 'tv_bast', label: 'Bastidores' }
    ]
  },
  {
    sessao: "COMUNIDADE",
    cor: "#2F4F4F", // DarkSlateGray
    itens: [
      { id: 'com_op', label: 'Opinião do Leitor' },
      { id: 'com_enq', label: 'Enquetes' },
      { id: 'com_dest', label: 'Comentários em Destaque' },
      { id: 'com_fan', label: 'Fanarts' },
      { id: 'com_teo', label: 'Teorias da Comunidade' }
    ]
  },
  {
    sessao: "RANKING",
    cor: "#B8860B", // DarkGoldenRod
    itens: [
      { id: 'rank_jogos', label: 'Melhores Jogos' },
      { id: 'rank_animes', label: 'Melhores Animes' },
      { id: 'rank_filmes', label: 'Melhores Filmes' },
      { id: 'rank_series', label: 'Top Séries' },
      { id: 'rank_ano', label: 'Rankings do Ano' },
      { id: 'rank_voto', label: 'Votação do Público' }
    ]
  }
];

/* ===========================
   CSS INJETADO (Visual Harmônico)
=========================== */
const styles = `
  /* --- LAYOUT DA GAVETA --- */
  #ag-drawer {
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
    max-height: 0;
    transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
    opacity: 0;
    width: 100%;
    position: absolute;
    left: 0;
    z-index: 1000;
    box-shadow: 0 15px 30px rgba(0,0,0,0.08);
  }
  
  body.dark-mode #ag-drawer {
    background: #141414;
    border-color: #333;
    box-shadow: 0 15px 30px rgba(0,0,0,0.5);
  }

  #ag-drawer.open {
    max-height: 85vh; /* Altura máxima segura */
    opacity: 1;
  }

  .ag-drawer-scroll {
    max-height: 85vh;
    overflow-y: auto;
    padding: 30px 20px;
    scrollbar-width: thin;
  }

  /* --- HEADER: PESQUISA E MODOS --- */
  .ag-drawer-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    gap: 20px;
    flex-wrap: wrap;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .ag-search-wrapper {
    position: relative;
    flex: 1;
    min-width: 300px;
  }

  .ag-search-icon-svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    fill: #999;
    pointer-events: none;
  }

  .ag-search-input {
    width: 100%;
    padding: 12px 15px 12px 45px;
    border-radius: 8px;
    border: 1px solid #ddd;
    background: #f4f4f4;
    font-size: 14px;
    font-weight: 500;
    outline: none;
    transition: 0.3s;
  }

  body.dark-mode .ag-search-input {
    background: #1e1e1e;
    border-color: #333;
    color: #fff;
  }
  
  .ag-search-input:focus {
    background: #fff;
    border-color: var(--primary-color, #e50914);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  body.dark-mode .ag-search-input:focus {
    background: #252525;
  }

  /* --- BOTÕES DE MODO --- */
  .ag-mode-group {
    background: #f0f0f0;
    padding: 4px;
    border-radius: 8px;
    display: flex;
  }
  body.dark-mode .ag-mode-group { background: #222; }

  .ag-mode-btn {
    padding: 8px 16px;
    border: none;
    background: transparent;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #777;
    cursor: pointer;
    text-transform: uppercase;
    transition: 0.2s;
  }

  .ag-mode-btn.active {
    background: #fff;
    color: #000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  body.dark-mode .ag-mode-btn.active {
    background: #444;
    color: #fff;
  }

  /* --- SESSÕES E GRID HARMÔNICO --- */
  .ag-section-block {
    margin-bottom: 30px;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }

  .ag-section-title {
    font-size: 13px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #555;
  }
  body.dark-mode .ag-section-title { color: #aaa; }

  .ag-section-marker {
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }

  /* O GRID PERFEITO */
  .ag-grid-container {
    display: grid;
    /* Colunas responsivas mas com largura mínima fixa para uniformidade */
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
    gap: 10px;
  }

  .ag-card {
    position: relative;
    background: #f9f9f9;
    border: 1px solid transparent;
    border-radius: 6px;
    padding: 12px 10px;
    font-size: 13px;
    font-weight: 500;
    color: #444;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    /* Garante altura uniforme */
    height: 100%; 
    display: flex;
    align-items: center;
    justify-content: center;
  }

  body.dark-mode .ag-card {
    background: #1e1e1e;
    color: #ccc;
  }

  .ag-card:hover {
    background: #ececec;
    transform: translateY(-2px);
  }
  body.dark-mode .ag-card:hover { background: #2a2a2a; }

  /* ESTADO SELECIONADO */
  .ag-card.is-selected {
    background: #fff;
    border-color: var(--primary-color, #e50914);
    color: var(--primary-color, #e50914);
    box-shadow: inset 0 0 0 1px var(--primary-color, #e50914);
    font-weight: 700;
  }
  body.dark-mode .ag-card.is-selected {
    background: #1a1a1a;
  }

  /* --- INDICADOR (X ou 3 PONTOS) --- */
  .ag-card-action {
    position: absolute;
    top: 3px;
    right: 4px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    border-radius: 50%;
    color: inherit;
    opacity: 0.6;
    transition: 0.2s;
  }
  
  .ag-card.is-selected .ag-card-action {
    background: rgba(255,0,0,0.1); 
    color: inherit;
  }
  
  .ag-card-action:hover {
    background: var(--primary-color, #e50914);
    color: #fff !important;
    opacity: 1;
  }

`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

/* ===========================
   LÓGICA CORE
=========================== */
function load(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d }catch(e){ return d } }
function save(k,v){ localStorage.setItem(k,JSON.stringify(v)); }

function getMode(){ return load(CONFIG.KEYS.MODE, 'dynamic'); }
function setMode(m){ save(CONFIG.KEYS.MODE, m); renderDrawer(); }

// Recupera a lista de IDs salvos ou define o padrão
function getOrder(){
  const saved = load(CONFIG.KEYS.ORDER, null);
  if(saved) return saved;
  // Padrão inicial: primeiros 7 itens da primeira sessão
  return CATALOGO[0].itens.map(i=>i.id);
}

// Encontra o objeto completo do item pelo ID
function findItem(id){
  for(let sec of CATALOGO){
    const item = sec.itens.find(i => i.id === id);
    if(item) return item;
  }
  return null;
}

// Estatísticas para modo dinâmico
function track(id){
  if(getMode() !== 'dynamic') return;
  const stats = load(CONFIG.KEYS.STATS, {});
  stats[id] = (stats[id] || 0) + 1;
  save(CONFIG.KEYS.STATS, stats);
  
  // Reordenação automática baseada em uso
  const order = getOrder();
  order.sort((a,b) => (stats[b]||0) - (stats[a]||0));
  save(CONFIG.KEYS.ORDER, order);
}

/* ===========================
   INTERFACE: BARRA HORIZONTAL
=========================== */
function renderBar(){
  const bar = document.getElementById('filterScroller');
  if(!bar) return;

  // Garante que o container da gaveta existe logo após a barra
  let drawer = document.getElementById('ag-drawer');
  if(!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'ag-drawer';
    bar.parentNode.insertBefore(drawer, bar.nextSibling);
  }

  const order = getOrder();
  bar.innerHTML = '';

  order.forEach(id => {
    const item = findItem(id);
    if(!item) return;

    const btn = document.createElement('button');
    btn.className = 'filter-tag';
    btn.textContent = item.label;
    btn.onclick = () => {
      // Remove active de todos e adiciona no clicado
      document.querySelectorAll('#filterScroller .filter-tag').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      track(id);
      document.getElementById('ag-drawer').classList.remove('open');
      
      if(window.carregarSecao) window.carregarSecao(id);
      else console.log("Carregando:", id);
    };
    bar.appendChild(btn);
  });

  // Botão de Configuração
  const cfg = document.createElement('button');
  cfg.className = 'filter-tag cfg-btn';
  cfg.innerHTML = '⚙'; // Poderia ser SVG também
  cfg.onclick = toggleDrawer;
  bar.appendChild(cfg);
}

/* ===========================
   INTERFACE: GAVETA (DRAWER)
=========================== */
function toggleDrawer(){
  const drawer = document.getElementById('ag-drawer');
  if(!drawer) return;
  
  if(drawer.classList.contains('open')){
    drawer.classList.remove('open');
  } else {
    renderDrawer();
    drawer.classList.add('open');
    setTimeout(() => {
        const input = document.getElementById('ag-search-input');
        if(input) input.focus();
    }, 100);
  }
}

function renderDrawer(filterText = ""){
  const drawer = document.getElementById('ag-drawer');
  const currentOrder = getOrder();
  const currentMode = getMode();

  // SVG do ícone de pesquisa
  const searchIcon = `<svg class="ag-search-icon-svg" viewBox="0 0 24 24"><path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41z"/></svg>`;

  let html = `
    <div class="ag-drawer-scroll">
      <div class="ag-drawer-header">
        <div class="ag-search-wrapper">
          ${searchIcon}
          <input type="text" class="ag-search-input" id="ag-search-input" placeholder="Busque por categoria, ex: Animes, Jogos..." value="${filterText}">
        </div>
        
        <div class="ag-mode-group">
          <button id="btn-fixo" class="ag-mode-btn ${currentMode==='fixed'?'active':''}">Modo Fixo</button>
          <button id="btn-dinamico" class="ag-mode-btn ${currentMode==='dynamic'?'active':''}">Automático</button>
        </div>
      </div>

      <div id="ag-catalog-container">
        </div>
      
      <div style="text-align:center; padding-top:20px; font-size:12px; color:#888;">
        ${currentOrder.length} de ${CONFIG.MAX_TABS} abas ativas
      </div>
    </div>
  `;

  drawer.innerHTML = html;

  // Renderizar Sessões
  const container = document.getElementById('ag-catalog-container');
  const term = filterText.toLowerCase();

  CATALOGO.forEach(sec => {
    // Filtragem: Se tem texto, verifica se o nome da sessão OU algum item bate
    const itensFiltrados = sec.itens.filter(i => i.label.toLowerCase().includes(term));
    const sessaoMatch = sec.sessao.toLowerCase().includes(term);

    // Se não der match na sessão nem nos itens, pula (exceto se filtro vazio)
    if(term !== "" && !sessaoMatch && itensFiltrados.length === 0) return;

    // Se deu match na SESSÃO, mostra todos os itens dela. Se foi no ITEM, mostra só os filtrados.
    const itensParaMostrar = sessaoMatch ? sec.itens : itensFiltrados;

    // Criar Elemento da Sessão
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'ag-section-block';

    sectionDiv.innerHTML = `
      <div class="ag-section-title">
        <div class="ag-section-marker" style="background:${sec.cor}"></div>
        ${sec.sessao}
      </div>
      <div class="ag-grid-container" id="grid-${sec.sessao}"></div>
    `;
    
    container.appendChild(sectionDiv);
    const grid = sectionDiv.querySelector('.ag-grid-container');

    itensParaMostrar.forEach(item => {
      const isSelected = currentOrder.includes(item.id);
      
      const card = document.createElement('div');
      card.className = `ag-card ${isSelected ? 'is-selected' : ''}`;
      
      // Define qual ícone mostrar (X ou ...)
      let actionIcon = '';
      if(isSelected) {
        if(currentMode === 'dynamic') actionIcon = '✕'; // X pequeno
        else actionIcon = '•••'; // 3 pontos
      }

      card.innerHTML = `
        ${item.label}
        ${isSelected ? `<div class="ag-card-action" data-id="${item.id}" data-action="true">${actionIcon}</div>` : ''}
      `;

      // Evento de Clique no Card (Selecionar/Deselecionar)
      card.onclick = (e) => {
        // Se clicar especificamente no ícone de ação
        if(e.target.dataset.action || e.target.parentNode.dataset.action) {
          e.stopPropagation();
          handleAction(item.id);
          return;
        }
        toggleItem(item.id);
      };

      grid.appendChild(card);
    });
  });

  // Bind Eventos Globais da Gaveta
  document.getElementById('ag-search-input').oninput = (e) => renderDrawer(e.target.value);
  document.getElementById('btn-fixo').onclick = () => setMode('fixed');
  document.getElementById('btn-dinamico').onclick = () => setMode('dynamic');
}

/* ===========================
   AÇÕES DE ITENS
=========================== */
function toggleItem(id){
  let order = getOrder();
  if(order.includes(id)){
    // Remove
    order = order.filter(x => x !== id);
  } else {
    // Adiciona (com limite)
    if(order.length >= CONFIG.MAX_TABS) {
      alert(`Limite de ${CONFIG.MAX_TABS} abas atingido.`);
      return;
    }
    order.push(id);
  }
  save(CONFIG.KEYS.ORDER, order);
  renderBar();
  renderDrawer(document.getElementById('ag-search-input').value);
}

// Lida com clique no X ou ...
function handleAction(id){
  const mode = getMode();
  let order = getOrder();

  if(mode === 'dynamic') {
    // Modo Dinâmico: O X apenas remove
    order = order.filter(x => x !== id);
    save(CONFIG.KEYS.ORDER, order);
    renderBar();
    renderDrawer(document.getElementById('ag-search-input').value);
  } else {
    // Modo Fixo: Os 3 pontos permitem mover
    const currentIndex = order.indexOf(id);
    const newPos = prompt(`Mover "${findItem(id).label}" para qual posição? (1-${order.length})`, currentIndex + 1);
    
    if(newPos !== null){
      const targetIndex = parseInt(newPos) - 1;
      if(!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < order.length) {
        // Remove do antigo
        order.splice(currentIndex, 1);
        // Insere no novo
        order.splice(targetIndex, 0, id);
        
        save(CONFIG.KEYS.ORDER, order);
        renderBar();
        // Não re-renderiza gaveta inteira para não perder foco, apenas atualiza visual se necessário
        renderDrawer(document.getElementById('ag-search-input').value);
      }
    }
  }
}

/* Inicialização */
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderBar);
else renderBar();

})();
