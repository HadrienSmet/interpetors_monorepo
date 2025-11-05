import { ActionColor } from "../colors";

export type VocabularyOccurence = {
    readonly filePath: string;
    readonly pageIndex: number;
    readonly text: string;
};
export type VocabularyTerm = {
    readonly id: string;
    readonly occurrence: VocabularyOccurence;
    readonly color: ActionColor;
    readonly translations: Array<string>;
};
