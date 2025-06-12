import { AiOutlineFile, AiOutlineFilePdf, AiOutlineFileWord } from "react-icons/ai";

export enum SUPPORTED_TYPES {
    PDF = "application/pdf",
    TEXT = "text/",
    WORD = "application/msword",
}
const FILE_ICON_SIZE = 16 as const;
export const FileIcon = ({ node }: { node: File }) => {
    switch (node.type) {
        case SUPPORTED_TYPES.PDF:
            return (<AiOutlineFilePdf size={FILE_ICON_SIZE} />);
        case SUPPORTED_TYPES.WORD:
            return (<AiOutlineFileWord size={FILE_ICON_SIZE} />);
        default:
            return (<AiOutlineFile size={FILE_ICON_SIZE} />);
    }
};
