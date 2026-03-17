import { DragEvent, PropsWithChildren, useState } from "react";

import type { FolderStructure, PdfFile } from "@repo/types";

import { getDefaultPdfFile, PDF_TYPE } from "@/modules/pdf";

import { isPdfMetadata, useFoldersManager } from "../../contexts";

import { FilesLanguagesTreeModal } from "../filesLanguagesTree";
import { LanguageConfirmation } from "../languageConfirmation";

import "./folderDropzone.scss";

const preventDefault = (e: DragEvent<HTMLDivElement>) => e.preventDefault();

const setNestedFile = (
    root: FolderStructure,
    path: string[],
    file: PdfFile
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
    const entries = await new Promise<Array<FileSystemEntry>>((resolve) => reader.readEntries(resolve));

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
                    if (file.type === PDF_TYPE.type) {
                        setNestedFile(
                            root,
                            pathArray,
                            getDefaultPdfFile(file)
                        );
                    }
                    resolve();
                });
            });
        }
    }
};

const newDoesPathExist = (structure: FolderStructure, path: Array<string>): boolean => {
    if (path.length === 0) return (false);

    const [head, ...rest] = path;
    const node = structure[head];

    if (!node) return (false);
    if (rest.length === 0) return (true);
    if (isPdfMetadata(node)) return (false);

    return (newDoesPathExist(node as FolderStructure, rest));
};

export const FolderDropzone = ({ children }: PropsWithChildren) => {
    const [droppedFolderIndex, setDroppedFolderIndex] = useState<number | undefined>(undefined);
    const [isDragged, setIsDragged] = useState(false);

    const { folders, foldersStructure } = useFoldersManager();

    const doesFolderAlreadyExist = (path: Array<string>): boolean => (
        foldersStructure.some((structure) => newDoesPathExist(structure, path))
	);

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
                    if (!doesFolderAlreadyExist([entry.name])) {
                        await readDirectory(entry as FileSystemDirectoryEntry, newFileTree, entry.name);
                    }
                } else if (entry?.isFile) {
                    const file = item.getAsFile();

                    if (file && file.type === PDF_TYPE.type) {
                        setNestedFile(newFileTree, [file.name], getDefaultPdfFile(file));
                    }
                }
            }
        }

        const nextIndex = foldersStructure.length;

        folders.onDrop(newFileTree);
        setDroppedFolderIndex(nextIndex);
        handleDragLeave();
    };

    return (
        <div
            className={`folder-dropzone ${isDragged ? "dragged" : ""}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={preventDefault}
            onDrop={handleDrop}
        >
            {children}
            <FilesLanguagesTreeModal folderIndex={droppedFolderIndex} />
			<LanguageConfirmation />
        </div>
    );
};