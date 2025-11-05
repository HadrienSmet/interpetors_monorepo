import { useTranslation } from "react-i18next";

import "./preparationsEmpty.scss";

export const PreparationsEmpty = () => {
    const { t } = useTranslation();

    return (
        <div className="preparations-empty">
            <p>{t("preparations.empty")}</p>
        </div>
    );
};
