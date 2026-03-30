import { SavedVocabularyTerm } from "@repo/types";

const normTranslations = (translations: Record<string, string>) => (
    Object.fromEntries(
        Object.entries(translations)
            .map(([locale, value]) => ([locale.trim(), value.trim()]))
            .filter(([locale, value]) => (Boolean(locale) && Boolean(value)))
            .sort(([a], [b]) => (a.localeCompare(b)))
    )
);

const sameTranslations = (
    a: Record<string, string>,
    b: Record<string, string>
) => {
    const A = normTranslations(a);
    const B = normTranslations(b);

    const keysA = Object.keys(A);
    const keysB = Object.keys(B);

    if (keysA.length !== keysB.length) return (false);

    return (keysA.every((key) => A[key] === B[key]));
};

const sameColor = (a: any, b: any) => (JSON.stringify(a) === JSON.stringify(b));
const sameOccurrence = (
    a?: SavedVocabularyTerm["occurrence"],
    b?: SavedVocabularyTerm["occurrence"]
) => (JSON.stringify(a ?? null) === JSON.stringify(b ?? null));

export const diffVocabulary = (
    initial: Array<SavedVocabularyTerm>,
    current: Array<SavedVocabularyTerm>
) => {
    const byIdInitial = new Map(initial.filter((t) => t.id).map((t) => [t.id, t]));
    const byIdCurrent = new Map(current.filter((t) => t.id).map((t) => [t.id, t]));

    const toAddOrUpdate: Array<SavedVocabularyTerm> = [];
    const toRemove: Array<{ termId: string }> = [];

    // parcours des termes courants (ajouts/updates)
    for (const t of current) {
        if (!t.id) {
            // nouveau
            toAddOrUpdate.push({ ...t, translations: normTranslations(t.translations) });
            continue;
        }

        const prev = byIdInitial.get(t.id);
        if (!prev) {
            // ré-attaché ou arrivé via sync externe
            toAddOrUpdate.push({ ...t, translations: normTranslations(t.translations) });
            continue;
        }

        if (
            !sameTranslations(prev.translations, t.translations) ||
            !sameColor(prev.color, t.color) ||
            !sameOccurrence(prev.occurrence, t.occurrence)
        ) {
            toAddOrUpdate.push({ ...t, translations: normTranslations(t.translations) });
        }
    }

    // suppressions: termes initiaux absents de current
    for (const prev of initial) {
        if (!prev.id) continue;
        if (!byIdCurrent.has(prev.id)) {
            toRemove.push({ termId: prev.id });
        }
    }

    return ({ toAddOrUpdate, toRemove });
};
