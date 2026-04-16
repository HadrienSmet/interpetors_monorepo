import { PdfMetadata } from "../files";

export type FolderStructure = {
    [key: string]: PdfMetadata | FolderStructure;
};

export type FlatFolder = {
    readonly createdAt: Date;
    readonly id: string;
    readonly name: string;
    readonly parentId: string | null;
    readonly preparationId: string;
    readonly updatedAt: Date;
    readonly _count: {
        readonly children: number;
        readonly files: number;
    };
};
export type ApiFile = {
    readonly folderId: string;
    readonly id: string;
    readonly name: string;
    readonly s3Key: string;
};
export type FolderNode = Omit<FlatFolder, "_count"> & {
    readonly children: Array<FolderNode>;
    readonly childrenCount: number;
    readonly files?: Array<ApiFile>; // si includeFiles = true
    readonly filesCount: number;
};
