import { PropsWithChildren, ReactNode, useEffect, useMemo, useState } from "react";
import { PiChatText, PiPaintBucket, PiPencilLine, PiTranslate } from "react-icons/pi";
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
import { LANGUAGES_STATE, useFoldersActions, useFoldersManager } from "@/modules/folders";
import { getRgbColor, getRgbFromString, handleActionColor } from "@/utils";

import { handleRange } from "../../utils";

import { usePdfFile } from "../file";
import { usePdfHistory } from "../history";

import { PdfToolsContext, PdfToolsContextType } from "./PdfToolsContext";
import { adjustedRange, getRange } from "./utils";

const NEW_DEFAULT_COLOR: ActionColor = {
    kind: ColorKind.INLINE,
    value: {
        r: .2,
        g: 1,
        b: 0,
    },
};
const getNoteId = (color: string, index: number | string) => (
    `${Object.values(getRgbFromString(color)).join("-")}-${index}`
);

export const PdfToolsProvider = ({ children }: PropsWithChildren) => {
    const [color, setColor] = useState<ActionColor>(NEW_DEFAULT_COLOR);
    /** Text selection range */
    const [currentRange, setCurrentRange] = useState<Range | undefined>(undefined);
    const [customCursor, setCustomCursor] = useState<ReactNode>(null);
	const [isCursorVisible, setIsCursorVisible] = useState(false);
	const [languageToConfirm, setLanguageToConfirm] = useState<string | undefined>(undefined);
	const [languageToUse, setLanguageToUse] = useState<string | undefined>(undefined);
	const [pendingVocabularyCreation, setPendingVocabularyCreation] = useState(false);
    const [tool, setTool] = useState<FileTool | null>(null);
	const [vocabularyBaseRange, setVocabularyBaseRange] = useState<Range | undefined>(undefined);

    const { colorPanel } = useColorPanel();
    const { setContextMenu } = useContextMenu();
    const { getPageActions } = useFoldersActions();
    const { languagesState, selectedFile, setLanguagesState } = useFoldersManager();
    const { containerRef, pageIndex, pageRef } = usePdfFile();
    const { pushAction } = usePdfHistory();
    const { t } = useTranslation();

    const { fileInStructure, path: filePath } = selectedFile;
    const pdfFile = fileInStructure!;

    const rgbColor = useMemo(() => handleActionColor(color, colorPanel), [color, colorPanel]);

    const removeSelection = () => window.getSelection()?.removeAllRanges();
    // ------ HANDLERS ------
	const cancelVocabularyCreation = () => {
		removeSelection();
		setCurrentRange(undefined);
		setVocabularyBaseRange(undefined);
		setTool(null);
		setPendingVocabularyCreation(false);
		setLanguageToConfirm(undefined);
		setLanguageToUse(undefined);
		setLanguagesState(LANGUAGES_STATE.NULL);	
	};
    /** Updates the pdf file and clean the tools */
    const handleSelection = (tool: FileTool) => {
        if (!pageRef.current) {
            return;
        }

        const range = currentRange;
        if (!range) {
            return;
        };

        const pageDimensions = pageRef.current.getBoundingClientRect();

		const rectsArray = handleRange(range);
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
        removeSelection();
    };
	const handleInteractiveSelection = (tool: FileTool) => {
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

		const pageDimensions = pageRef.current.getBoundingClientRect();
		const rectsArray = handleRange(currentRange);

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

			const pageActions = getPageActions(pdfFile.id, pageIndex);
			const noteGroup = pageActions.generatedResources?.filter(noteFilter);
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
				occurrence: {
					filePath,
					pageIndex,
					text: occurenceText,
				},
				y: y - pageDimensions.top,
			};
		} else {
			// Need to define language for the file
			if (fileInStructure?.language === undefined) {
				setPendingVocabularyCreation(true);
				setLanguagesState(LANGUAGES_STATE.MANDATORY);
				return;
			}
			
			// Need to confirm that the vocabulary term comes from supposed language
			if (
				fileInStructure?.language !== undefined &&
				languageToUse === undefined
			) {
				setPendingVocabularyCreation(true);
				setVocabularyBaseRange(currentRange.cloneRange());
				setLanguageToConfirm(fileInStructure.language);
				return;
			}

			// Got everything we needed
			if (pendingVocabularyCreation) {
				setPendingVocabularyCreation(false);
			}

			const wordToAdd = currentRange.toString().trim();
			id = wordToAdd.split(" ").join("-");
			colorKey = getRgbColor(rgbColor);
			text = "*";
			element = {
				color,
				id,
				occurrence: {
					filePath,
					language: languageToUse!,
					pageIndex,
					text: wordToAdd,
				},
				translations: {},
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
		setVocabularyBaseRange(undefined);
		setTool(null);
		setLanguageToUse(undefined);
	};
	const updateVocabularyRangeFromText = (nextText: string) => {
		if (!pageRef.current || !vocabularyBaseRange) {
			return (false);
		}

		const nextRange = adjustedRange(
			pageRef.current,
			vocabularyBaseRange,
			nextText,
		);

		if (!nextRange) {
			return (false);
		}

		setCurrentRange(nextRange);
		return (true);
	};

    // Responsible to add the new vocabulary term after defining and cofirming language
    useEffect(() => {
		if (
			!pendingVocabularyCreation ||
			languagesState !== LANGUAGES_STATE.NULL ||
			!selectedFile.fileInStructure?.language
		) {
			return;
		}

		handleInteractiveSelection(FILE_TOOLS.VOCABULARY);
	}, [
		languagesState,
		languageToConfirm,
		languageToUse,
		pendingVocabularyCreation,
		selectedFile.fileInStructure?.language,
	]);
	// Responsible to store the text selection
	useEffect(() => {
		const handleSelectionChange = () => {
			const range = getRange();

			if (!range || !pageRef.current) {
				return;
			}

			const startInPage = pageRef.current.contains(range.startContainer);
			const endInPage = pageRef.current.contains(range.endContainer);

			if (!startInPage || !endInPage) {
				return;
			}

			setCurrentRange(range);
		};

		document.addEventListener("selectionchange", handleSelectionChange);

		return () => {
			document.removeEventListener("selectionchange", handleSelectionChange);
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

		// On garde la dernière position souris en coords viewport
		const lastClientPos = { x: 0, y: 0 };
		let hasMouse = false;

		const updateCursorFromClient = (clientX: number, clientY: number) => {
			const rect = container.getBoundingClientRect();

			// IMPORTANT:
			// - clientX/clientY : coords viewport
			// - custom cursor has position:absolute in scrollable container
			// => Have to add scrollTop/scrollLeft
			const x = clientX - rect.left + container.scrollLeft;
			const y = clientY - rect.top + container.scrollTop;

			setCustomCursor(
				<CustomCursor
					color={getRgbColor(rgbColor)}
					opacity={isCursorVisible ? 1 : 0}
					position={{ x, y }}
					tool={tool!}
				/>
			);
		};

		const onMouseMove = (e: MouseEvent) => {
			hasMouse = true;
			lastClientPos.x = e.clientX;
			lastClientPos.y = e.clientY;
			updateCursorFromClient(e.clientX, e.clientY);
		};

		const onScroll = () => {
			// On scroll without moving mouse => replaying last position
			if (!hasMouse) return;
			updateCursorFromClient(lastClientPos.x, lastClientPos.y);
		};

		if (tool) {
			container.style.cursor = "none";

			container.addEventListener("mousemove", onMouseMove);
			container.addEventListener("scroll", onScroll, { passive: true });
		} else {
			container.style.cursor = "auto";
			setCustomCursor(null);
		}

		return () => {
			container.style.cursor = "auto";
			setCustomCursor(null);
			container.removeEventListener("mousemove", onMouseMove);
			container.removeEventListener("scroll", onScroll);
		};
	}, [isCursorVisible, tool, rgbColor]);

    const actionsRecord: Record<TOOLS_ON_SELECTION, ActionItem> = {
        [TOOLS_ON_SELECTION.UNDERLINE]: {
            icon: <PiPencilLine />,
            onClick: () => handleSelection(FILE_TOOLS.UNDERLINE),
        },
        [TOOLS_ON_SELECTION.HIGHLIGHT]: {
            icon: <PiPaintBucket />,
            onClick: () => handleSelection(FILE_TOOLS.HIGHLIGHT),
        },
        [TOOLS_ON_SELECTION.NOTE]: {
            icon: <PiChatText />,
            onClick: () => handleInteractiveSelection(FILE_TOOLS.NOTE),
        },
        [TOOLS_ON_SELECTION.VOCABULARY]: {
            icon: <PiTranslate />,
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
		cancelVocabularyCreation,
        color,
        currentRange,
        customCursor,
		languageToConfirm,
        onContextMenu,
        onToolSelection,
        setColor,
		setIsCursorVisible,
		setLanguageToConfirm,
		setLanguageToUse,
        setTool,
        tool,
		updateVocabularyRangeFromText,
    };

    return (
        <PdfToolsContext.Provider value={value}>
            {children}
        </PdfToolsContext.Provider>
    );
};
