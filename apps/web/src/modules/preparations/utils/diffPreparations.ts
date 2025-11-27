import { FilesActionsStore, FolderStructure, SavedVocabularyTerm } from "@repo/types";

import { Delta, diffNewFolderStructures } from "@/modules/folders";
import { diffVocabulary } from "@/modules/vocabulary";

import { SavedPreparation } from "../types";

export type UpdatedPreparation = {
    readonly folders: Array<FolderStructure>;
    readonly foldersActions: FilesActionsStore;
    readonly title: string;
    readonly vocabularyTerms: Array<SavedVocabularyTerm>;
};
type Patch = {
    files?: Partial<Delta>;
    title?: string;
    voc?: Array<SavedVocabularyTerm>;
};

type DiffPreparationsParams = {
    readonly savedPreparation: SavedPreparation;
    readonly updatedPreparation: UpdatedPreparation;
};
export const diffPreparations = ({ savedPreparation, updatedPreparation }: DiffPreparationsParams) => {
    let patch: Patch = {};

    if (savedPreparation.title !== updatedPreparation.title) {
        patch.title = updatedPreparation.title;
    }

    const vocDiffs = diffVocabulary(savedPreparation.vocabulary, updatedPreparation.vocabularyTerms);
    if (vocDiffs.toAddOrUpdate) {
        patch.voc = vocDiffs.toAddOrUpdate;
    }

    const foldersDiff = diffNewFolderStructures({
        before: { actions: savedPreparation.foldersActions, folders: savedPreparation.folders },
        after: { actions: updatedPreparation.foldersActions, folders: updatedPreparation.folders },
    });
    patch.files = foldersDiff;

    return (patch);
};
