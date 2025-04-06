"use client"

import { useEffect, useState } from "react";

import "./folderDropzone.scss";
import { useTranslation } from "@/contexts";

export const FolderDropzone = () => {
    const [files, setFiles] = useState<File[]>([]);
    const { t } = useTranslation();

    const readDirectory = async (directoryEntry: FileSystemEntry, fileList: File[]) => {
        const reader = (directoryEntry as FileSystemDirectoryEntry).createReader();
        const entries = await new Promise<FileSystemEntry[]>((resolve) => reader.readEntries(resolve));

        for (const entry of entries) {
            if (entry.isDirectory) {
                await readDirectory(entry, fileList);
            } else {
                await new Promise<void>((resolve) => {
                    (entry as FileSystemFileEntry).file((file) => {
                        fileList.push(file);
                        resolve();
                    });
                });
            }
        }
    };
    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        const items = event.dataTransfer.items;
        const newFiles: File[] = [];

        for (const item of items) {
            if (item.kind === "file") {
                const entry = item.webkitGetAsEntry();
                if (entry?.isDirectory) {
                    await readDirectory(entry, newFiles);
                } else if (entry?.isFile) {
                    const file = item.getAsFile();
                    if (file) newFiles.push(file);
                }
            }
        }

        setFiles(newFiles);
    };

    useEffect(() => {
        console.log({ files })
    }, [files]);

    return (
        <div style={{ width: "100%" }}>
            <div
                className="folder-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <p>{t("inputs.folders")}</p>
            </div>
            {files.length > 0 && (
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
