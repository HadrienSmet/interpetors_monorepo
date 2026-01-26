import { PropsWithChildren, useEffect, useState } from "react";

import { SavedVocabularyTerm } from "@repo/types";

import { useAuth } from "@/modules/auth";
import { FILES } from "@/modules/files";
import { useFoldersManager } from "@/modules/folders";
import { PDF_TYPE, uploadFile } from "@/modules/pdf";
import { useVocabulary, VOCABULARY } from "@/modules/vocabulary";
import { useWorkspaces } from "@/modules/workspace";
import { encryptActions, encryptPdfFile, encryptVocabularyTerms, safeJsonParse } from "@/utils";

import { create, patch } from "../../services";
import { ClientPreparation, SavedPreparation } from "../../types";
import { diffPreparations, uploadPreparation } from "../../utils";

import { usePreparations } from "../preparations";

import { PreparationContext, SavePreparationParams } from "./PreparationContext";

export const DEFAULT_TITLE = "Default title";
type PreparationProviderProps =
    & PropsWithChildren
    & { readonly savedPreparation?: SavedPreparation; };
export const PreparationProvider = ({ children, savedPreparation }: PreparationProviderProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const [title, setTitle] = useState("");

    const { userKey } = useAuth();
    const { foldersStructure } = useFoldersManager();
    const { addPreparation, patchPreparation: patchContext, selectedPreparation } = usePreparations();
    const { groupedVocabulary } = useVocabulary();
    const { currentWorkspace } = useWorkspaces();

    const createPreparation = async ({
        folders,
        foldersActions,
        rootFolderId,
        title,
        vocabularyTerms,
    }: SavePreparationParams) => {
        if (!userKey) {
            throw new Error("Create preparation impossible - No userKey");
        }

        setIsSaving(true);
        const workspaceId = currentWorkspace!.id;
        const prepRes = await create({
            body: { title },
            workspaceId,
        });

        if (!prepRes.success) {
            throw new Error("An error occured while creating preparation");
        }

        await uploadPreparation({
            folders,
            foldersActions,
            preparationId: prepRes.data.id,
            rootFolderId: rootFolderId ?? "root",
            userKey,
            vocabularyTerms,
            workspaceId,
        });

        const now = new Date().toISOString();
        const savedPreparation: SavedPreparation = {
            createdAt: now,
            id: prepRes.data.id,
            folders,
            foldersActions,
            title: prepRes.data.title,
            updatedAt: now,
            vocabulary: vocabularyTerms,
        };

        addPreparation(savedPreparation);
        setIsSaving(false);
    };
    const patchPreparation = async (params: SavePreparationParams) => {
        const { old, ...updated } = params;
        const { files, title, voc: terms } = diffPreparations({
            savedPreparation: old!,
            updatedPreparation: updated,
        });

        const preparationId = selectedPreparation?.id;
        const workspaceId = currentWorkspace?.id;

        if (!preparationId || !userKey || !workspaceId) return;

		setIsSaving(true);
        if (title) {
            // Patch new title
            await patch({
                preparationId,
                title,
                workspaceId,
            });
        }
        if (terms && terms.length > 0) {
			const encryptedTerms = await encryptVocabularyTerms(userKey, terms) as Array<SavedVocabularyTerm>;
            // Patch vocabulary terms
            await VOCABULARY.postBulk({
                preparationId,
                terms: encryptedTerms,
                workspaceId,
            });
        }
        if (files) {
            if (files.filesToPatch && files.filesToPatch.length > 0) {
				const encryptedFilesToPatch: Array<FILES.FileToPatch> = [];
				for (const fileToPatch of files.filesToPatch) {
					const actions = await encryptActions(userKey, safeJsonParse(fileToPatch.actions ?? "{}"));

					encryptedFilesToPatch.push({
						...fileToPatch,
						actions,
					});
				}

                await FILES.patchApi({
                    body: { files: encryptedFilesToPatch },
                    preparationId,
                });
            }
            if (files.newFiles && files.newFiles.length > 0) {
				await Promise.all(
					files.newFiles.map(async newFile => {
						const actions = await encryptActions(userKey, newFile.pdfFile.actions);
						const encryptedFile = await encryptPdfFile(newFile.pdfFile.file, userKey);

						return (
							uploadFile({
								actions,
								contentType: PDF_TYPE.type,
								file: encryptedFile,
								filePath: newFile.filePath,
								name: newFile.pdfFile.name,
								preparationId,
							})
						);
					})
                );
            }
        };

		setIsSaving(false);

        if (!old) return;

        const savedPrep: SavedPreparation = {
            ...updated,
            createdAt: old.createdAt,
            id: old.id,
            vocabulary: updated.vocabularyTerms,
            updatedAt: new Date().toISOString(),
        };
        patchContext(old.id, savedPrep);
    };

    useEffect(() => {
        setTitle(savedPreparation?.title ?? DEFAULT_TITLE);
    }, [savedPreparation]);

    const preparation: ClientPreparation = {
        folders: foldersStructure,
        id: savedPreparation?.id ?? "",
        title,
        vocabulary: groupedVocabulary,
    };

    const value = {
        createPreparation,
        isSaving,
        patchPreparation,
        preparation,
        savedPreparation,
        setTitle,
    };

    return (
        <PreparationContext.Provider value={value}>
            {children}
        </PreparationContext.Provider>
    );
};
