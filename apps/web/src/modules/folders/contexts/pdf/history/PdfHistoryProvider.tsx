import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";

import { CanvasElement, FileInStructure, PdfElement, PdfFileElements, ReferenceElement } from "../../../types";
import { getCanvasElements, getPdfElements, getReferenceElement } from "../../../utils";

import { useFoldersManager } from "../../manager";

import { usePdfFile } from "../file";

import { HistoryAction, PdfHistoryContext, PdfHistoryContextType } from "./PdfHistoryContext";

const DEFAULT_INDEX = -1;
export const PdfHistoryProvider = ({ children }: PropsWithChildren) => {
    const [currentElements, setCurrentElements] = useState<PdfFileElements>({
        canvasElements: [],
        pdfElements: [],
        references: [],
    });
    const [historyIndex, setHistoryIndex] = useState(DEFAULT_INDEX);
    const [savedElements, setSavedElements] = useState<PdfFileElements>({
        canvasElements: [],
        pdfElements: [],
        references: [],
    });
    const [userActions, setUserActions] = useState<Array<HistoryAction>>([]);

    const { files, selectedFile } = useFoldersManager();
    const { pageIndex } = usePdfFile();

    const shouldUpdateRef = useRef(false);

    const backward = () => {
        shouldUpdateRef.current = true;
        setHistoryIndex(state => Math.max(-1, state - 1));
    };
    const forward  = () => {
        shouldUpdateRef.current = true;
        setHistoryIndex(state => Math.min(userActions.length, state + 1));
    };
    const pushAction = (action: HistoryAction) => {
        let copy = [...userActions];

        if (copy.length === 0) {
            copy.push(action);
        }
        else {
            copy.splice(historyIndex + 1, Infinity, action);
        }

        setHistoryIndex(copy.length - 1);
        shouldUpdateRef.current = true;
        setUserActions(copy);
    };

    useEffect(() => {
        setHistoryIndex(DEFAULT_INDEX);
        setUserActions([]);

        const file = selectedFile.fileInStructure;
        if (!file || !(pageIndex in file.elements)) return;

        setSavedElements(file.elements[pageIndex]);
    }, [selectedFile.path, pageIndex]);
    // Responsible to update the elements on user actions + history index + saved elements
    useEffect(() => {
        const file = selectedFile.fileInStructure;
        if (!file) {
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

        setCurrentElements({
            canvasElements,
            pdfElements,
            references,
        })
    }, [historyIndex, savedElements, userActions]);
    // Responsible to update the folders structure on history action
    useEffect(() => {
        const file = selectedFile.fileInStructure;
        if (!file || !shouldUpdateRef.current) return;

        const updatedFile: FileInStructure = {
            ...file,
            elements: {
                ...file.elements,
                [Math.max(pageIndex, 1)]: currentElements,
            },
        };

        files.update(updatedFile);
        shouldUpdateRef.current = false;
    }, [currentElements]);

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
