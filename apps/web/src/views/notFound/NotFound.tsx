import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components";

import "./notFound.scss";


export const NotFound = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="not-found">
            <p>ERROR 404</p>
            <h1>{t("views.notFound.title")}</h1>
            <Button
                label={t("views.notFound.buttonLabel")}
                onClick={() => navigate("/prepare/files")}
            />
        </div>
    );
};
