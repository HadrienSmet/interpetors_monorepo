import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";

import { Loader, NavigationState } from "@/components";
import {
    uploadPreparation,
    PREPARATION,
    PreparationLayout,
    PreparationsEmpty,
    PreparationsFilled,
    SavePreparationParams,
    usePreparations,
    SavedPreparation,
} from "@/modules/preparations";
import { useWorkspaces } from "@/modules/workspace";
import { useLocaleNavigate } from "@/utils";

import "./preparations.scss";

const SCREEN_NAVIGATION_LEVEL = 1 as const;

export const Preparations = () => {
    const navigate = useLocaleNavigate();
    const location = useLocation();
    const { addPreparation, isLoading, preparations, setShouldFetch } = usePreparations();
    const { currentWorkspace } = useWorkspaces();

    const currentView = useMemo(() => (
        (location.pathname
            .split("/")
            .filter(Boolean) as NavigationState
        )[SCREEN_NAVIGATION_LEVEL]
    ), [location.pathname]);

    const createPreparation = async ({ title, folders, foldersActions, rootFolderId, vocabularyTerms }: SavePreparationParams) => {
        const workspaceId = currentWorkspace!.id;
        const prepRes = await PREPARATION.create({
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
    };

    useEffect(() => {
        setShouldFetch(true);
    }, []);

    if (isLoading) return (<Loader />);

    if (currentView === "new") {
        return (
            <PreparationLayout
                backToList={() => navigate("/preparations")}
                editable
                preparation={undefined}
                savePreparation={createPreparation}
            />
        );
    }

    return (
        <main
            style={{ overflow: "hidden" }}
            className="preparations-view"
        >
            {(!preparations || preparations.length === 0)
                ? (<PreparationsEmpty />)
                : (<PreparationsFilled preparations={preparations} />)
            }
        </main>
    );
};
