const displayNamesCache = new Map<string, Intl.DisplayNames>();
export const getNativeName = (tag: string): string | undefined => {
    try {
        // canonicalize the tag (ex: "pt-br" -> "pt-BR")
        const [canon] = Intl.getCanonicalLocales(tag);
        const key = canon || tag;

        if (!displayNamesCache.has(key)) {
            // Locale = Native name (fallback "en" if unavailable)
            displayNamesCache.set(
                key,
                new Intl.DisplayNames([key, "en"], { type: "language" })
            );
        }

        const displayName = displayNamesCache.get(key)!;
        return (displayName.of(key) ?? undefined); // autonym
    } catch {
        return (undefined);
    }
};
