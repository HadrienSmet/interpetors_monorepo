import { OnConstruction } from "@/components";
import { useTranslation } from "react-i18next";

export const Dictionary = () => {
    const { t } = useTranslation();

    return (
        <main style={{ overflow: "hidden" }}>
            <h1>{t("views.dic.title")}</h1>
            <OnConstruction />
        </main>
    );
};
