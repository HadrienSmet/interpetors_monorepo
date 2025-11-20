import { DragEventHandler, useEffect } from "react";
import { useSearchParams } from "react-router";

import { FileDisplayer } from "@/modules/files";
import { URL_PARAMETERS } from "@/utils";

import { getPdfFile, useFoldersManager } from "../../contexts";

import { FoldersExplorer } from "../explorer";

import "./foldersDisplayer.scss";

export enum FOLDERS_TYPES {
    EDITABLE = "editable",
    UNEDITABLE = "uneditable",
}
type FoldersExplorerDefaultProps = {
    readonly onDragEnter: DragEventHandler<HTMLDivElement>;
    readonly onDragLeave: DragEventHandler<HTMLDivElement>;
    readonly onDragOver: DragEventHandler<HTMLDivElement>;
    readonly onDrop: DragEventHandler<HTMLDivElement>;
};
type FoldersExplorerProps =
    | { readonly type: FOLDERS_TYPES.UNEDITABLE; }
    | (
        & {
            readonly isDragged: boolean;
            readonly type: FOLDERS_TYPES.EDITABLE;
        }
        & FoldersExplorerDefaultProps
    );
export const FoldersDisplayer = (props: FoldersExplorerProps) => {
    const {
        foldersStructure,
        setSelectedFilePath,
    } = useFoldersManager();
    const [searchParams, setSearchParams] = useSearchParams();

    const dropZoneAttributes: FoldersExplorerDefaultProps | undefined = props.type === FOLDERS_TYPES.EDITABLE
        ? props
        : undefined;

    useEffect(() => {
        const path = searchParams.get(URL_PARAMETERS.filepath);
        if (!path) return;

        for (const folder of foldersStructure) {
            const fileInStructure = getPdfFile(folder, `/${path}`);

            if (fileInStructure) {
                setSelectedFilePath(path);
                break;
            }
        }

        setSearchParams(state => {
            const next = new URLSearchParams(state);

            next.delete(URL_PARAMETERS.filepath);

            return (next);
        });
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
