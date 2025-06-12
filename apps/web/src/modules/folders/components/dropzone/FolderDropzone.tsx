import { DragEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { FileInStructure, FolderStructure, useFoldersManager } from "../../contexts";

import { FoldersDisplayer } from "../displayer";

import "./folderDropzone.scss";

const getNewFileInStructure = (file: File): FileInStructure => ({
    canvasElements: [],
    file,
    name: file.name,
    pdfElements: [],
    references: [],
});
const preventDefault = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
const setNestedFile = (
    root: FolderStructure,
    path: string[],
    file: FileInStructure
): void => {
    const [head, ...rest] = path;

    if (rest.length === 0) {
        root[head] = file;
        return;
    }

    if (!(head in root)) {
        root[head] = {};
    }

    setNestedFile(root[head] as FolderStructure, rest, file);
};
const readDirectory = async (
    directoryEntry: FileSystemDirectoryEntry,
    root: FolderStructure,
    pathPrefix: string
) => {
    const reader = directoryEntry.createReader();
    const entries = await new Promise<FileSystemEntry[]>((resolve) =>
        reader.readEntries(resolve)
    );

    for (const entry of entries) {
        const fullPath = `${pathPrefix}/${entry.name}`;

        if (entry.isDirectory)
            await readDirectory(
                entry as FileSystemDirectoryEntry,
                root,
                fullPath
            );
        else
            await new Promise<void>((resolve) => {
                (entry as FileSystemFileEntry).file((file) => {
                    const pathArray = fullPath.split("/");

                    setNestedFile(
                        root,
                        pathArray,
                        getNewFileInStructure(file)
                    );
                    resolve();
                });
            });
    }
};

export const FolderDropzone = () => {
    const [isDragged, setIsDragged] = useState(false);

    const foldersManager = useFoldersManager();
    const { t } = useTranslation();

    const handleDragEnter = () => setIsDragged(true);
    const handleDragLeave = () => setIsDragged(false);
    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        preventDefault(event);
        const items = event.dataTransfer.items;
        const newFileTree: FolderStructure = {};

        for (const item of items) {
            if (item.kind === "file") {
                const entry = item.webkitGetAsEntry();
                if (entry?.isDirectory)
                    await readDirectory(entry as FileSystemDirectoryEntry, newFileTree, entry.name);
                else if (entry?.isFile) {
                    const file = item.getAsFile();

                    if (file) {
                        setNestedFile(newFileTree, [file.name], getNewFileInStructure(file));
                    }
                }
            }
        }

        foldersManager.folders.onDrop(newFileTree);
        handleDragLeave();
    };

    return (
        <div style={{ flex: 1, width: "100%" }}>
            {foldersManager.foldersStructures.length > 0
                ?   (
                    <FoldersDisplayer
                        foldersStructures={foldersManager.foldersStructures}
                        isDragged={isDragged}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={preventDefault}
                        onDrop={handleDrop}
                    />
                )
                : (
                    <div
                        className={`folder-dropzone empty ${isDragged ? "dragged" : ""}`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={preventDefault}
                        onDrop={handleDrop}
                    >
                        <p>{t("inputs.folders.empty")}</p>
                    </div>
                )
            }
        </div>
    );
};
