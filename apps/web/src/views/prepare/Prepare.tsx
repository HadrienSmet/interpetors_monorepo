import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { FolderDropzone, InputStyleLess, NavigationState } from "@/components";
import { useCssVariable } from "@/hooks";

import "./prepare.scss";

const SCREEN_NAVIGATION_LEVEL = 1 as const;
type PrepareProps = {
    readonly navigationState: NavigationState;
};
const PrepareMain = (props: PrepareProps) => {
    if (props.navigationState[SCREEN_NAVIGATION_LEVEL] === "files") {
        return (<FolderDropzone />);
    }
    if (props.navigationState[SCREEN_NAVIGATION_LEVEL] === "notes") {
        return (<p>Notes</p>);
    }
    if (props.navigationState[SCREEN_NAVIGATION_LEVEL] === "vocabulary") {
        return (<p>Vocabulaire</p>);
    }
    return (<p>Error</p>)
}

export const Prepare = (props: PrepareProps) => {
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
            <PrepareMain {...props} />
        </main>
    );
};
