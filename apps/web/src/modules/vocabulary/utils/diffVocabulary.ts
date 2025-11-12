import { VocabularyTerm } from "@repo/types";

const normTranslations = (arr: string[]) => (Array.from(new Set(arr.map(s => s.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b)));
const sameTranslations = (a: string[], b: string[]) => {
    const A = normTranslations(a), B = normTranslations(b);
    if (A.length !== B.length) return (false);
    return (A.every((x, i) => x === B[i]));
}
const sameColor = (a: any, b: any) => (JSON.stringify(a) === JSON.stringify(b));
const sameOccurrence = (a?: VocabularyTerm['occurrence'], b?: VocabularyTerm['occurrence']) => (JSON.stringify(a ?? null) === JSON.stringify(b ?? null));

export const diffVocabulary = (initial: VocabularyTerm[], current: VocabularyTerm[]) => {
    const byIdInitial = new Map(initial.filter(t => t.id).map(t => [t.id!, t]));
    const byIdCurrent = new Map(current.filter(t => t.id).map(t => [t.id!, t]));

    const toAddOrUpdate: VocabularyTerm[] = [];
    const toRemove: { termId: string; }[] = [];

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
        if (!sameTranslations(prev.translations, t.translations)
            || !sameColor(prev.color, t.color)
            || !sameOccurrence(prev.occurrence, t.occurrence)) {
            toAddOrUpdate.push({ ...t, translations: normTranslations(t.translations) });
        }
    }

    // suppressions: termes initiaux absents de current
    for (const prev of initial) {
        if (!prev.id) continue; // sécurité
        if (!byIdCurrent.has(prev.id)) {
            toRemove.push({ termId: prev.id });
        }
    }

    return ({ toAddOrUpdate, toRemove });
};
