import { useState } from "react";

import { FolderStructure } from "@/contexts";

import { FileDisplayer } from "../../files";

import { FoldersExplorer } from "../explorer";

import './foldersDisplayer.scss';

type FoldersDisplayerProps = {
    readonly foldersStructures: Array<FolderStructure>;
};
export const FoldersDisplayer = ({ foldersStructures }: FoldersDisplayerProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileClick = (file: File) => setSelectedFile(file);

    return (
        <div className="folders-displayer">
            <FoldersExplorer
                foldersStructures={foldersStructures}
                handleFileClick={handleFileClick}
                selectedFile={selectedFile}
            />
            <FileDisplayer selectedFile={selectedFile} />
        </div>
    );
};
