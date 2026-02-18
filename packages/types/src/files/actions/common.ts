import { ActionColor } from "../../colors";
import { SerializableRect } from "../../serializable";

export type ActionElementBase = {
    readonly color: ActionColor;
	// @ts-expect-error
    readonly file: File;
    readonly pageDimensions: SerializableRect;
    readonly pageIndex: number;
};
