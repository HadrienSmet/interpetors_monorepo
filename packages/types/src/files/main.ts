import { FileAction } from "./actions";

export type PdfFile = {
    readonly actions: Record<number, FileAction>;
	// @ts-expect-error
    readonly file: File;
    readonly id: string;
    readonly name: string;
};
export type PdfMetadata = {
	readonly lng?: string;
	// @ts-expect-error
    readonly file: File;
    readonly id: string;
    readonly name: string;
};
export type PdfFileApi = {
    readonly createdAt: Date;
    readonly filePath: string;
    readonly id: string;
    readonly name: string;
    readonly preparationId: string;
    readonly s3Key: string;
    readonly updatedAt: Date;
};
