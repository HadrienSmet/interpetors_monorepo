import { ChangeEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { InputStyleLess, NavigationState } from "@/components";
import { NotesProvider } from "@/contexts";
import { useCssVariable } from "@/hooks";
import { FoldersManagerProvider } from "@/modules";
import { NotFound } from "@/views";

import { Files, Notes, Vocabulary } from "./views";
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
    if (currentView === "notes") {
        return (<Notes />);
    }
    if (currentView === "vocabulary") {
        return (<Vocabulary />);
    }

    return (<NotFound />);
};

const PrepareContent = () => {
    const [preparationTitle, setPreparationTitle] = useState("");

    const { t } = useTranslation();

    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => setPreparationTitle(e.target.value);

    return (
        <main className="prepare">
            {/* Preparation title */}
            <InputStyleLess
                name="preparation-title"
                onChange={handleTitle}
                placeholder={t("views.new.inputs.title")}
                style={{
                    fontSize: useCssVariable("--size-xl"),
                    fontWeight: 600,
                    width: "100%",
                }}
                value={preparationTitle}
            />
            <PrepareView />
        </main>
    );
};

export const Prepare = () => (
    <FoldersManagerProvider>
        <NotesProvider>
            <PrepareContent />
        </NotesProvider>
    </FoldersManagerProvider>
);
