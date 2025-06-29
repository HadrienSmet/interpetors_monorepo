import { useTranslation } from "react-i18next";

import { ColorPanel } from "@/components";
import { useWorkSpaces } from "@/contexts";

import "./home.scss";

export const Home = () => {
    const { t } = useTranslation();
    const { currentWorkSpace } = useWorkSpaces();

    if (!currentWorkSpace) {
        return (<p>Error</p>);
    }

    return (
        <main className="home">
            <p className="home-title">{t("views.home.title")}</p>
            <section>
                <p className="home-subtitle">{t("views.home.sections.languages")}</p>
                <div className="languages">
                    {currentWorkSpace.languages.work.map(language => (
                        <div
                            className={`language ${language === currentWorkSpace.languages.native
                                ? "selected"
                                : ""
                            }`}
                            key={language}
                        >
                            <p>{language}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section>
                <p className="home-subtitle">{t("views.home.sections.colorPanel")}</p>
                <ColorPanel workspace={currentWorkSpace} />
            </section>
        </main>
    );
};
