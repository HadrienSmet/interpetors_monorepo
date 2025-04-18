import { DragEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { FoldersDisplayer } from "../displayer";
import { FolderStructure } from "../folders.types";

import "./folderDropzone.scss";

const preventDefault = (e: DragEvent<HTMLDivElement>) => e.preventDefault();
const setNestedFile = (
    root: FolderStructure,
    path: string[],
    file: File
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

        if (entry.isDirectory) {
            await readDirectory(
                entry as FileSystemDirectoryEntry,
                root,
                fullPath
            );
        } else {
            await new Promise<void>((resolve) => {
                (entry as FileSystemFileEntry).file((file) => {
                    const pathArray = fullPath.split("/");

                    setNestedFile(root, pathArray, file);
                    resolve();
                });
            });
        }
    }
};
export const FolderDropzone = () => {
    const [isDragged, setIsDragged] = useState(false);
    const [foldersStructures, setFoldersStructures] = useState<Array<FolderStructure>>([]);

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
                if (entry?.isDirectory) {
                    await readDirectory(entry as FileSystemDirectoryEntry, newFileTree, entry.name);
                } else if (entry?.isFile) {
                    const file = item.getAsFile();
                    if (file) {
                        setNestedFile(newFileTree, [file.name], file);
                    }
                }
            }
        }

        setFoldersStructures(state => ([...state, newFileTree]));
        handleDragLeave();
    };

    return (
        <div style={{ flex: 1, width: "100%" }}>
            {foldersStructures.length > 0
                ?   (
                    <div
                        className={`folder-dropzone ${isDragged ? "dragged" : ""}`}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={preventDefault}
                        onDrop={handleDrop}
                    >
                        <FoldersDisplayer foldersStructures={foldersStructures} />
                    </div>
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
