import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";

import {
    GENERATED_ELEMENTS,
    CanvasElement,
    ClientPdfFile,
    PdfElement,
    PdfFileElements,
    Note,
    ReferenceElement,
} from "@repo/types";

import { useColorPanel } from "@/modules/colorPanel";
import { FILE_ELEMENTS, FIRST_PAGE } from "@/modules/files";
import { useFoldersManager } from "@/modules/folders";
import { usePreparationVocabulary } from "@/modules/vocabulary";
import { handleCanvasColor } from "@/utils";

import { getCanvasElements, getInterractiveReference, getPdfElements } from "../../utils";

import { usePdfFile } from "../file";

import { HistoryAction, PdfHistoryContext, PdfHistoryContextType } from "./PdfHistoryContext";

const DEFAULT_INDEX = -1 as const;
/**
 * Responsible to update the folders structure and the vocabulary on user actions
 */
export const PdfHistoryProvider = ({ children }: PropsWithChildren) => {
    const [historyIndex, setHistoryIndex] = useState<number>(DEFAULT_INDEX);
    const [savedElements, setSavedElements] = useState<PdfFileElements>({ ...FILE_ELEMENTS });
    const [userActions, setUserActions] = useState<Array<HistoryAction>>([]);

    const { colorPanel } = useColorPanel();
    const { files, selectedFile } = useFoldersManager();
    const { pageIndex } = usePdfFile();
    const { addToVocabulary, remove } = usePreparationVocabulary();

    const shouldUpdateRef = useRef(false);

    const backward = () => {
        shouldUpdateRef.current = true;
        setHistoryIndex(state => Math.max(-1, state - 1));
    };
    const forward = () => {
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
    const updateNoteInHistory = (color: string, id: string, text: string) => setUserActions(state => {
        const copy = [...state];

        const actionIndex = copy.findIndex(action => {
            if (
                !action.elementToGenerate ||
                action.elementToGenerate.type !== GENERATED_ELEMENTS.NOTE
            ) {
                return (false);
            }

            const currentColor = handleCanvasColor(action.elementToGenerate.element.color, colorPanel);

            return (
                action.elementToGenerate?.type === GENERATED_ELEMENTS.NOTE &&
                action.elementToGenerate.element.id === id &&
                currentColor === color
            );
        });

        if (actionIndex === -1) {
            // No need to update it since got from file structure
            return (copy);
        }

        const currentAction = copy[actionIndex];

        const updated: HistoryAction = {
            ...currentAction,
            elementToGenerate: {
                type: GENERATED_ELEMENTS.NOTE,
                element: {
                    ...(currentAction.elementToGenerate!.element as Note),
                    note: text,
                },
            },
        };

        copy.splice(actionIndex, 1, updated);

        shouldUpdateRef.current = true;

        return (copy);
    });

    // Reseting the history state and saving the elements coming from the folders structure
    useEffect(() => {
        setHistoryIndex(DEFAULT_INDEX);
        setUserActions([]);

        const file = selectedFile.fileInStructure;
        if (!file || !(pageIndex in file.elements)) return;

        setSavedElements(file.elements[pageIndex]);
    }, [selectedFile.path, pageIndex]);
    // Responsible to update the folders structure on history actions
    useEffect(() => {
        const file = selectedFile.fileInStructure;
        if (!file || !shouldUpdateRef.current) {
            return;
        }

        const canvasElements: Array<CanvasElement> = [...savedElements.canvasElements];
        const notes: Array<Note> = [...savedElements.notes];
        const pdfElements: Array<PdfElement> = [...savedElements.pdfElements];
        const references: Array<ReferenceElement> = [...savedElements.references];

        const indexToUse = historyIndex + 1;

        for (let i = 0; i < indexToUse; i++) {
            const userAction = userActions[i];
            for (const element of userAction.elements) {
                canvasElements.push(...getCanvasElements(element));
                pdfElements.push(...getPdfElements(element));
            }

            if (userAction.interractiveText) {
                const reference = getInterractiveReference(userAction.interractiveText);
                if (reference) {
                    references.push(...reference);
                }
            }

            if (userAction.elementToGenerate) {
                if (userAction.elementToGenerate.type === GENERATED_ELEMENTS.NOTE) {
                    const note = userAction.elementToGenerate.element;
                    // @ts-expect-error
                    delete note.occurence.pageIndex;

                    notes.push(userAction.elementToGenerate.element);
                }
                if (userAction.elementToGenerate.type === GENERATED_ELEMENTS.VOCABULARY) {
                    addToVocabulary({
                        color: userAction.elementToGenerate.element.color,
                        ...userAction.elementToGenerate.element.occurence,
                    });
                }
            }
        }

        if (indexToUse < userActions.length) {
            for (let i = indexToUse; userActions.length; i++) {
                const userAction = userActions[i];

                if (!userAction) {
                    break;
                }

                if (
                    userAction.elementToGenerate &&
                    userAction.elementToGenerate.type === GENERATED_ELEMENTS.VOCABULARY
                ) {
                    remove(userAction.elementToGenerate.element.color, userAction.elementToGenerate.element.id);
                }
            }
        }

        const updatedFile: ClientPdfFile = {
            ...file,
            elements: {
                ...file.elements,
                [Math.max(pageIndex, FIRST_PAGE)]: {
                    canvasElements,
                    notes,
                    pdfElements,
                    references,
                },
            },
        };

        files.update(updatedFile);
        shouldUpdateRef.current = false;
    }, [historyIndex, savedElements, userActions]);

    const isUpToDate = useMemo(() => (
        historyIndex === userActions.length - 1
    ), [historyIndex, userActions]);

    const value: PdfHistoryContextType = {
        backward,
        forward,
        isUpToDate,
        historyIndex,
        pushAction,
        updateNoteInHistory,
    };

    return (
        <PdfHistoryContext.Provider value={value}>
            {children}
        </PdfHistoryContext.Provider>
    );
};
