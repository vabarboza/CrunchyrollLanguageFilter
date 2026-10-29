const checkboxes = document.querySelectorAll('input[type="checkbox"]');

function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        const message = chrome.i18n.getMessage(key);
        if (message) element.textContent = message;
    });
    document.documentElement.lang = chrome.i18n.getUILanguage().replace("_", "-");
}

function loadSettings() {
    chrome.storage.sync.get({ hiddenLanguages: [] }, (data) => {
        const languages = Array.isArray(data.hiddenLanguages) ? data.hiddenLanguages : [];
        checkboxes.forEach((checkbox) => {
            checkbox.checked = languages.includes(checkbox.value);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    applyTranslations();
    loadSettings();

    document.getElementById("save").addEventListener("click", () => {
        const selected = Array.from(checkboxes)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

        chrome.storage.sync.set({ hiddenLanguages: selected }, () => {
            window.close();
        });
    });

    document.getElementById("select-all").addEventListener("click", () => {
        checkboxes.forEach((checkbox) => { checkbox.checked = true; });
    });

    document.getElementById("clear-all").addEventListener("click", () => {
        checkboxes.forEach((checkbox) => { checkbox.checked = false; });
    });
});
