import { DragEventHandler, useEffect } from "react";
import { useSearchParams } from "react-router";

import type { ClientFolderStructure } from "@repo/types";

import { FileDisplayer } from "@/modules/files";

import { getClientPdfFile, useFoldersManager } from "../../contexts";

import { FoldersExplorer } from "../explorer";

import './foldersDisplayer.scss';

type FoldersDisplayerProps = {
    readonly foldersStructures: Array<ClientFolderStructure>;
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
            const fileInStructure = getClientPdfFile(folder, `/${path}`);

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
