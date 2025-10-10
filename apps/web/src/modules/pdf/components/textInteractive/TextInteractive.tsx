import { ReferencingText } from "@repo/types";

import "./textInteractive.scss";

type TextInteractiveProps = {
    readonly onClick: () => void;
    readonly referencingText: ReferencingText;
    readonly title: string;
};
export const TextInteractive = ({ onClick, referencingText, title }: TextInteractiveProps) => {
    const onMouseEnter = () => {
        document
            .querySelectorAll(`.interactive-group-${referencingText.id}`)
            .forEach(el => el.classList.add("hovered"));
    };
    const onMouseLeave = () => {
        document
            .querySelectorAll(`.interactive-group-${referencingText.id}`)
            .forEach(el => el.classList.remove("hovered"));
    };

    return (
        <button
            data-ignore-outside-click
            className={`text-interactive interactive-group-${referencingText.id}`}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                height: `${referencingText.height}px`,
                left: `${referencingText.x}px`,
                top: `${referencingText.y}px`,
                width: `${referencingText.width}px`,
            }}
            title={title}
        />
    );
};
