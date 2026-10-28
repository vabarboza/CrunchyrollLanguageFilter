
const IDIOMAS_PADRAO = ["DE"];

const NOMES_PARA_CODIGOS = {
    "Deutsch": "DE",
    "English": "EN",
    "Español": "ES",
    "हिंदी": "HI",
    "தமிழ்": "TA",
    "العربية": "AR",
    "América Latina": "ES",
    "Português (Brasil)": "PT",
    "Français": "FR",
    "Italiano": "IT",
    "తెలుగు": "TE",
    "Bahasa Indonesia": "ID",
    "ไทย": "TH",
    "普通话": "ZH",
    "Polski": "PL",
    "한국어": "KO"
};

let idiomasOcultos = IDIOMAS_PADRAO;

function encontrarCartao(link) {
    let elemento = link.parentElement;

    // Procura o contêiner do cartão sem ocultar a página inteira.
    for (let i = 0; elemento && i < 7; i++) {
        const classe = typeof elemento.className === "string"
            ? elemento.className
            : "";

        if (
            classe.includes("release-calendar-card") &&
            !classe.includes("__link")
        ) {
            return elemento;
        }

        elemento = elemento.parentElement;
    }

    // Alternativa: oculta apenas o link, caso não encontre o cartão.
    return link;
}

function filtrarCartoes() {
    document.querySelectorAll(
        'a[data-t="watch-page-link"]'
    ).forEach(link => {
        const texto = link.querySelector(
            'span[data-t="sr-only"]'
        )?.textContent || "";

        const match = texto.match(
            /Idiomas de áudio:\s*(.*?)(?:,\s*Lançamento\b|$)/i
        );

        if (!match) return;

        const codigos = match[1]
            .split(",")
            .map(codigo => codigo.trim().toUpperCase())
            .filter(Boolean);

        const temPortugues = codigos.includes("PT");

        const deveOcultar = !temPortugues && idiomasOcultos.some(
            codigo => codigos.includes(codigo)
        );

        const celula = link.closest('[data-t="release-cell"]');

        if (celula) {
            celula.hidden = deveOcultar;
        } else {
            const cartao = link.closest(
                '[data-t="release-calendar-card"]'
            );

            if (cartao) {
                cartao.hidden = deveOcultar;
            }
        }
    });
}

function carregarConfiguracao() {
    chrome.storage.sync.get(
        { hiddenLanguages: ["Deutsch"] },
        dados => {
            idiomasOcultos = dados.hiddenLanguages.map(
                nome => NOMES_PARA_CODIGOS[nome] || nome.toUpperCase()
            );

            filtrarCartoes();
        }
    );
}

carregarConfiguracao();

let agendado = false;

const observer = new MutationObserver(() => {
    if (agendado) return;

    agendado = true;

    requestAnimationFrame(() => {
        agendado = false;
        filtrarCartoes();
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.hiddenLanguages) {
        carregarConfiguracao();
    }
});


