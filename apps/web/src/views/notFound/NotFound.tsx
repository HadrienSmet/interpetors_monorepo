import { useTranslation } from "react-i18next";

import { Error404 } from "@/assets";
import { Button } from "@/components";

import "./notFound.scss";

type NotFoundProps = {
    readonly onError404: () => void;
};
export const NotFound = ({ onError404 }: NotFoundProps) => {
    const { t } = useTranslation();

    return (
        <div className="not-found">
            <Error404 />
            <h1>{t("views.notFound.title")}</h1>
            <Button
                label={t("views.notFound.title")}
                onClick={onError404}
            />
        </div>
    );
};
