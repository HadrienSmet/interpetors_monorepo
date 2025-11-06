import { DragEventHandler, useEffect } from "react";
import { useSearchParams } from "react-router";

import { FileDisplayer } from "@/modules/files";

import { getPdfFile, useFoldersManager } from "../../contexts";

import { FoldersExplorer } from "../explorer";

import "./foldersDisplayer.scss";

const URL_PARAMS = "filepath";

export enum FOLDERS_TYPES {
    EDITABLE = "editable",
    UNEDITABLE = "uneditable",
}
type DropZoneEvents = {
    readonly onDragEnter: DragEventHandler<HTMLDivElement>;
    readonly onDragLeave: DragEventHandler<HTMLDivElement>;
    readonly onDragOver: DragEventHandler<HTMLDivElement>;
    readonly onDrop: DragEventHandler<HTMLDivElement>;
};
type FoldersExplorerProps =
    | { readonly type: FOLDERS_TYPES.UNEDITABLE; }
    | (
        & { readonly isDragged: boolean; readonly type: FOLDERS_TYPES.EDITABLE; }
        & DropZoneEvents
    );
export const FoldersDisplayer = (props: FoldersExplorerProps) => {
    const {
        foldersStructure,
        setSelectedFile,
    } = useFoldersManager();
    const [searchParams, setSearchParams] = useSearchParams();

    const dropZoneAttributes: DropZoneEvents | undefined = props.type === FOLDERS_TYPES.EDITABLE
        ? props
        : undefined;

    useEffect(() => {
        const path = searchParams.get(URL_PARAMS);
        if (!path) return;

        for (const folder of foldersStructure) {
            const fileInStructure = getPdfFile(folder, `/${path}`);

            if (fileInStructure) {
                setSelectedFile({ fileInStructure, path });
                break;
            }
        }

        searchParams.delete(URL_PARAMS);
        setSearchParams(searchParams);
    }, [foldersStructure, searchParams]);

    return (
        <div className="folders-displayer">
            <FoldersExplorer />
            <div
                className={`folder-dropzone ${(props.type === FOLDERS_TYPES.EDITABLE && props.isDragged) ? "dragged" : ""}`}
                {...dropZoneAttributes}
            >
                <FileDisplayer />
            </div>
        </div>
    );
};
