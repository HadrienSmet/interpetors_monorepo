import { FilesActionsStore, FolderStructure, SavedVocabularyTerm } from "@repo/types";

import { Delta, diffFolderStructures } from "@/modules/folders";
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
    const patch: Patch = {};

    if (savedPreparation.title !== updatedPreparation.title) {
        patch.title = updatedPreparation.title;
    }

    const vocDiffs = diffVocabulary(savedPreparation.vocabulary, updatedPreparation.vocabularyTerms);
    if (vocDiffs.toAddOrUpdate) {
        patch.voc = vocDiffs.toAddOrUpdate;
    }

    const foldersDiff = diffFolderStructures({
        before: { actions: savedPreparation.foldersActions, folders: savedPreparation.folders },
        after: { actions: updatedPreparation.foldersActions, folders: updatedPreparation.folders },
    });
    patch.files = foldersDiff;

    return (patch);
};
