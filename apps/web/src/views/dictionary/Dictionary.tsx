import { useTranslation } from "react-i18next";

export const Dictionary = () => {
    const { t } = useTranslation();

    return (
        <main>
            <h1>{t("views.dic.title")}</h1>
        </main>
    );
};
