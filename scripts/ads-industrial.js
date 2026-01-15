(function() {
// === 1. GESTÃO DE ESTADO E MONITORAMENTO ===
let isTabActive = true;
document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

// === 2. CONTAINER MESTRE (ROOT) ===  
const adsRoot = document.createElement('div');  
adsRoot.id = 'industrial-ads-system';  
document.body.appendChild(adsRoot);  

// === 3. ESTILIZAÇÃO (Ajustada para 300x250 no bloco inferior) ===  
const style = document.createElement('style');  
style.textContent = `  
    #industrial-ads-system { font-family: 'Helvetica', 'Arial', sans-serif; pointer-events: none; -webkit-font-smoothing: antialiased; }  
    #industrial-ads-system * { pointer-events: auto; box-sizing: border-box; }  
    .ind-shimmer { background: #111 linear-gradient(90deg, #111 0%, #222 50%, #111 100%); background-size: 200% 100%; animation: ind-shimmer-anim 1.5s infinite linear; }  
    @keyframes ind-shimmer-anim { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }  

    .ind-banner { position: fixed; left: 50%; transform: translateX(-50%); z-index: 2147483646; background: #ffffff; border: 2px solid #000; box-shadow: 0 0 30px rgba(0,0,0,0.3); transition: all 0.7s cubic-bezier(0.19, 1, 0.22, 1); }  
    
    /* Ajuste Bloco Inferior para 300x250 */
    .ind-bottom { bottom: -600px; width: 320px; height: 310px; padding: 5px; } 
    .ind-top { top: -600px; width: 100%; left: 0; transform: none; } 
    
    .ind-container { width: 100%; margin: 0 auto; padding: 5px; }  

    .ind-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }  
    .ind-label { font-size: 10px; font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: 1px; }  
    .ind-close-btn { font-size: 10px; font-weight: 900; background: #000; color: #fff; border: none; padding: 4px 10px; cursor: pointer; text-transform: uppercase; }  

    /* Container exato da sua Zona 300x250 */
    .ind-slot-300x250 { width: 300px; height: 250px; margin: 0 auto; background: #f9f9f9; display: flex; align-items: center; justify-content: center; overflow: hidden; }  
    .ind-slot-top { width: 100%; height: 90px; border: 1px solid #eee; }  

    .ind-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.9); backdrop-filter: grayscale(100%); z-index: 2147483647; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.4s ease; }  
    .ind-modal { background: #fff; width: 100%; max-width: 480px; padding: 40px; border-radius: 0; border-top: 10px solid #000; box-shadow: 0 40px 100px rgba(0,0,0,0.8); transform: translateY(20px); transition: transform 0.4s ease; }  
    .ind-slot-hero { width: 100%; height: 300px; margin-bottom: 25px; }  

    .ind-btn-skip { background: #f0f0f0; border: 1px solid #ddd; padding: 12px 30px; font-size: 12px; font-weight: 800; color: #888; cursor: not-allowed; text-transform: uppercase; border-radius: 0; }  
    .ind-btn-skip.ready { background: #000; color: #fff; border-color: #000; cursor: pointer; }  

    .ind-progress-bg { width: 100%; height: 4px; background: #eee; border-radius: 0; margin-bottom: 20px; }  
    .ind-progress-fill { width: 0%; height: 100%; background: #000; transition: width 0.1s linear; }  

    .ind-footer { display: flex; justify-content: space-between; align-items: center; }  
    .ind-cta { background: #000; color: #fff; text-decoration: none; padding: 14px 35px; font-size: 13px; font-weight: 800; text-transform: uppercase; border: 2px solid #000; transition: all 0.3s; }  
`;  
document.head.appendChild(style);  

// === 4. ESTRUTURA DOS BLOCOS (HTML) ===  
adsRoot.innerHTML = `  
    <div id="ind-block-1" class="ind-banner ind-bottom">  
        <div class="ind-container">  
            <div class="ind-header">  
                <span class="ind-label">Publicidade</span>  
                <button id="ind-close-1" class="ind-close-btn">X</button>  
            </div>  
            <div id="ad-slot-multi-300" class="ind-slot-300x250">
                </div>  
        </div>  
    </div>  

    <div id="ind-block-2-overlay" class="ind-overlay">  
        <div class="ind-modal">  
            <div class="ind-header">  
                <span class="ind-label">Publicidade Premium</span>  
                <button id="ind-close-2" class="ind-btn-skip" disabled>Aguarde</button>  
            </div>  
            <div class="ind-slot-hero ind-shimmer"></div>  
            <div class="ind-progress-bg"><div id="ind-prog-2" class="ind-progress-fill"></div></div>  
            <div class="ind-footer">  
                <span id="ind-timer-txt" style="font-size:11px; font-weight:900; color:#000;">AGUARDE...</span>  
                <a href="#" target="_blank" class="ind-cta">Visitar Site</a>  
            </div>  
        </div>  
    </div>  

    <div id="ind-block-3" class="ind-banner ind-top">  
        <div class="ind-container">  
            <div class="ind-header">  
                <span class="ind-label">Destaque</span>  
                <button id="ind-close-3" class="ind-close-btn">Fechar</button>  
            </div>  
            <div class="ind-slot-top ind-shimmer"></div>  
        </div>  
    </div>  
`;  

// === 5. FUNÇÃO PARA CARREGAR O SEU ANÚNCIO (ZONA 872330) ===
function loadMyCustomAd() {
    const container = document.getElementById('ad-slot-multi-300');
    // Limpa o container caso já exista algo
    container.innerHTML = '';
    
    const s = document.createElement('script');
    s.src = "//piercing-flower.com/bRX/V.sLd/Gvl/0hYJWDcH/JeVmY9cuSZfUvlvkFPjTrY/3NNgDEg_0DMfjTYitANajEcd0-OsDqQRysN/wo";
    s.async = true;
    s.referrerPolicy = 'no-referrer-when-downgrade';
    
    // Configurações da sua zona passadas via objeto
    window.hamli = {}; 
    
    container.appendChild(s);
}

// === 6. LÓGICA DE EXECUÇÃO ===  
const b1 = document.getElementById('ind-block-1');  
const b2Overlay = document.getElementById('ind-block-2-overlay');  
const b2Modal = b2Overlay.querySelector('.ind-modal');  
const b3 = document.getElementById('ind-block-3');  

const openB1 = () => { 
    b1.style.bottom = '10px'; 
    loadMyCustomAd(); // Carrega o seu anúncio quando o banner subir
};  
const openB3 = () => { b3.style.top = '0px'; };  

// Bloco 1 (Inferior 300x250)  
document.getElementById('ind-close-1').onclick = () => {  
    b1.style.bottom = '-600px';  
    setTimeout(openB1, 80000);  
};  

// Bloco 3 (Superior)  
document.getElementById('ind-close-3').onclick = () => {  
    b3.style.top = '-600px';  
    setTimeout(openB3, 10000);  
};  

// Bloco 2 (Interstitial)
function startInterstitial() {  
    setTimeout(() => {  
        b2Overlay.style.display = 'flex';  
        setTimeout(() => {  
            b2Overlay.style.opacity = '1';  
            b2Modal.style.transform = 'translateY(0)';  
        }, 50);  

        let timeLeft = 15; 
        const totalDuration = 15;  
        const btn = document.getElementById('ind-close-2');  
        const prog = document.getElementById('ind-prog-2');  
        const txt = document.getElementById('ind-timer-txt');  

        const countdown = setInterval(() => {  
            if (isTabActive) {  
                if (timeLeft > 0) {  
                    timeLeft--;  
                    txt.innerText = `ACESSO EM ${timeLeft}S`;  
                    prog.style.width = `${((totalDuration - timeLeft) / totalDuration) * 100}%`;  
                } else {  
                    clearInterval(countdown);  
                    txt.innerText = "PRONTO PARA ACESSAR";  
                    btn.innerText = "PULAR ANÚNCIO";  
                    btn.disabled = false;  
                    btn.classList.add('ready');  
                }  
            } else {  
                txt.innerText = "CRONÔMETRO PAUSADO";  
            }  
        }, 1000);  

        btn.onclick = () => {  
            b2Overlay.style.opacity = '0';  
            b2Modal.style.transform = 'translateY(20px)';  
            setTimeout(() => {  
                b2Overlay.style.display = 'none';  
                setTimeout(startInterstitial, 60000); 
            }, 500);  
        };  
    }, 5000);  
}  

// Inicialização  
setTimeout(openB1, 2000);  
setTimeout(openB3, 4000);  
startInterstitial();

})();
