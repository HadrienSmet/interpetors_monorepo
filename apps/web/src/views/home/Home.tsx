import { useTranslation } from "react-i18next";

import { ColorPanel, useWorkspaces } from "@/modules";

import "./home.scss";

export const Home = () => {
    const { t } = useTranslation();
    const { currentWorkspace } = useWorkspaces();

    if (!currentWorkspace) {
        return (<p>Error</p>);
    }

    return (
        <main className="home">
            <p className="home-title">{t("views.home.title")}</p>
            <section>
                <p className="home-subtitle">{t("views.home.sections.languages")}</p>
                <div className="languages">
                    {currentWorkspace.languages.map(language => (
                        <div
                            className={`language ${language === currentWorkspace.nativeLanguage
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
                <ColorPanel />
            </section>
        </main>
    );
};
