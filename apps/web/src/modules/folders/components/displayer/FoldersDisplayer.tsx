import { DragEventHandler, useEffect } from "react";
import { useSearchParams } from "react-router";

import { FileDisplayer } from "@/modules/files";

import { getPdfFile, useFoldersManager } from "../../contexts";

import { FoldersExplorer } from "../explorer";

import './foldersDisplayer.scss';

type FoldersDisplayerProps = {
    readonly isDragged: boolean;
    readonly onDragEnter: DragEventHandler<HTMLDivElement>;
    readonly onDragLeave: DragEventHandler<HTMLDivElement>;
    readonly onDragOver: DragEventHandler<HTMLDivElement>;
    readonly onDrop: DragEventHandler<HTMLDivElement>;
};
export const FoldersDisplayer = ({
    isDragged,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop
}: FoldersDisplayerProps) => {
    const { foldersStructure, setSelectedFile } = useFoldersManager();
    const [searchParams, setSearchParams] = useSearchParams();

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
