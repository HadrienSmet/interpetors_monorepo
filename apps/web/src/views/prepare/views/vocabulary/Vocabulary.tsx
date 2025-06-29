import { useTranslation } from "react-i18next";

import { usePreparationVocabulary, VocabularyTable } from "@/modules";

import "./vocabulary.scss";

/**
 * NOTE
 * HistoryProvider needs to update PreparationVocabularyProvider
 */
export const Vocabulary = () => {
    const { vocabulary } = usePreparationVocabulary();
    const { t } = useTranslation();

    return (
        <section className="vocabulary">
            {Object.keys(vocabulary).length > 0
                ? (<VocabularyTable list={vocabulary} />)
                : (
                    <div className="vocabulary-empty">
                        <p>{t("vocabulary.empty")}</p>
                    </div>
                )
            }
        </section>
    );
};
