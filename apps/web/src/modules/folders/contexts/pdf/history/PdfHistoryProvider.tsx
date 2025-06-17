import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { getCanvasElements, getPdfElements } from "../../../utils";

import { useFoldersManager } from "../../manager";

import { usePdfFile } from "../file";
import { CanvasElement, PdfElement } from "../types";

import { HistoryAction, PdfHistoryContext, PdfHistoryContextType } from "./PdfHistoryContext";

export const PdfHistoryProvider = ({ children }: PropsWithChildren) => {
    const [userActions, setUserActions] = useState<Array<HistoryAction>>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const { files, selectedFile } = useFoldersManager();
    const { containerRef } = usePdfFile();

    const backward = () => setHistoryIndex(state => Math.max(-1, state - 1));
    const forward  = () => setHistoryIndex(state => Math.min(userActions.length, state++));
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

        const canvasElements: Array<CanvasElement> = [];
        const pdfElements: Array<PdfElement> = [];

        for (let i = 0; i < historyIndex + 1; i++) {
            const userAction = userActions[i];
            for (const element of userAction.elements) {
                canvasElements.push(...getCanvasElements({ ...element, containerRef }));
                pdfElements.push(...getPdfElements(element));
            }
        }
        const updatedFile = {
            ...selectedFile.fileInStructure,
            canvasElements,
            pdfElements,
        };

        files.update(updatedFile);
    }, [historyIndex, userActions]);

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
