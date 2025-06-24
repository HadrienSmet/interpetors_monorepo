import { usePreparationVocabulary, VocabularyTable } from "@/modules";

import "./vocabulary.scss";

export const Vocabulary = () => {
    const { vocabulary } = usePreparationVocabulary();

    return (
        <section className="vocabulary">
            {Object.keys(vocabulary).length > 0
                ? (<VocabularyTable list={vocabulary} />)
                : (
                    <div className="vocabulary-empty">
                        <p>No voc generated for the moment</p>
                    </div>
                )
            }
        </section>
    );
};
