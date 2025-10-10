import { PropsWithChildren, ReactNode, useEffect, useMemo, useState } from "react";
import { MdBorderColor, MdComment, MdFormatColorFill, MdOutlineMenuBook } from "react-icons/md";
import { useTranslation } from "react-i18next";

import {
    DRAWING_TYPES,
    FILE_TOOLS,
    GENERATED_RESOURCES,
    REFERENCE_TYPES,
    TOOLS_ON_SELECTION,

    ActionColor,
    ColorKind,
    ElementAction,
    GenerateResourceHistoryAction,
    HistoryAction,
    FileTool,
    Note,
    ReferenceAction,
    VocabularyTerm,
} from "@repo/types";

import { useContextMenu } from "@/contexts";
import { useColorPanel } from "@/modules/colorPanel";
import { ActionItem, CustomCursor, EditorContextMenuItem } from "@/modules/files";
import { useFoldersManager } from "@/modules/folders";
import { getRgbColor, getRgbFromString, handleActionColor } from "@/utils";

import { usePdfFile } from "../file";
import { usePdfHistory } from "../history";

import { PdfToolsContext, PdfToolsContextType } from "./PdfToolsContext";
import { getRange } from "./utils";

const NEW_DEFAULT_COLOR: ActionColor = {
    kind: ColorKind.INLINE,
    value: {
        r: .2,
        g: 1,
        b: 0,
    },
};
export const getNoteId = (color: string, index: number | string) => (
    `${Object.values(getRgbFromString(color)).join("-")}-${index}`
);

