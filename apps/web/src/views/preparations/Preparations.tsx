import { OnConstruction } from "@/components";
import { useTranslation } from "react-i18next";

export const Preparations = () => {
    const { t } = useTranslation();

    return (
        <main style={{ overflow: "hidden" }}>
            <h1>{t("views.old.title")}</h1>
            <OnConstruction />
        </main>
    );
};
