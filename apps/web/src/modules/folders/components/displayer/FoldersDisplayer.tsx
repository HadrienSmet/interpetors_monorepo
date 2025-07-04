import { DragEventHandler, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { getFileInStructure, useFoldersManager } from "../../contexts";
import { FolderStructure } from "../../types";

import { FoldersExplorer } from "../explorer";
import { FileDisplayer } from "../files";

import './foldersDisplayer.scss';

type FoldersDisplayerProps = {
    readonly foldersStructures: Array<FolderStructure>;
    readonly isDragged: boolean;
    readonly onDragEnter: DragEventHandler<HTMLDivElement>;
    readonly onDragLeave: DragEventHandler<HTMLDivElement>;
    readonly onDragOver: DragEventHandler<HTMLDivElement>;
    readonly onDrop: DragEventHandler<HTMLDivElement>;
};
export const FoldersDisplayer = ({
    foldersStructures,
    isDragged,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop
}: FoldersDisplayerProps) => {
    const { setSelectedFile } = useFoldersManager();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const path = searchParams.get("filepath");
        if (!path) return;

        for (const folder of foldersStructures) {
            const fileInStructure = getFileInStructure(folder, `/${path}`);

            if (fileInStructure) {
                setSelectedFile({ fileInStructure, path });
                break;
            }
        }

        searchParams.delete("filepath");
        setSearchParams(searchParams);
    }, [foldersStructures, searchParams]);

    return (
        <div className="folders-displayer">
            <FoldersExplorer />
            <div
                className={`folder-dropzone ${isDragged ? "dragged" : ""}`}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <FileDisplayer />
            </div>
        </div>
    );
};
