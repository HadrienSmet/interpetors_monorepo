import { useTranslation } from "react-i18next";

export const Vocabulary = () => {
    const { t } = useTranslation();

    return (
        <main>
            <h1>{t("home.voc.title")}</h1>
        </main>
    );
};
