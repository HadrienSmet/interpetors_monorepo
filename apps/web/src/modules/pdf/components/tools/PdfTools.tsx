import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    MdArrowBack,
    MdArrowForward,
    MdBorderColor,
    MdBrush,
    MdComment,
    MdDownload,
    MdEdit,
    MdFormatColorFill,
    MdSave,
    MdTranslate,
} from "react-icons/md";

import { ColorKind, FILE_TOOLS, RgbColor } from "@repo/types";

import { DraggableSection, Loader, useDraggableSection } from "@/components";
import { useAuth } from "@/modules/auth";
import { ColorPicker, ColorSwatch, useColorPanel } from "@/modules/colorPanel";
import { useFoldersActions, useFoldersManager } from "@/modules/folders";
import { PREPARATION, SavedPreparation, SavePreparationParams, uploadPreparation, usePreparation, usePreparations } from "@/modules/preparations";
import { useVocabularyTable } from "@/modules/vocabulary";
import { useWorkspaces } from "@/modules/workspace";
import { getRgbColor, handleActionColor } from "@/utils";

import { usePdfFile, usePdfTools } from "../../contexts";

import { HistoryButton, HistoryButtonItem, ToolButton, ToolButtonItem } from "./buttons";
import "./pdfTools.scss";

const PANEL_PADDING = 8 as const;
const PANEL_SIZE = 313 as const;
const COLOR_PICKER_DIMENSION = PANEL_SIZE - (PANEL_PADDING * 2);

const HISTORY_BUTTONS: Array<HistoryButtonItem> = [
    {
        icon: <MdArrowBack />,
        id: "backward",
    },
    {
        icon: <MdArrowForward />,
        id: "forward",
    },
];
// TODO: Need to have one source of truth for tools icons
const TOOLS_BUTTONS: Array<ToolButtonItem> = [
    {
        icon: <MdBorderColor />,
        id: FILE_TOOLS.UNDERLINE,
    },
    {
        icon: <MdFormatColorFill />,
        id: FILE_TOOLS.HIGHLIGHT,
    },
    {
        icon: <MdBrush />,
        id: FILE_TOOLS.BRUSH,
    },
    {
        icon: <MdComment />,
        id: FILE_TOOLS.NOTE,
    },
    {
        icon: <MdTranslate />,
        id: FILE_TOOLS.VOCABULARY,
    },
];

const PdfToolsChild = () => {
    const [isPickingColor, setIsPickingColor] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { userKey } = useAuth();
    const { colorPanel } = useColorPanel();
    const { dynamicClass, isLandscape, isLeftSide, isOpen, isTopSide } = useDraggableSection();
    const { foldersActions } = useFoldersActions();
    const { foldersStructure } = useFoldersManager();
    const { downloadPdfFile } = usePdfFile();
    const { color, setColor } = usePdfTools();
    const { preparation, savedPreparation } = usePreparation();
    const { addPreparation } = usePreparations();
    const { t } = useTranslation();
    const { list: vocabularyTerms } = useVocabularyTable();
    const { currentWorkspace } = useWorkspaces();

    const rgbColor = useMemo(() => handleActionColor(color, colorPanel), [color, colorPanel]);
    const colorPickerBg = useMemo(() => getRgbColor(rgbColor), [color, colorPanel]);

    const togglePickingColor = () => setIsPickingColor(state => !state);
    const handlePickerColor = (value: RgbColor) => setColor({ kind: ColorKind.INLINE, value });
    const handlePropositionColor = (colorSwatch: ColorSwatch) => setColor({
        kind: ColorKind.PANEL,
        lastValue: colorSwatch.value,
        value: colorSwatch.id,
    });
    const createPreparation = async ({
        folders,
        foldersActions,
        rootFolderId,
        title,
        vocabularyTerms,
    }: SavePreparationParams) => {
        if (!userKey) {
            throw new Error("Create preparation impossible - No userKey");
        }

        setIsSaving(true);
        const workspaceId = currentWorkspace!.id;
        const prepRes = await PREPARATION.create({
            body: { title },
            workspaceId,
        });

        if (!prepRes.success) {
            throw new Error("An error occured while creating preparation");
        }

        await uploadPreparation({
            folders,
            foldersActions,
            preparationId: prepRes.data.id,
            rootFolderId: rootFolderId ?? "root",
            userKey,
            vocabularyTerms,
            workspaceId,
        });

        const now = new Date().toISOString();
        const savedPreparation: SavedPreparation = {
            createdAt: now,
            id: prepRes.data.id,
            folders,
            foldersActions,
            title: prepRes.data.title,
            updatedAt: now,
            vocabulary: vocabularyTerms,
        };

        addPreparation(savedPreparation);
        setIsSaving(false);
    };
    const onSave = () => createPreparation({
        folders: foldersStructure,
        foldersActions,
        old: savedPreparation,
        title: preparation.title,
        vocabularyTerms,
    });

    // Cleaning the state on closing panel tools
    useEffect(() => {
        if (!isOpen) {
            setIsPickingColor(false);
        }
    }, [isOpen]);

    return (
        <div className={`pdf-tools ${dynamicClass} ${isLeftSide ? "left" : "right"} ${isTopSide ? "top" : "bot"}`}>
            <div className="pdf-tools-buttons">
                {HISTORY_BUTTONS.map(item => (
                    <HistoryButton
                        key={item.id}
                        {...item}
                    />
                ))}
                {TOOLS_BUTTONS.map(item => (
                    <ToolButton
                        key={item.id}
                        {...item}
                    />
                ))}
                <button
                    onClick={downloadPdfFile}
                    title={t("actions.download")}
                >
                    <MdDownload />
                </button>
                <button
                    onClick={onSave}
                    title={t("actions.save")}
                >
                    {isSaving
                        ? (<Loader size="small" />)
                        : (<MdSave />)
                    }
                </button>
                <button
                    onClick={togglePickingColor}
                    title={t("files.editor.tools.color")}
                >
                    <div
                        className="color-picker-trigger"
                        style={{ backgroundColor: colorPickerBg }}
                    />
                </button>
            </div>
            <div className={`color-picker-container ${isPickingColor ? "expanded" : ""}`}>
                <ColorPicker
                    color={rgbColor}
                    displayPropositions
                    handlePickerColor={handlePickerColor}
                    handlePropositionColor={handlePropositionColor}
                    height={COLOR_PICKER_DIMENSION}
                    isLandscape={!isLandscape}
                    onSelection={() => setIsPickingColor(false)}
                    width={COLOR_PICKER_DIMENSION}
                />
            </div>
        </div>

    );
};

export const PdfTools = () => {
    const { isEditable, setIsEditable } = useFoldersManager();

    const onClick = () => setIsEditable(true);

    if (!isEditable) {
        return (
            <button
                className="pdf-edit"
                onClick={onClick}
            >
                <MdEdit />
            </button>
        );
    }

    return (
        <DraggableSection
            expansionEnabled
            rotateEnabled
        >
            <PdfToolsChild />
        </DraggableSection>
    );
};
