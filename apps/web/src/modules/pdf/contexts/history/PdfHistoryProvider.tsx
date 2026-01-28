import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";

import {
	GENERATED_RESOURCES,
	ActionColor,
	FileAction,
	HistoryAction,
	Note,
} from "@repo/types";

import { useColorPanel } from "@/modules/colorPanel";
import { useFoldersActions, useFoldersManager } from "@/modules/folders";
import { useVocabulary } from "@/modules/vocabulary";
import { handleActionColor } from "@/utils";

import { getInterractiveReference } from "../../utils";

import { usePdfFile } from "../file";

import { PdfHistoryContext, PdfHistoryContextType } from "./PdfHistoryContext";

const DEFAULT_INDEX = -1 as const;
/**
 * Responsible to update the folders structure and the vocabulary on user actions
 */
export const PdfHistoryProvider = ({ children }: PropsWithChildren) => {
	const [historyIndex, setHistoryIndex] = useState<number>(DEFAULT_INDEX);
	const [savedElements, setSavedElements] = useState<FileAction | null>(null);
	const [userActions, setUserActions] = useState<Array<HistoryAction>>([]);
	const [version, setVersion] = useState(0);

	const { colorPanel } = useColorPanel();
	const { getFileActions, getPageActions, updatePageActions } = useFoldersActions();
	const { selectedFile } = useFoldersManager();
	const { pageIndex } = usePdfFile();
	const { addToVocabulary, remove } = useVocabulary();

	const shouldUpdateRef = useRef(false);
	const prevIndexRef = useRef<number>(DEFAULT_INDEX);

	const backward = () => {
		shouldUpdateRef.current = true;
		setHistoryIndex((state) => Math.max(-1, state - 1));
	};
	const forward = () => {
		shouldUpdateRef.current = true;
		setHistoryIndex((state) => Math.min(userActions.length, state + 1));
	};
	const pushAction = (action: HistoryAction) => {
		const copy = [...userActions];

		if (copy.length === 0) {
			copy.push(action);
		} else {
			copy.splice(historyIndex + 1, Infinity, action);
		}

		setHistoryIndex(copy.length - 1);
		shouldUpdateRef.current = true;
		setUserActions(copy);
	};
	// TODO / TOFIX: Improve that mess
	const updateNoteInHistory = (
		color: ActionColor,
		id: string,
		text: string,
	) => {
		const userActionIndex = userActions.findIndex((action: HistoryAction) => {
			if (action.resourceToGenerate?.type !== GENERATED_RESOURCES.NOTE) {
				return (false);
			}

			const currentColor = handleActionColor(action.resourceToGenerate.element.color, colorPanel);
			const noteColor = handleActionColor(color, colorPanel);

			return (
				action.resourceToGenerate?.type === GENERATED_RESOURCES.NOTE &&
				action.resourceToGenerate.element.id === id &&
				currentColor === noteColor
			);
		});

		if (userActionIndex !== -1) {
			setUserActions((state) => {
				const copy = [...state];

				const currentAction = copy[userActionIndex];

				const updated: HistoryAction = {
					...currentAction,
					resourceToGenerate: {
						type: GENERATED_RESOURCES.NOTE,
						element: {
							...(currentAction.resourceToGenerate!.element as Note),
							note: text,
						},
					},
				};

				copy.splice(userActionIndex, 1, updated);

				shouldUpdateRef.current = true;

				return (copy);
			});
		}

		const savedIndex = savedElements?.generatedResources?.findIndex((resource) => {
			const currentColor = handleActionColor(
				resource.color,
				colorPanel,
			);
			const noteColor = handleActionColor(color, colorPanel);

			return (resource.id === id && currentColor === noteColor);
		}) ?? -1;

		if (savedIndex !== -1) {
			setSavedElements((prev) => {
				if (!prev) return (prev);

				const resources = prev.generatedResources ?? [];
				const noteColor = handleActionColor(color, colorPanel);

				const nextResources = resources.map((r) => {
					const currentColor = handleActionColor(r.color, colorPanel);
					const isSame = r.id === id && currentColor === noteColor;

					return isSame ? { ...r, note: text } : r;
				});

				return ({ ...prev, generatedResources: nextResources });
			});

			if (!selectedFile.fileInStructure) {
				return;
			}

			const fileId = selectedFile.fileInStructure.id;
			const pageActions = getPageActions(fileId, pageIndex);

			const resources = pageActions.generatedResources ?? [];
			const noteColor = handleActionColor(color, colorPanel);

			const nextResources = resources.map((r) => {
				const currentColor = handleActionColor(r.color, colorPanel);
				const isSame = r.id === id && currentColor === noteColor;
				return (isSame ? { ...r, note: text } : r);
			});

			updatePageActions(fileId, pageIndex, {
				...pageActions,
				generatedResources: nextResources,
			});
		}
	};

	// Reseting the history state and saving the elements coming from the folders structure
	useEffect(() => {
		setHistoryIndex(DEFAULT_INDEX);
		setUserActions([]);

		const file = selectedFile.fileInStructure;
		if (!file) {
			setSavedElements({
				elements: [],
				generatedResources: [],
				references: [],
			});
			prevIndexRef.current = DEFAULT_INDEX;
			return;
		}

		const pageActions = getFileActions(file.id);
		if (!(pageIndex in pageActions)) {
			setSavedElements({
				elements: [],
				generatedResources: [],
				references: [],
			});
			prevIndexRef.current = DEFAULT_INDEX;
			return;
		}

		const {
			elements = [],
			generatedResources = [],
			references = [],
		} = pageActions[pageIndex];

		setSavedElements({
			elements: [...elements],
			generatedResources: [...generatedResources],
			references: [...references],
		});

		prevIndexRef.current = DEFAULT_INDEX;
	}, [selectedFile.path, pageIndex]);

	// Responsible to update the folders structure on history actions
	useEffect(() => {
		const file = selectedFile.fileInStructure;
		if (!file || !shouldUpdateRef.current || !savedElements) return;

		// TODO / TOFIX: Improve that mess
		const handleUserActions = () => {
			const currentIndex = Math.max(-1, Math.min(historyIndex, userActions.length - 1));
			const prev = prevIndexRef.current;
			const indexToUse = currentIndex + 1;

			const elements = [...(savedElements.elements ?? [])];
			const references = [...(savedElements.references ?? [])];
			const notes = [...(savedElements.generatedResources ?? [])];

			for (let i = 0; i < indexToUse; i++) {
				const userAction = userActions[i];
				if (!userAction) break;

				elements.push(...userAction.elements);

				if (userAction.reference) {
					references.push(...getInterractiveReference(userAction.reference));
				}

				if (
					userAction.resourceToGenerate?.type ===
					GENERATED_RESOURCES.NOTE
				) {
					notes.push(userAction.resourceToGenerate.element);
				}
			}

			if (currentIndex > prev) {
				for (let i = prev + 1; i <= currentIndex; i++) {
					const userAction = userActions[i];
					if (
						userAction?.resourceToGenerate?.type ===
						GENERATED_RESOURCES.VOCABULARY
					) {
						const { element } = userAction.resourceToGenerate;
						addToVocabulary({
							color: element.color,
							pdfFileId: selectedFile.fileInStructure!.id,
							...element.occurrence,
						});
					}
				}
			} else if (currentIndex < prev) {
				for (let i = prev; i > currentIndex; i--) {
					const userAction = userActions[i];
					if (
						userAction?.resourceToGenerate?.type ===
						GENERATED_RESOURCES.VOCABULARY
					) {
						const e = userAction.resourceToGenerate.element;
						remove(e.color, e.occurrence.text); // cf. clé d’ID ci-dessous
					}
				}
			}

			const updated = {
				elements,
				generatedResources: notes,
				references,
			};
			updatePageActions(file.id, pageIndex, updated);

			prevIndexRef.current = currentIndex;
			shouldUpdateRef.current = false;

			setVersion((state) => state + 1);
		};

		handleUserActions();
	}, [
		historyIndex,
		savedElements,
		userActions,
		selectedFile.fileInStructure,
	]);

	const isUpToDate = useMemo(() => historyIndex === userActions.length - 1, [historyIndex, userActions]);

	const value: PdfHistoryContextType = {
		backward,
		forward,
		isUpToDate,
		historyIndex,
		pushAction,
		updateNoteInHistory,
		version,
	};

	return (
		<PdfHistoryContext.Provider value={value}>
			{children}
		</PdfHistoryContext.Provider>
	);
};
