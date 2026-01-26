import { FilesActionsStore, SavedFolderStructure } from "@repo/types";

import { FILES } from "@/modules/files";
import {
    decryptPdfFile,
    handleServicesConcurrency,
	decryptActions,
} from "@/utils";

const handleFile = async (
    { actions, ...item }: FILES.FileApiResponse,
    foldersActions: FilesActionsStore,
    userKey: CryptoKey
) => {
    const fileRes = await FILES.getOneS3(item.s3Key, item.name);
    if (!fileRes.success) {
        throw new Error(fileRes.message);
    }

	const decryptedActions = await decryptActions(userKey, actions);
    const decryptedPdf = await decryptPdfFile(fileRes.data, userKey);

    foldersActions[item.id] = decryptedActions;

    return ({
        ...item,
        file: decryptedPdf,
    });
};

const limit = handleServicesConcurrency(4);

export const buildFoldersStructure = async (preparationId: string, userKey: CryptoKey) => {
    const foldersStructures: Array<SavedFolderStructure> = [];

    const pdfFilesResponse = await FILES.getAllApi(preparationId);
    if (!pdfFilesResponse.success) {
        throw new Error(pdfFilesResponse.message);
    }

    const files = pdfFilesResponse.data;
    const foldersActions: FilesActionsStore = {};

    const hydrated = await Promise.all(files.map(file => limit(() => handleFile(file, foldersActions, userKey))));

    for (const fileData of hydrated) {
        const { id, filePath, name, file } = fileData;
        const parts = filePath ? filePath.split("/").filter(Boolean) : [];

        let currentLevel: SavedFolderStructure;

        // Trouve ou crée la racine correspondante
        if (parts.length === 0) {
            // fichier à la racine → nouvelle structure si besoin
            currentLevel = foldersStructures[0] ?? {};
            foldersStructures[0] = currentLevel;
        } else {
            // essaie de retrouver la racine correspondante sinon crée une nouvelle
            const rootName = parts[0];
            let root = foldersStructures.find((savedFolderStructure) => rootName in savedFolderStructure);
            if (!root) {
                root = { [rootName]: {} };
                foldersStructures.push(root);
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
        currentLevel[name] = { id, file, name };
    }

    return ({ foldersActions, foldersStructures });
};
