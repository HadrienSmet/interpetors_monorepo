import { useTranslation } from "react-i18next";
import "./onConstruction.scss";

export const OnConstruction = () => {
    const { t } = useTranslation();

    return (
        <section className="on-construction">
            <div className="img-container">
                <img src="/images/on-construction.jpg" />
                <p>{t("onConstruction")}</p>
            </div>
        </section>
    );
};
