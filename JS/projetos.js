/**
 * ==========================================================================
 * PROJETOS.JS — Invocação da API GitHub v4
 * Fichas RPG com: descrição, linguagem, tópicos, data de atualização, stats
 * ==========================================================================
 */

const GITHUB_USERNAME = "wallysonjoh";

// Mapa de cores para linguagens
const LANG_COLORS = {
    "JavaScript": "#f7df1e",
    "TypeScript": "#3178c6",
    "HTML":       "#e34c26",
    "CSS":        "#264de4",
    "Python":     "#3572A5",
    "Java":       "#b07219",
    "Shell":      "#89e051",
    "C":          "#555555",
    "C++":        "#f34b7d",
    "PHP":        "#4F5D95",
};

function getLangDotClass(lang) {
    const map = {
        "JavaScript": "js", "TypeScript": "ts",
        "HTML": "html", "CSS": "css",
        "Python": "python", "Java": "java",
    };
    return "lang-dot-" + (map[lang] || "default");
}

function getRankByAge(repo) {
    const days = (Date.now() - new Date(repo.created_at)) / 86400000;
    if (days < 90) return "✦ Artefato Recente";
    if (days < 365) return "⚔ Artefato em Campo";
    return "📜 Artefato Veterano";
}

function formatDate(str) {
    return new Date(str).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "short", year: "numeric"
    });
}

document.addEventListener("DOMContentLoaded", function () {
    invocarProjetosGitHub();
});

async function invocarProjetosGitHub() {
    const container  = document.getElementById("projects-container");
    const totalEl    = document.getElementById("total-repos");
    const searchInput= document.getElementById("repo-search");
    const langFilter = document.getElementById("lang-filter");
    const statRepos  = document.getElementById("stat-repos");
    const statLangs  = document.getElementById("stat-langs");
    const statStars  = document.getElementById("stat-stars");

    if (!container) return;

    try {
        const resposta = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
        );
        if (!resposta.ok) throw new Error(`GitHub API: ${resposta.status}`);

        const todos = await resposta.json();
        const repositorios = todos.filter(r => !r.fork);

        // Preencher stats do hero
        const totalStars = repositorios.reduce((s, r) => s + r.stargazers_count, 0);
        const langs = [...new Set(repositorios.map(r => r.language).filter(Boolean))];
        if (statRepos)  statRepos.textContent  = repositorios.length;
        if (statLangs)  statLangs.textContent  = langs.length;
        if (statStars)  statStars.textContent  = totalStars;

        if (totalEl) totalEl.textContent = `${repositorios.length} Artefato${repositorios.length !== 1 ? "s" : ""} Encontrado${repositorios.length !== 1 ? "s" : ""}`;

        // Botões de filtro por linguagem
        if (langFilter) {
            langs.forEach(lang => {
                const btn = document.createElement("button");
                btn.className = "lf-btn";
                btn.dataset.lang = lang;
                btn.textContent = lang;
                langFilter.appendChild(btn);
            });

            langFilter.addEventListener("click", (e) => {
                const btn = e.target.closest(".lf-btn");
                if (!btn) return;
                langFilter.querySelectorAll(".lf-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                aplicarFiltros();
            });
        }

        function aplicarFiltros() {
            const termo = searchInput ? searchInput.value.toLowerCase().trim() : "";
            const langAtiva = langFilter ? (langFilter.querySelector(".lf-btn.active")?.dataset.lang || "all") : "all";

            const filtrados = repositorios.filter(r => {
                const nomeOk = r.name.toLowerCase().includes(termo) ||
                               (r.description && r.description.toLowerCase().includes(termo));
                const langOk = langAtiva === "all" || r.language === langAtiva;
                return nomeOk && langOk;
            });

            if (totalEl) totalEl.textContent = `${filtrados.length} Artefato${filtrados.length !== 1 ? "s" : ""} Encontrado${filtrados.length !== 1 ? "s" : ""}`;
            renderizar(filtrados);
        }

        const renderizar = (lista) => {
            container.innerHTML = "";
            if (lista.length === 0) {
                container.innerHTML = `<div class="loading-spell">Nenhum artefato encontrado neste grimório.</div>`;
                return;
            }

            lista.forEach(repo => {
                const nome       = repo.name;
                const descricao  = repo.description || "Nenhuma descrição foi gravada no pergaminho README deste repositório.";
                const linguagem  = repo.language || "—";
                const linkGit    = repo.html_url;
                const linkVercel = `https://${nome}.vercel.app`;
                const rank       = getRankByAge(repo);
                const updated    = formatDate(repo.updated_at);
                const dotClass   = getLangDotClass(linguagem);
                const langColor  = LANG_COLORS[linguagem] || "#6b80a8";

                const card = document.createElement("article");
                card.className = "project-api-card";
                card.innerHTML = `
                    <div class="pac-header-bar">
                        <span class="pac-rank">${rank}</span>
                        <span class="pac-updated">Atualizado: ${updated}</span>
                    </div>
                    <div class="pac-body">
                        <div class="pac-title-row">
                            <h3>${nome.replace(/-/g, " ")}</h3>
                            <span class="pac-stars">⭐ ${repo.stargazers_count}</span>
                        </div>
                        <p class="pac-desc">${descricao}</p>
                        ${repo.topics && repo.topics.length > 0 ?
                            `<div class="pac-topics">${repo.topics.slice(0,5).map(t => `<span class="pac-topic">#${t}</span>`).join("")}</div>`
                            : ""}
                    </div>
                    <div class="pac-footer">
                        <div class="pac-lang-badge">
                            <span class="pac-lang-dot ${dotClass}" style="background:${langColor}"></span>
                            <span class="pac-lang-name">${linguagem}</span>
                        </div>
                        <div class="pac-links">
                            <a href="${linkGit}" target="_blank" rel="noopener" class="pac-link code">Code</a>
                            <a href="${linkVercel}" target="_blank" rel="noopener" class="pac-link live">Live ↗</a>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        };

        renderizar(repositorios);

        if (searchInput) {
            searchInput.addEventListener("input", aplicarFiltros);
        }

    } catch (erro) {
        console.error("[GitHub API]", erro);
        container.innerHTML = `
            <div class="loading-spell error">
                <span style="font-size:2rem">⚠️</span>
                Erro ao invocar a API do GitHub. Verifique a conexão ou tente mais tarde.
            </div>
        `;
        if (totalEl) totalEl.textContent = "Erro na invocação";
    }
}
