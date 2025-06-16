import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { getCanvasElements, getPdfElements } from "../../../utils";

import { useFoldersManager } from "../../manager";

import { usePdfFile } from "../file";

import { HistoryAction, PdfHistoryContext, PdfHistoryContextType } from "./PdfHistoryContext";

/**
 * Process
 *
 * User actions gets updated
 * -> Turns the actions into canvas elements and pdf elements
 * -> Updates the folders structure
 *
 * Need
 * -> 2 hooks useCanvasElement & usePdfElement
 *      Should return respective element from user actions
 */

export const PdfHistoryProvider = ({ children }: PropsWithChildren) => {
    const [userActions, setUserActions] = useState<Array<HistoryAction>>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const { files, selectedFile } = useFoldersManager();
    const { containerRef } = usePdfFile();

    const backward = () => setHistoryIndex(state => Math.max(-1, state));
    const forward = () => setHistoryIndex(state => Math.min(userActions.length-1, state!));
    const pushAction = (action: HistoryAction) => {
        let copy = [...userActions];

        if (copy.length === 0) {
            copy.push(action);
        }
        else {
            copy.splice(historyIndex + 1, Infinity, action);
        }

        setHistoryIndex(copy.length - 1);
        setUserActions(copy);
    };

    // Responsible to update the folders structure
    useEffect(() => {
        if (!selectedFile.fileInStructure) {
            return;
        }
        for (const userAction of userActions) {
            for (const element of userAction.elements) {
                const canvasElements = getCanvasElements({ ...element, containerRef });
                const pdfElements = getPdfElements(element);

                const updatedFile = {
                    ...selectedFile.fileInStructure,
                    canvasElements,
                    pdfElements,
                };

                files.update(updatedFile);
            }
        }
    }, [userActions]);

    const isUpToDate = useMemo(() => (
        historyIndex === userActions.length - 1
    ), [historyIndex, userActions]);

    const value: PdfHistoryContextType = {
        backward,
        forward,
        isUpToDate,
        historyIndex,
        pushAction,
    };

    return (
        <PdfHistoryContext.Provider value={value}>
            {children}
        </PdfHistoryContext.Provider>
    );
};
