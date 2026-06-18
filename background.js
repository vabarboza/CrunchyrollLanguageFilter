chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        hiddenLanguages: [
            "Deutsch",
            "América Latina"
        ]
    });
});