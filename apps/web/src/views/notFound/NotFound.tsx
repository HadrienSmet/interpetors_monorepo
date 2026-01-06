import { useTranslation } from "react-i18next";

import { Button } from "@/components";
import { useLocaleNavigate } from "@/modules/router";

import "./notFound.scss";


export const NotFound = () => {
    const navigate = useLocaleNavigate();
    const { t } = useTranslation();

    return (
        <div className="not-found">
            <p>ERROR 404</p>
            <h1>{t("views.notFound.title")}</h1>
            <Button
                label={t("views.notFound.buttonLabel")}
                onClick={() => navigate("/")}
            />
        </div>
    );
};
