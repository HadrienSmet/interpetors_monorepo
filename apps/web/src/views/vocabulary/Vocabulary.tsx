import { useTranslation } from "react-i18next";

export const Vocabulary = () => {
    const { t } = useTranslation();

    return (
        <main>
            <h1>{t("views.voc.title")}</h1>
        </main>
    );
};
