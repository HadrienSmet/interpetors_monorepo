import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import "./createButton.scss";

export const CreateButton = () => {
    const { t } = useTranslation();

    return (
        <Link className="create-preparation" to="new">
            {t("preparations.new")}
        </Link>
    );
};
