import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { HistoryAction, PdfHistoryContext, SortedActions } from "./PdfHistoryContext";

export const PdfHistoryProvider = ({ children }: PropsWithChildren) => {
    const [userActions, setUserActions] = useState<Array<HistoryAction>>([]);
    const [historyIndex, setHistoryIndex] = useState(0);

    useEffect(() => { console.log({ userActions }) }, [userActions]);

    const backward = () => setHistoryIndex(state => Math.max(0, state-1));
    const forward = () => setHistoryIndex(state => Math.min(userActions.length-1, state));
    const pushAction = (action: HistoryAction) => {
        const copy = [...userActions];

        copy.splice(historyIndex, Infinity, action);

        setHistoryIndex(copy.length - 1);
        setUserActions(copy);
    };

    const sortedActions: SortedActions = useMemo(() => {
        const elements = [];
        const references = [];

        for (const userAction of userActions) {
            if (userAction.elements) {
                elements.push(...userAction.elements);
            }
            if (userAction.reference) {
                references.push(userAction.reference);
            }
        }

        return ({
            elements,
            references,
        });
    }, [userActions]);

    const value = {
        backward,
        forward,
        pushAction,
        ...sortedActions,
    };

    return (
        <PdfHistoryContext.Provider value={value}>
            {children}
        </PdfHistoryContext.Provider>
    );
};
