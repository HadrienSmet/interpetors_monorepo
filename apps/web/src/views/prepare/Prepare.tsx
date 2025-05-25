import { ChangeEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { FolderDropzone, InputStyleLess, NavigationState } from "@/components";
import { useCssVariable } from "@/hooks";

import "./prepare.scss";

const SCREEN_NAVIGATION_LEVEL = 1 as const;

const PrepareMain = () => {
    const location = useLocation();

    const currentView = useMemo(() => (
        (location.pathname
            .split("/")
            .filter(Boolean) as NavigationState
        )[SCREEN_NAVIGATION_LEVEL]
    ), [location.pathname]);

    if (currentView === "files") {
        return (<FolderDropzone />);
    }
    if (currentView === "notes") {
        return (<p>Notes</p>);
    }
    if (currentView === "vocabulary") {
        return (<p>Vocabulaire</p>);
    }
    return (<p>Error</p>)
}

export const Prepare = () => {
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
            <PrepareMain />
        </main>
    );
};