export const PdfToolsProvider = ({ children }: PropsWithChildren) => {
    const [color, setColor] = useState<ActionColor>(NEW_DEFAULT_COLOR);
    /** Text selection range */
    const [currentRange, setCurrentRange] = useState<Range | undefined>(undefined);
    const [customCursor, setCustomCursor] = useState<ReactNode>(null);
    const [tool, setTool] = useState<FileTool | null>(null);

    const { colorPanel } = useColorPanel();
    const { setContextMenu } = useContextMenu();
    const { selectedFile } = useFoldersManager();
    const { containerRef, pageIndex, pageRef, setDisplayLoader } = usePdfFile();
    const { pushAction } = usePdfHistory();
    const { t } = useTranslation();

    const { fileInStructure, path: filePath } = selectedFile;
    const pdfFile = fileInStructure!;

    const rgbColor = useMemo(() => handleActionColor(color, colorPanel), [color, colorPanel]);

    const removeSelection = () => window.getSelection()?.removeAllRanges();
    // ------ HANDLERS ------
    /** Updates the pdf file and clean the tools */
    const handleSelection = async (tool: FileTool) => {
        if (!pageRef.current) {
            return;
        }

        const range = currentRange;
        if (!range) {
            return;
        };

        const pageDimensions = pageRef.current.getBoundingClientRect();

        setDisplayLoader(true);

        const rects = range.getClientRects();
        const rectsArray = Array.from(rects);
        const userAction: ElementAction = {
            type: DRAWING_TYPES.RECT,
            element: {
                color,
                pageDimensions,
                pageIndex,
                file: pdfFile.file,
                rectsArray,
                tool,
            },
        };

        pushAction({ elements: [userAction] });
        setCurrentRange(undefined);
        setDisplayLoader(false);
        removeSelection();
    };

    const handleInteractiveSelection = async (tool: FileTool) => {
        if (
            !currentRange ||
            (
                tool !== FILE_TOOLS.VOCABULARY &&
                tool !== FILE_TOOLS.NOTE
            ) ||
            !pageRef.current
        ) {
            return;
        }

        setDisplayLoader(true);

        const pageDimensions = pageRef.current.getBoundingClientRect();
        const rects = currentRange.getClientRects();
        const rectsArray = Array.from(rects);

        const isNote = tool === FILE_TOOLS.NOTE;

        let colorKey = "";
        let id = "";
        let text = "";
        let element: Note | VocabularyTerm;

        if (isNote) {
            const { y } = rectsArray[0];
            colorKey = getRgbColor(rgbColor);

            const noteFilter = (elem: Note) => {
                const toolColor = getRgbColor(rgbColor);
                const elemColor = getRgbColor(handleActionColor(elem.color, colorPanel));

                return (toolColor === elemColor);
            };
            const noteGroup = pdfFile.actions[pageIndex].generatedResources?.filter(noteFilter);
            const occurenceText = currentRange.toString().trim();

            if (!noteGroup) return;

            text = noteGroup.length > 0
                ? `${noteGroup.length + 1}`
                : "1";
            id = getNoteId(colorKey, text);
            element = {
                color,
                note: "",
                id,
                occurence: {
                    filePath,
                    pageIndex,
                    text: occurenceText,
                },
                y: y - pageDimensions.top,
            };
        } else {
            const wordToAdd = currentRange.toString().trim();

            id = wordToAdd.split(" ").join("-");
            colorKey = getRgbColor(rgbColor);
            text = "*";
            element = {
                color,
                id,
                occurence: {
                    filePath,
                    pageIndex,
                    text: wordToAdd,
                },
                translations: [],
            };
        }

        const actionElement = {
            color,
            pageDimensions,
            pageIndex,
            file: pdfFile.file,
        };
        const elementAction: ElementAction = {
            type: DRAWING_TYPES.RECT,
            element: {
                ...actionElement,
                rectsArray,
                tool,
            },
        };
        const textAction: ElementAction = {
            type: DRAWING_TYPES.TEXT,
            element: {
                ...actionElement,
                rect: rectsArray[rectsArray.length - 1],
                text,
            },
        };
        const interractiveText: ReferenceAction = isNote
            ? {
                type: REFERENCE_TYPES.NOTE,
                element: {
                    ...actionElement,
                    id,
                    rectsArray,
                },
            }
            : {
                type: REFERENCE_TYPES.VOCABULARY,
                element: {
                    ...actionElement,
                    id,
                    rectsArray,
                },
            };
        const generatedElement: GenerateResourceHistoryAction = isNote
            ? {
                element: element as Note,
                type: GENERATED_RESOURCES.NOTE,
            }
            : {
                element: element as VocabularyTerm,
                type: GENERATED_RESOURCES.VOCABULARY,
            };
        const historyAction: HistoryAction = {
            elements: [elementAction, textAction],
            reference: interractiveText,
            resourceToGenerate: generatedElement,
        };

        removeSelection();
        pushAction(historyAction);
        setCurrentRange(undefined);
        setTool(null);
        setDisplayLoader(false);
    };

    // Responsible to store the text selection
    useEffect(() => {
        document.addEventListener("selectionchange", () => {
            const range = getRange();

            setCurrentRange(range);
        });

        return () => {
            document.removeEventListener("selectionchange", () => {
                const range = getRange();

                setCurrentRange(range);
            });
        };
    }, []);
    // Handles the stop text selection
    useEffect(() => {
        const handleMouseUp = () => {
            if (!tool) return;

            if (
                tool === FILE_TOOLS.UNDERLINE ||
                tool === FILE_TOOLS.HIGHLIGHT
            ) {
                handleSelection(tool);
                return;
            }

            if (
                tool === FILE_TOOLS.NOTE ||
                tool === FILE_TOOLS.VOCABULARY
            ) {
                handleInteractiveSelection(tool);
                return;
            }
        };

        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [color, currentRange, filePath, pdfFile, tool]);
    // Handles the custom cursor
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

            setCustomCursor(
                <CustomCursor
                    color={getRgbColor(rgbColor)}
                    position={{ x: e.clientX - containerLeft, y: e.clientY - containerTop }}
                    tool={tool!}
                />
            );
        };

        if (tool) {
            container.style.cursor = "none";
            document.addEventListener("mousemove", handleMouseMove);
        } else {
            container.style.cursor = "auto";
            setCustomCursor(null);
        }

        return () => {
            container.style.cursor = "auto";
            setCustomCursor(null);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [color, tool]);

    const actionsRecord: Record<TOOLS_ON_SELECTION, ActionItem> = {
        [TOOLS_ON_SELECTION.UNDERLINE]: {
            icon: <MdBorderColor />,
            onClick: () => handleSelection(FILE_TOOLS.UNDERLINE),
        },
        [TOOLS_ON_SELECTION.HIGHLIGHT]: {
            icon: <MdFormatColorFill />,
            onClick: () => handleSelection(FILE_TOOLS.HIGHLIGHT),
        },
        [TOOLS_ON_SELECTION.NOTE]: {
            icon: <MdComment />,
            onClick: () => handleInteractiveSelection(FILE_TOOLS.NOTE),
        },
        [TOOLS_ON_SELECTION.VOCABULARY]: {
            icon: <MdOutlineMenuBook />,
            onClick: () => handleInteractiveSelection(FILE_TOOLS.VOCABULARY),
        },
    };
    const items = Object.entries(actionsRecord).map(([key, value]) => ({
        children: (
            <EditorContextMenuItem
                actionItem={value}
                tool={key as TOOLS_ON_SELECTION}
                t={t}
            />
        ),
        onClick: value.onClick,
    }));
    // Handles the pdf tools on contextMenu + selectedText
    const onContextMenu = (e: MouseEvent) => {
        if (!currentRange) return;

        e.preventDefault();

        setContextMenu({ x: e.clientX, y: e.clientY }, Object.values(items));
    };
    const onToolSelection = (tool: FileTool | null) => {
        setTool(tool);

        if (!tool) {
            return;
        }
        if (
            tool === FILE_TOOLS.HIGHLIGHT ||
            tool === FILE_TOOLS.UNDERLINE
        ) {
            handleSelection(tool);
            return;
        }

        if (
            tool === FILE_TOOLS.NOTE ||
            tool === FILE_TOOLS.VOCABULARY
        ) {
            handleInteractiveSelection(tool);
            return;
        }
    };

    const value: PdfToolsContextType = {
        color,
        currentRange,
        customCursor,
        onContextMenu,
        onToolSelection,
        setColor,
        setTool,
        tool,
    };

    return (
        <PdfToolsContext.Provider value={value}>
            {children}
        </PdfToolsContext.Provider>
    );
};
