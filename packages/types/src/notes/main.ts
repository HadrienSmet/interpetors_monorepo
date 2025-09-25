import { FileReference } from "../common";

export type Note =
    & FileReference
    & {
        readonly note: string;
        readonly y: number;
    };
