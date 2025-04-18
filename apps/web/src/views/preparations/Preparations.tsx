import { useTranslation } from "react-i18next";

export const Preparations = () => {
    const { t } = useTranslation();

    return (
        <main>
            <h1>{t("home.old.title")}</h1>
        </main>
    );
};
