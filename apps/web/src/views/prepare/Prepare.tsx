import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FolderDropzone, InputStyleLess } from "@/components";
import { useCssVariable, useLocale } from "@/hooks";

import "./prepare.scss";

type PrepareState = {
    readonly folders: undefined;
    readonly title: string;
};
export const Prepare = () => {
    const [prepareState, setPrepareState] = useState<PrepareState>({
        folders: undefined,
        title: "",
    });

    const { locale } = useLocale();
    const { t } = useTranslation();

    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => setPrepareState(state => ({
        ...state,
        title: e.target.value,
    }));

    useEffect(() => {
        console.log({ prepareState })
    }, [prepareState])

    return (
        <main className="prepare">
            {/* Preparation title */}
            <InputStyleLess
                name="preparation-title"
                onChange={handleTitle}
                placeholder={t("home.new.inputs.title")}
                style={{
                    fontSize: useCssVariable("--size-xl"),
                    fontWeight: 600,
                    width: "100%",
                }}
            />
            <FolderDropzone />
        </main>
    );
};
