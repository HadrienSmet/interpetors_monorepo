import { Note } from "../../notes";

import { ReferenceElement } from "../references";

import { ElementAction } from "./elements";
import { ReferenceAction } from "./references";
import { GenerateResourceHistoryAction } from "./resources";

export type HistoryAction = {
    /** Used to get the pdf and the canvas elemnts */
    readonly elements: Array<ElementAction>;
    readonly resourceToGenerate?: GenerateResourceHistoryAction;
    /** Text highlighted on hover */
    readonly reference?: ReferenceAction;
};
type FileResource =
    | Note;
export type FileAction = {
    /** Used to get the pdf and the canvas elemnts */
    readonly elements: Array<ElementAction>;
    readonly generatedResources?: Array<FileResource>;
    /** Text highlighted on hover */
    readonly references?: Array<ReferenceElement>;
};
export type FilesActionsStore = Record<string, Record<number, FileAction>>;
