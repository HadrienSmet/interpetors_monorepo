import { useTranslation } from "react-i18next";

import { usePreparationVocabulary, VocabularyTable } from "@/modules";

import "./vocabulary.scss";

export const Vocabulary = () => {
    const { addTranslation, preparationVocabulary } = usePreparationVocabulary();
    const { t } = useTranslation();

    return (
        <section className="vocabulary">
            {preparationVocabulary.length > 0
                ? (<VocabularyTable addTranslation={addTranslation} />)
                : (
                    <div className="vocabulary-empty">
                        <p>{t("vocabulary.empty")}</p>
                    </div>
                )
            }
        </section>
    );
};
