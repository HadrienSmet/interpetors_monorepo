import { FileAction, SavedFolderStructure } from "@repo/types";

import { FetchedFileActions } from "@/modules/fileActions";

import { PdfFilePlaceholder, TempFolderStructure } from "./build";

const isFolderNode = (v: unknown): v is TempFolderStructure => (!!v && typeof v === 'object' && !('s3Key' in (v as any)));
const isPlaceholder = (v: unknown): v is PdfFilePlaceholder => (!!v && typeof v === 'object' && 's3Key' in (v as any) && 'id' in (v as any));

export type HandledFile = {
    readonly file: File;
    readonly fileActions: Array<FetchedFileActions>;
    readonly id: string;
};
export const hydrateFolderStructure = (
    structure: TempFolderStructure,
    handledFiles: Array<HandledFile>,
): SavedFolderStructure => {
    const byId = new Map<string, HandledFile>(handledFiles.map(h => [h.id, h]));

    const buildActions = (hf: HandledFile): Record<number, FileAction> => {
        const output: Record<number, FileAction> = {};

        for (const action of hf.fileActions) {
            output[action.pageIndex] = {
                elements: action.elementsJson,
                generatedResources: action.generatedResourcesJson,
                references: action.referencesJson,
            };
        }

        return (output);
    };

    const walk = (node: TempFolderStructure): SavedFolderStructure => {
        const accumulator: SavedFolderStructure = {};

        for (const [key, value] of Object.entries(node)) {
            if (isPlaceholder(value)) {
                const handled = byId.get(value.id);

                if (!handled && !value.file) {
                    throw new Error(
                        `No handled file found for PdfFile id="${value.id}" (key="${key}"), and no 'file' in placeholder.`,
                    );
                }

                const file = handled?.file ?? (value.file as File);
                const actions = handled
                    ? buildActions(handled)
                    : ({} as Record<number, FileAction>);
                const pdfFile = {
                    actions,
                    file,
                    id: value.id,
                    name: value.name,
                };
                accumulator[key] = pdfFile;
            } else if (isFolderNode(value)) {
                accumulator[key] = walk(value);
            } else {
                throw new Error(`Invalid node at key "${key}".`);
            }
        }

        return (accumulator);
    };

    return (walk(structure));
};
