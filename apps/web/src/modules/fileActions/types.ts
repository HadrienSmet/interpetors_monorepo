import { ElementAction, Note, ReferenceElement } from "@repo/types";

export type ApiFileActions = {
    readonly pdfFileId: string;
    readonly elementsJson: string;
    readonly generatedResourcesJson: string;
    readonly pageIndex: number;
    readonly referencesJson: string;
};
export type FetchedFileActions = {
    readonly createdAt: string;
    readonly elementsJson: Array<ElementAction>;
    readonly generatedResourcesJson: Array<Note>;
    readonly id: string;
    readonly pdfFileId: string;
    readonly pageIndex: number;
    readonly referencesJson: Array<ReferenceElement>;
    readonly updatedAt: string;
};
