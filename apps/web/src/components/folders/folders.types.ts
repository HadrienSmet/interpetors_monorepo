export type FolderStructure = {
    [key: string]: File | FolderStructure;
};
