# Internationalization

Folder contains all languages available.

## How to add new language

1. Copy the [en.json](en.json) into a new language file and manually translate strings.
2. Import the new language file in the [messages.ts](/utils/i18n/messages.ts) and extend the `messages` & `LOCALES` constants.
3. You should also add pluralization rules for the new language in the [pluralRules.ts](/utils/i18n/pluralRules.ts) file.

