import { Dispatch, useEffect } from "react";
import { useSearchParams } from "react-router";

import { FolderStructure } from "@repo/types";

import { FileDisplayer } from "@/modules/files/components/displayer/FileDisplayer";

import { getPdfFile } from "../../contexts";
import { FileData } from "../../types";

import { FoldersExplorer } from "../explorer";

import "./foldersDisplayer.scss";
import { NewFileDisplayer } from "@/modules/files";
import { NewFoldersExplorer } from "../explorer/NewFoldersExplorer";

type FoldersExplorerProps = {
    readonly foldersStructure: Array<FolderStructure>;
    readonly selectedFile: FileData;
    readonly setSelectedFile: Dispatch<FileData>;
};
export const FoldersDisplayer = ({
    foldersStructure,
    selectedFile,
    setSelectedFile,
}: FoldersExplorerProps) => {
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
            <NewFoldersExplorer />
            <div className="folder-dropzone">
                <NewFileDisplayer />
            </div>
        </div>
    );
};
