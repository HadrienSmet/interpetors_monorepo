import { useTranslation } from "@/contexts";

export const Preparations = () => {
    const { t } = useTranslation();

    return (
        <main>
            <h1>{t("home.old.title")}</h1>
        </main>
    );
};
