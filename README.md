# Crunchyroll Audio Filter

This package contains the extension with localized store metadata and popup UI.

## Included locales
English (default), Brazilian Portuguese, Spanish, French, German, Italian, Japanese, Korean, and Simplified Chinese.

## Notes
- The popup interface uses `chrome.i18n` and follows the browser UI language when a translation exists; English is the fallback.
- The filter preserves cards that list Portuguese audio (`PT`).
- Crunchyroll's displayed language codes can change. Verify the codes on current calendar cards before publishing.
- The `América Latina` and `Español` options both map to `ES` because the card metadata used by this script may not distinguish those variants.
- The manifest currently matches the `pt-br` calendar routes only, matching the supplied project configuration.
