import { FilesActionsStore, FolderStructure, SavedVocabularyTerm } from "@repo/types";

import { GroupedVocabulary } from "../vocabulary";

type PreparationBase = {
    readonly createdAt: string;
    readonly id: string;
    readonly title: string;
    readonly updatedAt: string;
};
export type PreparationOverview =
	& PreparationBase
	& {
		readonly _count: {
			readonly pdfFiles: number;
			readonly vocabularyTerms: number;
		};
	};

export type SavedPreparation =
    & PreparationBase
    & {
        readonly folders: Array<FolderStructure>;
        readonly foldersActions: FilesActionsStore;
        readonly vocabulary: Array<SavedVocabularyTerm>;
    };
export type ClientPreparation = {
    readonly folders: Array<FolderStructure>;
    readonly id: string;
    readonly title: string;
    readonly vocabulary: Array<GroupedVocabulary>;
};
