async function getLanguages() {
    return new Promise(resolve => {
        chrome.storage.sync.get("hiddenLanguages", data => {
            resolve(data.hiddenLanguages || []);
        });
    });
}

async function hideReleases() {

    const languages = await getLanguages();

    document.querySelectorAll("article.release").forEach(release => {

        const titleElement =
            release.querySelector(".season-name cite");

        if (!titleElement)
            return;

        const title = titleElement.textContent;

        const shouldHide = languages.some(lang =>
            title.includes(`(${lang})`)
        );

        if (shouldHide) {
            release.style.display = "none";
        }
    });
}

hideReleases();

new MutationObserver(() => {
    hideReleases();
}).observe(document.body, {
    childList: true,
    subtree: true
});

chrome.storage.onChanged.addListener(() => {
    location.reload();
});