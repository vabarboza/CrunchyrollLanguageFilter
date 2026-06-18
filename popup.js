const checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Load saved settings
chrome.storage.sync.get("hiddenLanguages", (data) => {
    const languages = data.hiddenLanguages || [];
    checkboxes.forEach(cb => {
        cb.checked = languages.includes(cb.value);
    });
});

// Save settings
document.getElementById("save").addEventListener("click", () => {
    const selected = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            selected.push(cb.value);
        }
    });

    chrome.storage.sync.set({
        hiddenLanguages: selected
    });

    window.close();
});

// Select All / Deselect All functionality
document.getElementById("select-all").addEventListener("click", () => {
    checkboxes.forEach(cb => {
        cb.checked = true;
    });
});

document.getElementById("clear-all").addEventListener("click", () => {
    checkboxes.forEach(cb => {
        cb.checked = false;
    });
});