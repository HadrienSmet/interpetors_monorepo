import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { buildFoldersStructure } from "@/modules/folders";
import { VOCABULARY } from "@/modules/vocabulary";
import { useWorkspaces } from "@/modules/workspace";

import { getAll } from "../../services";
import { SavedPreparation } from "../../types";

import { PreparationsContext, PreparationsContextValue } from "./PreparationsContext";

export const PreparationsProvider = ({ children }: PropsWithChildren) => {
    const [isLoading, setIsLoading] = useState(false);
    const [preparations, setPreparations] = useState<Array<SavedPreparation>>([]);
    const [selectedPreparationId, setSelectedPreparation] = useState<string | undefined>(undefined);
    const [shouldFetch, setShouldFetch] = useState(false);

    const { currentWorkspace } = useWorkspaces();

    const selectedPreparation = useMemo(() => {
        if (!selectedPreparationId || !preparations) return;

        return (preparations.find(prep => prep.id === selectedPreparationId));
    }, [selectedPreparationId, preparations]);

    const addPreparation = (prep: SavedPreparation) => setPreparations(state => ([...state, prep]));
    const patchPreparation = (id: string, prep: SavedPreparation) => setPreparations(prev => {
        const next = [...prev];

        const index = next.findIndex(elem => elem.id === id);
        next.splice(index, 1, prep);

        return (next);
    });

    useEffect(() => {
        const fetchPreparations = async () => {
            if (!currentWorkspace) {
                return;
            }

            setIsLoading(true);
            const { id: workspaceId } = currentWorkspace;

            const preparationsResponse = await getAll(workspaceId);
            if (!preparationsResponse.success) {
                console.error(`An error occured while retrieving preparations. [ERROR]: ${preparationsResponse.message}`);
                return;
            }

            const savedPreparations: Array<SavedPreparation> = [];

            for (const preparation of preparationsResponse.data) {
                const { id: preparationId } = preparation;
                let preparationRecord: SavedPreparation = {
                    ...preparation,
                    folders: [],
                    foldersActions: {},
                    vocabulary: [],
                };

                const { foldersActions, foldersStructures } = await buildFoldersStructure(preparationId);
                preparationRecord.folders.push(...foldersStructures);
                //@ts-expect-error
                preparationRecord.foldersActions = {
                    ...preparationRecord.foldersActions,
                    ...foldersActions,
                }

                const vocabularyResponse = await VOCABULARY.getAllFromPreparation(workspaceId, preparationId);
                if (!vocabularyResponse.success) {
                    throw new Error(vocabularyResponse.message);
                }
                preparationRecord.vocabulary.push(...vocabularyResponse.data);

                savedPreparations.push(preparationRecord);
            }

            setPreparations(savedPreparations);
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
        preparations,
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
