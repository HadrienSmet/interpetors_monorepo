import { SavedFolderStructure } from "@repo/types";

import { FILE_ACTION } from "@/modules/fileActions";
import { FILES } from "@/modules/files";
import { getDefaultPdfActions } from "@/modules/pdf";
import { handleServicesConcurrency } from "@/utils";

const handleFile = async (
    item: FILES.FileApiResponse,
    actionsByFileId: FILE_ACTION.GetBulkResponse
) => {
    const fileRes = await FILES.getOneS3(item.s3Key, item.name);
    if (!fileRes.success) {
        throw new Error(fileRes.message);
    }

    const fileActions = actionsByFileId[item.id] ?? [];

    const actionsRecord = fileActions.length > 0
        ? fileActions.reduce<Record<number, any>>((acc, act) => {
            acc[act.pageIndex] = {
                elements: act.elementsJson ?? [],
                references: act.referencesJson ?? [],
                generatedResources: act.generatedResourcesJson ?? [],
            };
            return (acc);
        }, {})
        : getDefaultPdfActions();

    return ({
        ...item,
        file: fileRes.data,
        actions: actionsRecord,
    });
};

const limit = handleServicesConcurrency(4);

export const buildFoldersStructure = async (preparationId: string) => {
    const output: Array<SavedFolderStructure> = [];

    const pdfFilesResponse = await FILES.getAllApi(preparationId);
    if (!pdfFilesResponse.success) {
        throw new Error(pdfFilesResponse.message);
    }

    const files = pdfFilesResponse.data;
    const ids = files.map(file => file.id);

    const bulkRes = await FILE_ACTION.getAllBulk(ids);
    if (!bulkRes.success) {
        throw new Error(bulkRes.message);
    }

    const actionsByFileId = bulkRes.data;
    const hydrated = await Promise.all(
        files.map(file => limit(() => handleFile(file, actionsByFileId)))
    );

    for (const fileData of hydrated) {
        const { id, filePath, name, file, actions } = fileData;
        const parts = filePath ? filePath.split("/").filter(Boolean) : [];

        let currentLevel: SavedFolderStructure;

        // Trouve ou crée la racine correspondante
        if (parts.length === 0) {
            // fichier à la racine → nouvelle structure si besoin
            currentLevel = output[0] ?? {};
            output[0] = currentLevel;
        } else {
            // essaie de retrouver la racine correspondante sinon crée une nouvelle
            const rootName = parts[0];
            let root = output.find((f) => rootName in f);
            if (!root) {
                root = { [rootName]: {} };
                output.push(root);
            }
            currentLevel = root[rootName] as SavedFolderStructure;

            // crée récursivement les sous-dossiers
            for (let i = 1; i < parts.length; i++) {
                const folder = parts[i];
                if (!(folder in currentLevel)) {
                    currentLevel[folder] = {};
                }
                currentLevel = currentLevel[folder] as SavedFolderStructure;
            }
        }

        // insère le PdfFile
        currentLevel[name] = {
            id,
            actions,
            file,
            name,
        };
    }

    return (output);
};
