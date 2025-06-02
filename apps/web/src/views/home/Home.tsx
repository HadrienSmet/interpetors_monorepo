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
            <h1>{t("views.home.title")}</h1>
            <section>
                <h2>{t("views.home.sections.languages")}</h2>
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
                <h2>{t("views.home.sections.colorPanel")}</h2>
                <ColorPanel workspace={currentWorkSpace} />
            </section>
        </main>
    );
};
