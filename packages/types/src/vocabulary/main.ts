import { CanvasColor } from "../colors";

export type VocabularyOccurence = {
    readonly filePath: string;
    readonly pageIndex: number;
    readonly text: string;
};
export type VocabularyTerm = {
    readonly id: string;
    readonly occurence: VocabularyOccurence;
    readonly color: CanvasColor;
    readonly translations: Array<string>;
};
