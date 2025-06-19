import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { CanvasElement, FileInStructure, PdfElement, PdfFileElements, ReferenceElement } from "../../../types";
import { getCanvasElements, getPdfElements, getReferenceElement } from "../../../utils";

import { useFoldersManager } from "../../manager";

import { usePdfFile } from "../file";

import { HistoryAction, PdfHistoryContext, PdfHistoryContextType } from "./PdfHistoryContext";

const DEFAULT_INDEX = -1;
export const PdfHistoryProvider = ({ children }: PropsWithChildren) => {
    const [historyIndex, setHistoryIndex] = useState(DEFAULT_INDEX);
    const [savedElements, setSavedElements] = useState<PdfFileElements>({
        canvasElements: [],
        pdfElements: [],
        references: [],
    });
    const [userActions, setUserActions] = useState<Array<HistoryAction>>([]);

    const { files, selectedFile } = useFoldersManager();
    const { pageIndex } = usePdfFile();

    const backward = () => setHistoryIndex(state => Math.max(-1, state - 1));
    const forward  = () => setHistoryIndex(state => Math.min(userActions.length, state + 1));
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

    useEffect(() => {
        setHistoryIndex(DEFAULT_INDEX);
        setUserActions([]);

        if (
            selectedFile.fileInStructure
        ) {
            setSavedElements(selectedFile.fileInStructure.elements[pageIndex]);
        }
    }, [selectedFile.path, pageIndex]);
    // Responsible to update the folders structure on user actions + history index
    useEffect(() => {
        if (!selectedFile.fileInStructure) {
            return;
        }

        const canvasElements: Array<CanvasElement> = [...savedElements.canvasElements];
        const pdfElements: Array<PdfElement> = [...savedElements.pdfElements];
        const references: Array<ReferenceElement> = [...savedElements.references];

        for (let i = 0; i < historyIndex + 1; i++) {
            const userAction = userActions[i];
            for (const element of userAction.elements) {
                canvasElements.push(...getCanvasElements(element));
                pdfElements.push(...getPdfElements(element));
            }

            if (!userAction.reference) {
                continue;
            }

            const reference = getReferenceElement(userAction.reference);
            if (reference) {
                references.push(...reference);
            }
        }

        const updatedFile: FileInStructure = {
            ...selectedFile.fileInStructure,
            elements: {
                ...selectedFile.fileInStructure.elements,
                [Math.max(pageIndex, 1)]: {
                    canvasElements,
                    pdfElements,
                    references,
                },
            },
        };

        files.update(updatedFile);
    }, [historyIndex, pageIndex, savedElements, userActions]);

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
