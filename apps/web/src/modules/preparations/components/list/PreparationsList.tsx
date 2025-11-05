import { Trans, useTranslation } from "react-i18next";

import { Accordion } from "@/components";
import { formatDate } from "@/utils";

import { usePreparations } from "../../contexts";
import { SavedPreparation } from "../../types";

import "./preparationsList.scss";

export type PreparationsFilledProps = {
    readonly preparations: Array<SavedPreparation>;
};
type PreparationListProps =
    & PreparationsFilledProps
    & { readonly onClick: () => void; };
export const PreparationsList = ({ onClick, preparations }: PreparationListProps) => {
    const { setSelectedPreparation } = usePreparations();
    const { t } = useTranslation();

    return (
        <div className="preparations-list">
            <Accordion items={preparations.map(prep => ({
                content: (
                    <div
                        className="preparation-content"
                        onClick={() => {
                            onClick();
                            setSelectedPreparation(prep.id);
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
                                values={{ amount: prep.vocabulary.length }}
                            />
                            <Trans
                                components={{
                                    default: <p />,
                                    strong: <strong />,
                                }}
                                i18nKey={"preparations.stats.folders"}
                                values={{ amount: Object.keys(prep.folders).length }}
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
