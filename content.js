const LANGUAGE_CODES = {
    "Deutsch": ["DE"],
    "English": ["EN"],
    "Español": ["ES"],
    "हिंदी": ["HI"],
    "தமிழ்": ["TA"],
    "العربية": ["AR"],
    "América Latina": ["ES"],
    "Português (Brasil)": ["PT"],
    "Français": ["FR"],
    "Italiano": ["IT"],
    "తెలుగు": ["TE"],
    "Bahasa Indonesia": ["ID"],
    "ไทย": ["TH"],
    "普通话": ["ZH", "ZH-CN", "ZH_CN"],
    "Polski": ["PL"],
    "한국어": ["KO"]
};

let hiddenLanguageCodes = ["DE"];

function getCodesFromSelectedNames(names) {
    return names.flatMap((name) => LANGUAGE_CODES[name] || [String(name).toUpperCase()]);
}

function filterReleaseCards() {
    document.querySelectorAll('a[data-t="watch-page-link"]').forEach((link) => {
        const text = link.querySelector('span[data-t="sr-only"]')?.textContent || "";
        const match = text.match(/Idiomas de áudio:\s*(.*?)(?:,\s*Lançamento\b|$)/i)
            || text.match(/Audio languages:\s*(.*?)(?:,\s*Release\b|$)/i);
        if (!match) return;

        const codes = match[1]
            .split(",")
            .map((code) => code.trim().toUpperCase())
            .filter(Boolean);

        // Preserve any title that includes Portuguese audio, regardless of other selected languages.
        const hasPortuguese = codes.includes("PT");
        const shouldHide = !hasPortuguese && hiddenLanguageCodes.some((code) => codes.includes(code));

        const cell = link.closest('[data-t="release-cell"]');
        if (cell) {
            cell.hidden = shouldHide;
        } else {
            const card = link.closest('[data-t="release-calendar-card"]');
            if (card) card.hidden = shouldHide;
        }
    });
}

function loadFilterSettings() {
    chrome.storage.sync.get({ hiddenLanguages: ["Deutsch"] }, (data) => {
        const selectedNames = Array.isArray(data.hiddenLanguages) ? data.hiddenLanguages : ["Deutsch"];
        hiddenLanguageCodes = getCodesFromSelectedNames(selectedNames);
        filterReleaseCards();
    });
}

loadFilterSettings();

let scheduled = false;
const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
        scheduled = false;
        filterReleaseCards();
    });
});
observer.observe(document.body, { childList: true, subtree: true, characterData: true });

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "sync" && changes.hiddenLanguages) {
        loadFilterSettings();
    }
});
