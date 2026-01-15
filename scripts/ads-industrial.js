(function() {
    // === 1. CONFIGURAÇÃO E ESTADO ===
    let isTabActive = true;
    let interstitialCycle = 0;
    document.addEventListener("visibilitychange", () => isTabActive = !document.hidden);

    const adsRoot = document.createElement('div');
    adsRoot.id = 'premium-ads-system';
    document.body.appendChild(adsRoot);

    // === 2. ESTILIZAÇÃO IMPECÁVEL (ESTILO MANCHETES) ===
    const style = document.createElement('style');
    style.textContent = `
        #premium-ads-system { 
            font-family: 'Inter', 'Helvetica', sans-serif; 
            -webkit-font-smoothing: antialiased;
        }

        /* Container de Banner Estilo News */
        .premium-banner { 
            position: fixed; 
            left: 0; 
            width: 100%; 
            z-index: 2147483646; 
            background: #ffffff; 
            box-shadow: 0 -5px 25px rgba(0,0,0,0.08); 
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            border-top: 1px solid #eaeaea;
        }
        .premium-bottom { bottom: -100%; }
        .premium-top { top: -100%; border-top: none; border-bottom: 1px solid #eaeaea; }
        
        .premium-container { 
            max-width: 1100px; 
            margin: 0 auto; 
            padding: 12px 25px; 
        }

        /* Labels e Tags AdSense */
        .ad-meta-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 8px; 
        }
        .ad-label { 
            font-size: 10px; 
            font-weight: 800; 
            color: #888; 
            text-transform: uppercase; 
            letter-spacing: 1.5px; 
        }
        .ad-close-x { 
            background: #f5f5f5; 
            border: none; 
            width: 24px; 
            height: 24px; 
            border-radius: 50%; 
            cursor: pointer; 
            font-size: 14px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            color: #121212;
            transition: background 0.2s;
        }
        .ad-close-x:hover { background: #eee; }

        /* Placeholder do Anúncio (Branco Clean) */
        .ad-slot-placeholder {
            background: #fafafa;
            border: 1px solid #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ccc;
            font-size: 11px;
            font-weight: 600;
            margin: 0 auto;
        }
        .slot-300x250 { width: 300px; height: 250px; }
        .slot-leaderboard { width: 100%; height: 90px; }

        /* Interstitial Modal (Estilo Overlay Geek) */
        .premium-overlay { 
            position: fixed; 
            inset: 0; 
            background: rgba(255, 255, 255, 0.98); 
            backdrop-filter: blur(8px); 
            z-index: 2147483647; 
            display: none; 
            align-items: center; 
            justify-content: center; 
            opacity: 0; 
            transition: opacity 0.4s ease; 
        }
        .premium-modal { 
            background: #fff; 
            width: 95%; 
            max-width: 550px; 
            padding: 40px; 
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            text-align: center;
            transform: translateY(20px);
            transition: transform 0.4s ease;
        }

        .interstitial-title { 
            font-size: 28px; 
            font-weight: 800; 
            letter-spacing: -0.5px; 
            margin-bottom: 10px; 
            color: #121212;
        }

        /* Progress Bar Minimalista */
        .premium-prog-bg { 
            width: 100%; 
            height: 4px; 
            background: #f0f0f0; 
            margin: 25px 0; 
            border-radius: 2px;
            overflow: hidden;
        }
        .premium-prog-fill { 
            width: 0%; 
            height: 100%; 
            background: #121212; 
            transition: width 0.1s linear; 
        }

        /* Botão Skip Estilo Artigo */
        .btn-premium-skip { 
            background: #f0f0f0; 
            border: none; 
            padding: 16px 32px; 
            font-size: 12px; 
            font-weight: 800; 
            color: #aaa; 
            cursor: not-allowed; 
            text-transform: uppercase; 
            border-radius: 6px;
            width: 100%;
            transition: all 0.3s;
        }
        .btn-premium-skip.ready { 
            background: #121212; 
            color: #fff; 
            cursor: pointer; 
        }

        .ad-footer-info {
            margin-top: 20px;
            font-size: 11px;
            color: #888;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    `;
    document.head.appendChild(style);

    // === 3. ESTRUTURA HTML ===
    adsRoot.innerHTML = `
        <div id="p-block-1" class="premium-banner premium-bottom">
            <div class="premium-container">
                <div class="ad-meta-header">
                    <span class="ad-label">Anúncio Recomendado</span>
                    <button id="p-close-1" class="ad-close-x">×</button>
                </div>
                <div id="p-slot-1" class="ad-slot-placeholder slot-300x250">ANÚNCIO PUBLICITÁRIO</div>
            </div>
        </div>

        <div id="p-block-2-overlay" class="premium-overlay">
            <div class="premium-modal">
                <span class="ad-label" style="display:block; margin-bottom:15px;">Publicidade Patrocinada</span>
                <h2 class="interstitial-title">Conteúdo Exclusivo</h2>
                <p style="color:#666; font-size:14px;">Aguarde alguns segundos para prosseguir para o artigo.</p>
                
                <div class="ad-slot-placeholder" style="width:100%; height:250px; margin: 20px 0;">
                    ESPAÇO PARA PUBLICIDADE PREMIUM
                </div>

                <div class="premium-prog-bg"><div id="p-prog-2" class="premium-prog-fill"></div></div>
                
                <button id="p-close-2" class="btn-premium-skip" disabled>Aguarde</button>
                
                <div class="ad-footer-info">
                    <span id="p-timer-txt">SINCRONIZANDO...</span>
                    <span style="font-weight:700; color:#121212; cursor:pointer;">Privacidade do Anúncio</span>
                </div>
            </div>
        </div>

        <div id="p-block-3" class="premium-banner premium-top">
            <div class="premium-container">
                <div class="ad-meta-header">
                    <span class="ad-label">Destaque Parceiro</span>
                    <button id="p-close-3" class="ad-close-x">×</button>
                </div>
                <div class="ad-slot-placeholder slot-leaderboard">728 x 90 LEADERBOARD</div>
            </div>
        </div>
    `;

    const b1 = document.getElementById('p-block-1');
    const s1 = document.getElementById('p-slot-1');
    const b2Overlay = document.getElementById('p-block-2-overlay');
    const b2Modal = b2Overlay.querySelector('.premium-modal');
    const b3 = document.getElementById('p-block-3');

    // === 4. LÓGICA DE EXIBIÇÃO ===

    const openB1 = () => {
        b1.style.bottom = '0px';
        // Mutação de formato após 15s (300x250 -> 728x90)
        setTimeout(() => {
            b1.style.bottom = '-100%';
            setTimeout(() => {
                s1.className = 'ad-slot-placeholder slot-leaderboard';
                b1.style.bottom = '0px';
            }, 800);
        }, 15000);
    };

    document.getElementById('p-close-1').onclick = () => {
        b1.style.bottom = '-100%';
        setTimeout(openB1, 60000);
    };

    const openB3 = () => { b3.style.top = '0px'; };
    document.getElementById('p-close-3').onclick = () => {
        b3.style.top = '-100%';
        setTimeout(openB3, 45000);
    };

    function startInterstitial() {
        setTimeout(() => {
            b2Overlay.style.display = 'flex';
            setTimeout(() => {
                b2Overlay.style.opacity = '1';
                b2Modal.style.transform = 'translateY(0)';
            }, 50);

            const cycleTimes = [10, 5, 15];
            let timeLeft = cycleTimes[interstitialCycle % 3];
            const totalDuration = timeLeft;
            
            const btn = document.getElementById('p-close-2');
            const prog = document.getElementById('p-prog-2');
            const txt = document.getElementById('p-timer-txt');

            const countdown = setInterval(() => {
                if (isTabActive) {
                    if (timeLeft > 0) {
                        timeLeft--;
                        txt.innerText = `PROSSEGUIR EM ${timeLeft}S`;
                        prog.style.width = `${((totalDuration - timeLeft) / totalDuration) * 100}%`;
                    } else {
                        clearInterval(countdown);
                        txt.innerText = "PRONTO PARA SEGUIR";
                        btn.innerText = "PULAR PUBLICIDADE";
                        btn.disabled = false;
                        btn.classList.add('ready');
                    }
                }
            }, 1000);

            btn.onclick = () => {
                interstitialCycle++;
                b2Overlay.style.opacity = '0';
                b2Modal.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    b2Overlay.style.display = 'none';
                    setTimeout(startInterstitial, 120000);
                }, 500);
            };
        }, 30000);
    }

    // === 5. START ===
    setTimeout(openB1, 4000);
    setTimeout(openB3, 2000);
    startInterstitial();

})();
