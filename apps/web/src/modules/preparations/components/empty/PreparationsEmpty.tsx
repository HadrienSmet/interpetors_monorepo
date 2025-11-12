import { useTranslation } from "react-i18next";

import { CreateButton } from "../createButton";

import "./preparationsEmpty.scss";

export const PreparationsEmpty = () => {
    const { t } = useTranslation();

    return (
        <div className="preparations-empty">
            <div className="preparations-empty__header">
                <CreateButton />
            </div>
            <p>{t("preparations.empty")}</p>
        </div>
    );
};
