/**
 * ==========================================================================
 * BOSS.JS — Sistema de Boss Fight (Modal de Contato)
 * ==========================================================================
 */

const DIALOGUES = [
    "Um desconhecido adentra a arena. O ar fica tenso...",
    "O dev nyyxx ergue sua espada de código.",
    "Sua ideia aguarda na escuridão. O duelo começa.",
    "Escolha seu ataque — WhatsApp, LinkedIn ou GitHub.",
];

let dialogueIndex = 0;
let dialogueTimer = null;

function iniciarBossFight(e) {
    if (e) e.preventDefault();

    const overlay = document.getElementById('boss-fight-overlay');
    if (!overlay) return;

    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active');

    // Impede scroll do body
    document.body.style.overflow = 'hidden';

    // Inicia ciclo de diálogos
    dialogueIndex = 0;
    avancarDialogo();
    dialogueTimer = setInterval(avancarDialogo, 3200);

    // Fecha com ESC
    document.addEventListener('keydown', escListener);
}

function fecharBoss() {
    const overlay = document.getElementById('boss-fight-overlay');
    if (!overlay) return;

    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    clearInterval(dialogueTimer);
    dialogueIndex = 0;

    document.removeEventListener('keydown', escListener);
}

function escListener(e) {
    if (e.key === 'Escape') fecharBoss();
}

function avancarDialogo() {
    const el = document.getElementById('boss-dialogue-text');
    if (!el) return;

    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s';

    setTimeout(() => {
        el.textContent = DIALOGUES[dialogueIndex % DIALOGUES.length];
        el.style.opacity = '1';
        dialogueIndex++;
    }, 300);
}

// Fechar clicando fora da arena
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('boss-fight-overlay');
    if (!overlay) return;

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) fecharBoss();
    });
});
