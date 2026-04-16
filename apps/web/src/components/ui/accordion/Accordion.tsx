import { ReactNode, useState } from "react";
import { PiCaretUp } from "react-icons/pi";

import "./accordion.scss";

const ICON_SIZE = 32 as const;

type AccordionItemType = {
    readonly content: ReactNode;
    readonly title: ReactNode;
};
type AccordionItemProps =
	& AccordionItemType 
	& { readonly defaultExpanded: boolean; };
const AccordionItem = (props: AccordionItemProps) => {
    const [isExpanded, setIsExpanded] = useState(props.defaultExpanded);

    const toggleExpansion = () => setIsExpanded(state => !state);

    return (
        <div className={`accordion-item ${isExpanded ? "expanded" : "closed"}`}>
            <div
                className={`accordion-item__header ${isExpanded ? "expanded" : "closed"}`}
                onClick={toggleExpansion}
            >
                {props.title}
                <PiCaretUp size={ICON_SIZE} />
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
	readonly defaultExpanded?: boolean;
    readonly items: Array<AccordionItemType>;
};
export const Accordion = ({ defaultExpanded = false, items }: AccordionProps) => (
    items.map((item, index) => (
		<AccordionItem 
			{...item} 
			defaultExpanded={defaultExpanded} 
			key={`accordion-item-${index}`} 
		/>
	))
);
