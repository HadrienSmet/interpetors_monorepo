import { PropsWithChildren, useState } from "react";

import { FoldersManagerContext, FoldersManagerContextType, FolderStructure } from "./FoldersManagerContext";

export const FoldersManagerProvider = (props: PropsWithChildren) => {
    const [foldersStructures, setFoldersStructures] = useState<Array<FolderStructure>>([]);

    const changeFileName = (file: File, newName: string) => {
        const updateStructure = (structure: FolderStructure): FolderStructure => {
            const result: FolderStructure = {};

            for (const [key, value] of Object.entries(structure)) {
                if (value instanceof File && value === file) {
                    const updated = new File(
                        [value],
                        newName,
                        { type: value.type, lastModified: value.lastModified }
                    );

                    result[newName] = updated;
                } else if (value instanceof File) {
                    result[key] = value;
                } else {
                    result[key] = updateStructure(value);
                }
            }

            return (result);
        };

        setFoldersStructures(state => state.map(updateStructure));
    };

    const onDrop = (folder: FolderStructure) => setFoldersStructures(state => [...state, folder]);

    const value: FoldersManagerContextType = {
        files: {
            changeDirectory: () => null,
            changeName: changeFileName,
            delete: () => null,
        },
        folders: {
            changeDirectory: () => null,
            changeName: () => null,
            create: () => null,
            delete: () => null,
            onDrop,
        },
        foldersStructures,
    }

    return (
        <FoldersManagerContext value={value}>
            {props.children}
        </FoldersManagerContext>
    )
};
