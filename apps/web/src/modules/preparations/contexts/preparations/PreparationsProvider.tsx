import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/modules/auth";
import { buildFoldersStructure } from "@/modules/folders";
import { VOCABULARY } from "@/modules/vocabulary";
import { useWorkspaces } from "@/modules/workspace";
import { decryptVocabularyTerms } from "@/utils";

import { getAll } from "../../services";
import { PreparationOverview, SavedPreparation } from "../../types";

import { PreparationsContext, PreparationsContextValue } from "./PreparationsContext";

export const PreparationsProvider = ({ children }: PropsWithChildren) => {
    const [isLoading, setIsLoading] = useState(false);
	const [preparationsOverview, setPreparationsOverview] = useState<Record<string, PreparationOverview>>({});
	const [preparationsRecord, setPreparationsRecord] = useState<Record<string, SavedPreparation>>({});
    const [selectedPreparationId, setSelectedPreparation] = useState<string | undefined>(undefined);
    const [shouldFetch, setShouldFetch] = useState(false);

    const { userKey } = useAuth();
    const { currentWorkspace } = useWorkspaces();

    const selectedPreparation = useMemo(() => {
        if (selectedPreparationId === undefined || Object.keys(preparationsRecord).length === 0) return;

        return (preparationsRecord[selectedPreparationId]);
    }, [selectedPreparationId, Object.keys(preparationsRecord).length]);

    const addPreparation = (prep: SavedPreparation) => setPreparationsRecord(state => ({
		...state,
		[prep.id]: prep,
	}));
    const patchPreparation = (id: string, prep: SavedPreparation) => setPreparationsRecord(prev => ({
        ...prev,
		[id]: prep,
    }));

	useEffect(() => {
		const fetchSelectedPreparation = async () => {
			if (!currentWorkspace || !selectedPreparationId || !userKey) return;

			setIsLoading(true);
			const current = preparationsOverview[selectedPreparationId];
			const preparationRecord: SavedPreparation = {
				...current,
				folders: [],
				foldersActions: {},
				vocabulary: [],
			};
	
			const { foldersActions, foldersStructures } = await buildFoldersStructure(selectedPreparationId, userKey);
			preparationRecord.folders.push(...foldersStructures);
			//@ts-expect-error
			preparationRecord.foldersActions = {
				...preparationRecord.foldersActions,
				...foldersActions,
			};
	
			const vocabularyResponse = await VOCABULARY.getAllFromPreparation(currentWorkspace.id, selectedPreparationId);
			if (!vocabularyResponse.success) throw new Error(vocabularyResponse.message);
	
			const decryptedVocabulary = await decryptVocabularyTerms(userKey, vocabularyResponse.data);
			preparationRecord.vocabulary.push(...decryptedVocabulary);
			setPreparationsRecord(state => ({
				...state,
				[preparationRecord.id]: preparationRecord,
			}));
			setIsLoading(false);
		};
		if (selectedPreparationId && !(selectedPreparationId in preparationsRecord)) {
			fetchSelectedPreparation();
		}
	}, [preparationsRecord, selectedPreparationId]);
    useEffect(() => {
        const fetchPreparations = async () => {
            if (!currentWorkspace || !userKey) return;

            setIsLoading(true);
            const { id: workspaceId } = currentWorkspace;

            const preparationsResponse = await getAll(workspaceId);
            if (!preparationsResponse.success) {
                console.error(`An error occured while retrieving preparations. [ERROR]: ${preparationsResponse.message}`);
                return;
            }

			const preparationsRec: Record<string, PreparationOverview> = {};
			for (const prep of preparationsResponse.data) {
				preparationsRec[prep.id] = prep;
			}
			setPreparationsOverview(preparationsRec);
            setIsLoading(false);
        };

        if (shouldFetch) {
            fetchPreparations();
        }
    }, [shouldFetch]);

    const value: PreparationsContextValue = {
        addPreparation,
        isLoading,
        patchPreparation,
		preparationsOverview,
		preparationsRecord,
        selectedPreparation,
        setSelectedPreparation,
        setShouldFetch,
    };

    return (
        <PreparationsContext.Provider value={value}>
            {children}
        </PreparationsContext.Provider>
    );
};
