/**
 * ==========================================================================
 * MUSIC.JS — Sistema de Música Arcana v4
 * - Overlay de entrada SOMENTE na Home (data-page="home")
 * - Em outras páginas: música começa automaticamente via sessionStorage
 * - Loop infinito: ao terminar a fila, reinicia do início
 * - Musica 1 toca em TODAS as páginas; musica 2 fora do dashboard
 * ==========================================================================
 */

(function () {
    const isDashboard = document.body.dataset.page === "dashboard";
    const isHome = document.body.dataset.page === "home";

    const TRACKS = isDashboard
        ? [{ src: "audio/musica1.mp3", name: "Tema da Mesa de Estratégia" }]
        : [
              { src: "audio/musica1.mp3", name: "Tema Principal — Ato I" },
              { src: "audio/musica2.mp3", name: "Tema Principal — Ato II" },
          ];

    // Ajuste de caminho relativo para subpastas
    const pathPrefix = document.body.dataset.pathPrefix || "";
    const tracksWithPath = TRACKS.map(t => ({ ...t, src: pathPrefix + t.src }));

    let currentTrackIndex = 0;
    let audio = null;
    let isPlaying = false;

    const overlay = document.getElementById("start-overlay");
    const player = document.getElementById("music-player");
    const playerIcon = player ? player.querySelector(".player-icon") : null;
    const playerTrackName = player ? player.querySelector(".player-track-name") : null;
    const playerStatusDot = player ? player.querySelector(".player-status .dot") : null;
    const playerStatusText = player ? player.querySelector(".player-status span:last-child") : null;
    const btnToggle = document.getElementById("btn-toggle-music");

    function loadTrack(index) {
        if (audio) { audio.pause(); audio.src = ""; }
        const track = tracksWithPath[index];
        audio = new Audio(track.src);
        audio.volume = 0.55;
        audio.addEventListener("ended", onTrackEnded);
        audio.addEventListener("error", () => { console.warn("[Music] Erro:", track.src); onTrackEnded(); });
        updatePlayerUI();
    }

    function onTrackEnded() {
        const nextIndex = currentTrackIndex + 1;
        if (nextIndex < tracksWithPath.length) {
            currentTrackIndex = nextIndex;
        } else {
            // Loop infinito — volta para o início
            currentTrackIndex = 0;
        }
        loadTrack(currentTrackIndex);
        play();
    }

    function play() {
        if (!audio) return;
        audio.volume = 0;
        audio.play().then(() => {
            isPlaying = true;
            fadeIn();
            updatePlayerUI();
            sessionStorage.setItem("musicStarted", "true");
        }).catch((e) => { console.warn("[Music] Play bloqueado:", e); });
    }

    function pause() {
        if (!audio) return;
        fadeOut(() => { audio.pause(); isPlaying = false; updatePlayerUI(); });
    }

    function fadeIn() {
        let vol = 0;
        const target = 0.55;
        const step = target / 30;
        const interval = setInterval(() => {
            if (!audio) { clearInterval(interval); return; }
            vol = Math.min(vol + step, target);
            audio.volume = vol;
            if (vol >= target) clearInterval(interval);
        }, 50);
    }

    function fadeOut(callback) {
        if (!audio) { callback(); return; }
        let vol = audio.volume;
        const step = vol / 20;
        const interval = setInterval(() => {
            vol = Math.max(vol - step, 0);
            audio.volume = vol;
            if (vol <= 0) { clearInterval(interval); callback(); }
        }, 40);
    }

    function updatePlayerUI() {
        if (!player) return;
        const track = tracksWithPath[currentTrackIndex];
        if (playerTrackName) playerTrackName.textContent = TRACKS[currentTrackIndex].name;
        if (playerIcon) {
            playerIcon.textContent = isPlaying ? "🎵" : "🔇";
            playerIcon.classList.toggle("playing", isPlaying);
        }
        if (playerStatusDot) playerStatusDot.classList.toggle("paused", !isPlaying);
        if (playerStatusText) playerStatusText.textContent = isPlaying ? "Tocando" : "Pausado";
        if (btnToggle) btnToggle.textContent = isPlaying ? "Pausar" : "Tocar";
    }

    function showPlayer() {
        if (player) setTimeout(() => player.classList.add("visible"), 400);
    }

    function startExperience() {
        if (overlay) {
            overlay.classList.add("hidden");
            setTimeout(() => { overlay.style.display = "none"; }, 700);
        }
        showPlayer();
        loadTrack(currentTrackIndex);
        play();
    }

    // --- LÓGICA DE INÍCIO ---
    if (isHome) {
        // Na Home: SEMPRE mostra overlay para liberar áudio
        if (overlay) {
            overlay.addEventListener("click", startExperience, { once: true });
            document.addEventListener("keydown", (e) => {
                if ((e.code === "Space" || e.code === "Enter") && overlay.style.display !== "none") {
                    startExperience();
                }
            }, { once: true });
        }
    } else {
        // Em outras páginas: esconde overlay e inicia música automaticamente
        if (overlay) {
            overlay.style.display = "none";
        }
        showPlayer();
        // Tenta iniciar — funciona se o usuário já interagiu anteriormente
        loadTrack(currentTrackIndex);
        // Delay pequeno para aguardar DOM completo
        setTimeout(() => {
            play();
        }, 300);
    }

    // Botão toggle
    if (btnToggle) {
        btnToggle.addEventListener("click", () => {
            if (isPlaying) pause(); else play();
        });
    }

    // Clique no ícone do player
    if (playerIcon) {
        let pressTimer = null;
        playerIcon.addEventListener("mousedown", () => {
            pressTimer = setTimeout(() => { player.classList.toggle("minimized"); pressTimer = null; }, 500);
        });
        playerIcon.addEventListener("mouseup", () => {
            if (pressTimer !== null) {
                clearTimeout(pressTimer);
                pressTimer = null;
                if (isPlaying) pause(); else play();
            }
        });
    }

})();
