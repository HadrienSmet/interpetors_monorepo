import { SavedFolderStructure } from "@repo/types";

import { FILE_ACTION } from "@/modules/fileActions";
import { FILES } from "@/modules/files";
import { handleServicesConcurrency } from "@/utils";

import { getAll } from "../services";

import { BatchItem, buildFolderStructureFromApi } from "./build";
import { hydrateFolderStructure } from "./hydrate";

const handleFile = async (item: BatchItem, actionsByFileId: FILE_ACTION.GetBulkResponse) => {
    const fileRes = await FILES.getOne(item.s3Key, item.name);
    if (!fileRes.success) {
        throw new Error(fileRes.message);
    }

    const fileActions = actionsByFileId[item.id] ?? [];

    return ({
        file: fileRes.data,
        fileActions,
        id: item.id,
    });
};

export const handleFoldersPreparation = async (
    workspaceId: string,
    preparationId: string,
): Promise<SavedFolderStructure | undefined> => {
    const foldersResponse = await getAll(workspaceId, preparationId);
    if (!foldersResponse.success) return;

    const { batches, structure } = buildFolderStructureFromApi(foldersResponse.data);

    const ids = batches.map((b) => b.id);
    const bulkRes = await FILE_ACTION.getAllBulk(ids);
    if (!bulkRes.success) {
        throw new Error(bulkRes.message);
    }
    const actionsByFileId: FILE_ACTION.GetBulkResponse = bulkRes.data;

    const limit = handleServicesConcurrency(4);

    const fileResponses = await Promise.all(
        batches.map((item) => limit(() => handleFile(item, actionsByFileId)))
    );

    const hydrated = hydrateFolderStructure(structure, fileResponses);
    return (hydrated);
};
