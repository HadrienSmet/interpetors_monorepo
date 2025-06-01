import { ReactNode, useState } from "react";
import { MdExpandLess } from "react-icons/md";

import "./accordion.scss";

const ICON_SIZE = 32 as const;

type AccordionItemProps = {
    readonly content: ReactNode;
    readonly title: ReactNode;
};
const AccordionItem = (props: AccordionItemProps) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpansion = () => setIsExpanded(state => !state);

    return (
        <div className="accordion-item">
            <div className={`accordion-item__header ${isExpanded ? "expanded" : "closed"}`}>
                {props.title}
                <button onClick={toggleExpansion}>
                    <MdExpandLess size={ICON_SIZE} />
                </button>
            </div>
            <div className={`accordion-item__content-wrapper ${isExpanded ? "expanded" : ""}`}>
                <div className="accordion-item__content">
                    {props.content}
                </div>
            </div>
        </div>
    );
};

type AccordionProps = {
    readonly items: Array<AccordionItemProps>;
};
export const Accordion = ({ items }: AccordionProps) => (
    items.map(item => (<AccordionItem {...item} />))
);
