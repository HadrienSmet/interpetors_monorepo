import { Trans, useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

import { Accordion } from "@/components";
import { formatDate, URL_PARAMETERS, URL_VIEWS } from "@/utils";

import { usePreparations } from "../../contexts";

import "./preparationsList.scss";

export const PreparationsList = () => {
	const { preparationsOverview } = usePreparations();
    const [_, setSearchParams] = useSearchParams();
    const { t } = useTranslation();

    return (
        <div className="preparations-list">
            <Accordion items={Object.values(preparationsOverview).map(prep => ({
                content: (
                    <div
                        className="preparation-content"
                        onClick={() => {
                            setSearchParams(prev => {
                                const next = new URLSearchParams(prev);

                                next.set(URL_PARAMETERS.preparationid, prep.id);
                                next.set(URL_PARAMETERS.view, URL_VIEWS.folders);

                                return (next);
                            });
                        }}
                    >
                        <p>{t("commons.createdAt", { date: formatDate(new Date(prep.createdAt)) })}</p>
                        <ul className="preparation-stats">
                            <Trans
                                components={{
                                    default: <p />,
                                    strong: <strong />,
                                }}
                                i18nKey={"preparations.stats.terms"}
                                values={{ amount: prep._count.vocabularyTerms }}
                            />
                            <Trans
                                components={{
                                    default: <p />,
                                    strong: <strong />,
                                }}
                                i18nKey={"preparations.stats.files"}
                                values={{ amount: prep._count.pdfFiles }}
                            />
                        </ul>
                    </div>
                ),
                title: (
                    <div className="preparation-header">
                        <h2>{prep.title}</h2>
                    </div>
                ),
            }))} />
        </div>
    );
};
