import { PropsWithChildren, useEffect, useState } from "react";
import { useLocation } from "react-router";

import { SavedVocabularyTerm } from "@repo/types";

import { useAuth } from "@/modules/auth";
import { FILES } from "@/modules/files";
import { NewFile, useFoldersManager } from "@/modules/folders";
import { PDF_TYPE, uploadFile } from "@/modules/pdf";
import { useLocaleNavigate } from "@/modules/router";
import { useVocabulary, VOCABULARY } from "@/modules/vocabulary";
import { useWorkspaces } from "@/modules/workspace";
import { 
	encryptActions, 
	encryptPdfFile, 
	encryptVocabularyTerms, 
	prepareCompressedChunks, 
	safeJsonParse, 
	VocToPost, 
} from "@/utils";

import { create, patch } from "../../services";
import { ClientPreparation, SavedPreparation } from "../../types";
import { diffPreparations, uploadPreparation } from "../../utils";

import { usePreparations } from "../preparations";

import { PreparationContext, SavePreparationParams } from "./PreparationContext";

export const DEFAULT_TITLE = "Default title";

type PreparationProviderProps = 
	& { readonly isNew: boolean; }
	& PropsWithChildren
export const PreparationProvider = ({ children, isNew }: PreparationProviderProps) => {
    const [isSaving, setIsSaving] = useState(false);
    const [title, setTitle] = useState("");

    const { userKey } = useAuth();
    const { foldersStructure } = useFoldersManager();
	const location = useLocation();
	const navigate = useLocaleNavigate();
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
        addPreparation({
            createdAt: now,
            id: prepRes.data.id,
            folders,
            foldersActions,
            title: prepRes.data.title,
            updatedAt: now,
            vocabulary: vocabularyTerms,
        });
        setIsSaving(false);
		navigate(`/preparations${location.search}&pid=${prepRes.data.id}`);
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
			const termsWithoutId: Array<VocToPost> = terms.map(el => {
				if (el.id === el.occurrence.text) {
					const { id: _id, ...term } = el;

					return (term);
				}

				return (el);
			});
			const encryptedTerms = await encryptVocabularyTerms(userKey, termsWithoutId) as Array<SavedVocabularyTerm>;
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
				const actionsToPerform = [];
				for (const fileToPatch of files.filesToPatch) {
					if (fileToPatch.actions) {
						const actions = await encryptActions(userKey, safeJsonParse(fileToPatch.actions ?? "{}"));
						const chunks = await prepareCompressedChunks(actions);

						actionsToPerform.push(...chunks.map(el => ({ preparationId, fileId: fileToPatch.id, body: el })));
					}

					if (fileToPatch.filePath || fileToPatch.name) {
						encryptedFilesToPatch.push(fileToPatch);
					}
				}

				const responses = await Promise.all(actionsToPerform.map(chunk => FILES.postActionChunk(chunk)));
				const chunksRes = [];
				for (const res of responses) {
					if (!res.success) {
						throw new Error("An error occured while uploading the file actions");
					}

					chunksRes.push(res.data);
				}
				const completeIndex = chunksRes.findIndex(el => {
					if ("completed" in el && el.completed) return (true);

					return (false);
				});
				if (completeIndex === -1) {
					throw new Error("Did not succeed to upload all the actions chunks");
					// TODO: clean db to prevent stale data or retry
				}
                await FILES.patchApi({
                    body: { files: encryptedFilesToPatch },
                    preparationId,
                });
            }
            if (files.newFiles && files.newFiles.length > 0) {
				const handleNewFile = async (newFile: NewFile) => {
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
				};
				await Promise.all(files.newFiles.map(handleNewFile));
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
        setTitle(selectedPreparation?.title ?? DEFAULT_TITLE);
    }, [selectedPreparation]);

    const preparation: ClientPreparation = {
        folders: foldersStructure,
        id: selectedPreparation?.id ?? "",
        title,
        vocabulary: groupedVocabulary,
    };

    const value = {
        createPreparation,
		isNew,
        isSaving,
        patchPreparation,
        preparation,
        setTitle,
    };

    return (
        <PreparationContext.Provider value={value}>
            {children}
        </PreparationContext.Provider>
    );
};
