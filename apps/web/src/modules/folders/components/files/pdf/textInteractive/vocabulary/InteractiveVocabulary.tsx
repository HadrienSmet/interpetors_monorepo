import { useNavigate } from "react-router-dom";

import { VocabularyElement } from "../../../../../types";

import "./interactiveVocabulary.scss";

type InteractiveVocabularyProps = {
    readonly i: number;
    readonly index: number;
    readonly vocabulary: VocabularyElement;
};
export const InteractiveVocabulary = ({ i, index, vocabulary }: InteractiveVocabularyProps) => {
    const navigate = useNavigate();

    const onClick = () => {
        navigate(`/prepare/vocabulary?id=${vocabulary.id}`)
    };
    const onMouseEnter = () => {
        document
            .querySelectorAll(`.voc-group-${vocabulary.id}`)
            .forEach(el => el.classList.add("hovered"));
    };
    const onMouseLeave = () => {
        document
            .querySelectorAll(`.voc-group-${vocabulary.id}`)
            .forEach(el => el.classList.remove("hovered"));
    };

    return (
        <button
            className={`text-interactive voc-group-${vocabulary.id}`}
            key={`vocRef-${index}-${i}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                height: `${vocabulary.height}px`,
                left: `${vocabulary.x}px`,
                top: `${vocabulary.y}px`,
                width: `${vocabulary.width}px`,
            }}
            title="Navigate to vocabulary"
        />
    );
};
