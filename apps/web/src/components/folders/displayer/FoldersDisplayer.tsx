import { DragEventHandler, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { FileInStructure, FolderStructure, getFileInStructure } from "@/contexts";

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
type SelectedFile = {
    readonly fileInStructure: FileInStructure | null;
    readonly path: string;
};
export const FoldersDisplayer = ({
    foldersStructures,
    isDragged,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop
}: FoldersDisplayerProps) => {
    const [selectedFile, setSelectedFile] = useState<SelectedFile>({ fileInStructure: null, path: "" });

    const [searchParams] = useSearchParams();

    const handleFileClick = (fileInStructure: FileInStructure, path: string) => setSelectedFile({ fileInStructure, path});

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
    }, [foldersStructures, searchParams]);

    return (
        <div className="folders-displayer">
            <FoldersExplorer
                foldersStructures={foldersStructures}
                handleFileClick={handleFileClick}
                selectedFile={selectedFile.fileInStructure}
            />
            <div
                className={`folder-dropzone ${isDragged ? "dragged" : ""}`}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
            >
                <FileDisplayer selectedFileInStructure={selectedFile} />
            </div>
        </div>
    );
};
