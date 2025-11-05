import { DragEventHandler, useEffect } from "react";
import { useSearchParams } from "react-router";

import { NewFileDisplayer } from "@/modules/files";

import { getPdfFile, useFoldersManager } from "../../contexts";

import { NewFoldersExplorer } from "../explorer/NewFoldersExplorer";

import "./foldersDisplayer.scss";

type DropZoneEvents = {
    readonly onDragEnter: DragEventHandler<HTMLDivElement>;
    readonly onDragLeave: DragEventHandler<HTMLDivElement>;
    readonly onDragOver: DragEventHandler<HTMLDivElement>;
    readonly onDrop: DragEventHandler<HTMLDivElement>;
};
export enum FOLDERS_TYPES {
    EDITABLE = "editable",
    UNEDITABLE = "uneditable",
};
type EditableFoldersExplorerProps =
    | { readonly type: FOLDERS_TYPES.UNEDITABLE }
    | (
        & { readonly isDragged: boolean; readonly type: FOLDERS_TYPES.EDITABLE; }
        & DropZoneEvents
    );
export const NewFoldersDisplayer = (props: EditableFoldersExplorerProps) => {
    const {
        foldersStructure,
        setSelectedFile
    } = useFoldersManager();
    const [searchParams, setSearchParams] = useSearchParams();

    const dropZoneAttributes: DropZoneEvents | undefined = props.type === FOLDERS_TYPES.EDITABLE
        ? props
        : undefined;

    useEffect(() => {
        const path = searchParams.get("filepath");
        if (!path) return;

        for (const folder of foldersStructure) {
            const fileInStructure = getPdfFile(folder, `/${path}`);

            if (fileInStructure) {
                setSelectedFile({ fileInStructure, path });
                break;
            }
        }

        searchParams.delete("filepath");
        setSearchParams(searchParams);
    }, [foldersStructure, searchParams]);

    return (
        <div className="folders-displayer">
            <NewFoldersExplorer />
            <div
                className={`folder-dropzone ${(props.type === FOLDERS_TYPES.EDITABLE && props.isDragged) ? "dragged" : ""}`}
                {...dropZoneAttributes}
            >
                <NewFileDisplayer />
            </div>
        </div>
    );
};
