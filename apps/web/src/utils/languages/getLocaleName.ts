import { fallbackLanguage } from "./const";

const localeDisplayNamesCache = new Map<string, Intl.DisplayNames>();

export const getLocaleName = (
	tag: string,
	locale: string,
): string | undefined => {
	try {
		const [canonicalTag] = Intl.getCanonicalLocales(tag);
		const [canonicalLocale] = Intl.getCanonicalLocales(locale);

		const resolvedTag = canonicalTag || tag;
		const resolvedLocale = canonicalLocale || locale;
		const cacheKey = `${resolvedLocale}::language`;

		if (!localeDisplayNamesCache.has(cacheKey)) {
			localeDisplayNamesCache.set(
				cacheKey,
				new Intl.DisplayNames([resolvedLocale, fallbackLanguage], { type: "language" }),
			);
		}

		const displayNames = localeDisplayNamesCache.get(cacheKey)!;

		return (displayNames.of(resolvedTag) ?? undefined);
	} catch {
		return (undefined);
	}
};
