import { useTranslation } from "react-i18next";

import { usePreparationVocabulary, VocabularyTable } from "@/modules";

import "./vocabulary.scss";

export const Vocabulary = () => {
    const { vocabulary } = usePreparationVocabulary();
    const { t } = useTranslation();

    return (
        <section className="vocabulary">
            {Object.keys(vocabulary).length > 0
                ? (<VocabularyTable />)
                : (
                    <div className="vocabulary-empty">
                        <p>{t("vocabulary.empty")}</p>
                    </div>
                )
            }
        </section>
    );
};
