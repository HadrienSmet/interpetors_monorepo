import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { NavigationState } from "@/components";
import { FoldersManagerProvider, PreparationVocabularyProvider, VocabularyTableProvider } from "@/modules";
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

const PrepareContent = () => (
    <main className="prepare">
        <PrepareView />
    </main>
);
export const Prepare = () => (
    <FoldersManagerProvider>
        <PreparationVocabularyProvider>
            <VocabularyTableProvider>
                <PrepareContent />
            </VocabularyTableProvider>
        </PreparationVocabularyProvider>
    </FoldersManagerProvider>
);
