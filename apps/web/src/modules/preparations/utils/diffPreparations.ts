import { FolderStructure, SavedVocabularyTerm } from "@repo/types";

import { Delta, diffFolderStructures } from "@/modules/folders";
import { diffVocabulary } from "@/modules/vocabulary";

import { SavedPreparation } from "../types";

export type UpdatedPreparation = {
    readonly folders: Array<FolderStructure>;
    readonly title: string;
    readonly vocabularyTerms: Array<SavedVocabularyTerm>;
};
type Patch = {
    files?: Partial<Delta>;
    title?: string;
    voc?: Array<SavedVocabularyTerm>;
};
export const diffPreparations = (savedPreparation: SavedPreparation, updatedPreparation: UpdatedPreparation) => {
    let patch: Patch = {};

    if (savedPreparation.title !== updatedPreparation.title) {
        patch.title = updatedPreparation.title;
    }

    const vocDiffs = diffVocabulary(savedPreparation.vocabulary, updatedPreparation.vocabularyTerms);
    if (vocDiffs.toAddOrUpdate) {
        patch.voc = vocDiffs.toAddOrUpdate;
    }

    const foldersDiff = diffFolderStructures(savedPreparation.folders, updatedPreparation.folders);
    patch.files = foldersDiff;

    return (patch);
};
