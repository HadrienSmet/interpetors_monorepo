import { ClientPdfFile, ServerPdfFile } from "../files";

export type ClientFolderStructure = {
    [key: string]: ClientPdfFile | ClientFolderStructure;
};
export type ServerFolderStructure = {
    [key: string]: ServerPdfFile | ServerFolderStructure;
};
