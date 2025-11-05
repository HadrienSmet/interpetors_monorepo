import { useMemo } from "react";
import { useLocation } from "react-router";

import { NavigationState } from "@/components";
import { FoldersManagerProvider, PreparationVocabularyProvider, usePreparationVocabulary, VocabularyTableProvider } from "@/modules";
import { NotFound } from "@/views";

import { Files, PreparationManager, Vocabulary } from "./views";
import "./prepare.scss";

const SCREEN_NAVIGATION_LEVEL = 1 as const;

const PrepareView = () => {
    const location = useLocation();

    const currentView = useMemo(() => (
        (location.pathname
            .split("/")
            .filter(Boolean) as NavigationState
        )[SCREEN_NAVIGATION_LEVEL]
    ), [location.pathname]);

    if (currentView === "files") {
        return (<Files />);
    }
    if (currentView === "manager") {
        return (<PreparationManager />);
    }
    if (currentView === "vocabulary") {
        return (<Vocabulary />);
    }

    return (<NotFound />);
};

const PrepareChild = () => {
    const { preparationVocabulary } = usePreparationVocabulary();

    return (
        <VocabularyTableProvider preparationVocabulary={preparationVocabulary}>
            <main className="prepare">
                <PrepareView />
            </main>
        </VocabularyTableProvider>
    );
};

export const Prepare = () => (
    <FoldersManagerProvider editable>
        <PreparationVocabularyProvider>
            <PrepareChild />
        </PreparationVocabularyProvider>
    </FoldersManagerProvider>
);
