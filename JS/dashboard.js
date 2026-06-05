/**
 * ==========================================================================
 * DASHBOARD.JS — Lógica da Mesa de Estratégia
 * Three.js avatar + controle de quests + atributos dinâmicos
 * ==========================================================================
 */

// --- DADOS DO HERÓI ---
const heroi = {
    nome: "nyyxx",
    tituloClasse: "Dev em Formação",
    level: 2,
    xpAtual: 65,
    atributos: {
        mana: 1420,
        ouro: 3,
        estamina: "Em constante evolução",
    },
    listaQuests: [
        {
            id: 1,
            titulo: "Forjar a Base da Dashboard Multipáginas",
            descricao: "Estruturar HTML semântico e estilização CSS Dark/Purple.",
            xpRecompensa: 150,
            status: "Concluída",
        },
        {
            id: 2,
            titulo: "Aprender Manipulação Dinâmica de DOM",
            descricao: "Conectar arquivos JavaScript para dar vida às barras e botões.",
            xpRecompensa: 250,
            status: "Em Andamento",
        },
        {
            id: 3,
            titulo: "Dominar a Arte das APIs e Bancos de Dados",
            descricao: "Desbloquear o back-end e transmutar em um verdadeiro FullStack.",
            xpRecompensa: 500,
            status: "Bloqueada",
            requisitoLvl: 5,
        },
    ],
};

// --- INICIALIZAÇÃO ---
document.addEventListener("DOMContentLoaded", function () {
    atualizarDashboard();
});

function atualizarDashboard() {
    // XP bar e level
    const xpText = document.querySelector(".status-value");
    const xpBar = document.querySelector(".xp-bar");
    if (xpText) xpText.textContent = `LVL 0${heroi.level} — ${heroi.xpAtual}%`;
    if (xpBar) xpBar.style.width = `${heroi.xpAtual}%`;

    // Atributos
    const boxes = document.querySelectorAll(".attr-box p");
    if (boxes.length >= 3) {
        boxes[0].textContent = `${heroi.atributos.mana.toLocaleString("pt-BR")} Linhas Forjadas`;
        boxes[1].textContent = `${heroi.atributos.ouro} Tecnologias em Estudo`;
        boxes[2].textContent = heroi.atributos.estamina;
    }

    renderizarQuests();
}

function renderizarQuests() {
    const container = document.querySelector(".quests-list");
    if (!container) return;
    container.innerHTML = "";

    heroi.listaQuests.forEach((quest) => {
        let cls = "locked";
        let label = quest.status;

        if (quest.status === "Concluída") {
            cls = "completed";
            label = `Concluída (+${quest.xpRecompensa} XP)`;
        } else if (quest.status === "Em Andamento") {
            cls = "active";
        } else if (quest.status === "Bloqueada" && quest.requisitoLvl) {
            label = `Bloqueada (Requer LVL ${quest.requisitoLvl})`;
        }

        container.innerHTML += `
            <div class="quest-item-box">
                <div class="quest-main-info">
                    <span class="quest-bullet">🔹</span>
                    <div>
                        <h4>${quest.titulo}</h4>
                        <p>${quest.descricao}</p>
                    </div>
                </div>
                <span class="quest-tag ${cls}">${label}</span>
            </div>
        `;
    });
}

// --- AVATAR THREE.JS ---
