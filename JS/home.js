/**
 * ==========================================================================
 * HOME.JS — Interatividade da página Home
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
    configurarEfeitosEscudo();
    animarEntradaHero();
    adicionarEfeitoParticulas();
});

function configurarEfeitosEscudo() {
    const escudo = document.querySelector(".rpg-shield");
    if (!escudo) return;

    escudo.addEventListener("mouseenter", () => {
        escudo.style.boxShadow = "0 20px 60px rgba(157, 78, 221, 0.55)";
    });
    escudo.addEventListener("mouseleave", () => {
        escudo.style.boxShadow = "0 12px 50px rgba(75, 0, 130, 0.45)";
    });
}

function animarEntradaHero() {
    const heroContent = document.querySelector(".hero-content");
    const heroBadge = document.querySelector(".hero-badge");
    if (!heroContent || !heroBadge) return;

    heroContent.style.opacity = "0";
    heroContent.style.transform = "translateX(-30px)";
    heroBadge.style.opacity = "0";
    heroBadge.style.transform = "translateX(30px)";

    setTimeout(() => {
        heroContent.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        heroContent.style.opacity = "1";
        heroContent.style.transform = "translateX(0)";
    }, 300);

    setTimeout(() => {
        heroBadge.style.transition = "opacity 0.7s ease, transform 0.7s ease";
        heroBadge.style.opacity = "1";
        heroBadge.style.transform = "translateX(0)";
    }, 500);
}

/**
 * Efeito de partículas/runas flutuando no fundo da hero section
 * (criação dinâmica de elementos decorativos)
 */
function adicionarEfeitoParticulas() {
    const heroSection = document.querySelector(".hero-section");
    if (!heroSection) return;

    const runas = ["✦", "⚔", "✧", "◆", "✦"];
    const container = document.createElement("div");
    container.style.cssText = `
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
    `;
    heroSection.style.position = "relative";

    runas.forEach((runa, i) => {
        const el = document.createElement("span");
        el.textContent = runa;
        el.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 14 + 10}px;
            color: rgba(157, 78, 221, ${Math.random() * 0.06 + 0.02});
            left: ${Math.random() * 90 + 5}%;
            top: ${Math.random() * 80 + 10}%;
            animation: float-rune-${i} ${Math.random() * 8 + 6}s ease-in-out infinite;
            animation-delay: ${Math.random() * 4}s;
        `;
        container.appendChild(el);
    });

    // Injetar keyframes de float
    const style = document.createElement("style");
    runas.forEach((_, i) => {
        const yOffset = Math.random() * 20 + 8;
        style.textContent += `
            @keyframes float-rune-${i} {
                0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
                50% { transform: translateY(-${yOffset}px) rotate(${Math.random() * 20 - 10}deg); opacity: 1; }
            }
        `;
    });
    document.head.appendChild(style);
    heroSection.appendChild(container);
}
