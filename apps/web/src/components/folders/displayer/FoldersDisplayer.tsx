import { DragEventHandler, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { FolderStructure, getFileInStructure } from "@/contexts";

import { FileDisplayer } from "../../files";

import { FoldersExplorer } from "../explorer";

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
    const [selectedFile, setSelectedFile] = useState<{file: File | null; path: string;}>({ file: null, path: "" });

    const [searchParams] = useSearchParams();

    const handleFileClick = (file: File, path: string) => setSelectedFile({ file, path});

    useEffect(() => {
        const path = searchParams.get("filepath");
        if (!path) return;

        for (const folder of foldersStructures) {
            const file = getFileInStructure(folder, `/${path}`);

            if (file) {
                setSelectedFile({ file, path });
                break;
            }
        }
    }, [foldersStructures, searchParams]);

    return (
        <div className="folders-displayer">
            <FoldersExplorer
                foldersStructures={foldersStructures}
                handleFileClick={handleFileClick}
                selectedFile={selectedFile.file}
            />
            <div
                className={`folder-dropzone ${isDragged ? "dragged" : ""}`}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <FileDisplayer selectedFile={selectedFile} />
            </div>
        </div>
    );
};
