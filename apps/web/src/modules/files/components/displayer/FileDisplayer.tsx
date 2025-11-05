import { useTranslation } from "react-i18next";

import { PdfFile } from "@repo/types";

import { FileData } from "@/modules/folders";
import { PdfDisplayer } from "@/modules/pdf";

import { SUPPORTED_TYPES } from "../icon";

import "./fileDisplayer.scss";

type FileToRenderProps = {
    readonly fileInStructure: PdfFile;
    readonly path: string;
};
const FileToRender = (props: FileToRenderProps) => {
    const { t } = useTranslation();
    const { fileInStructure } = props;
    const { file } = fileInStructure;

    if (file.type.startsWith(SUPPORTED_TYPES.PDF)) {
        return (<PdfDisplayer />);
    }
    if (file.type.startsWith(SUPPORTED_TYPES.WORD)) {
        return (<p>Word will be supported soon</p>);
    }
    if (file.type.startsWith(SUPPORTED_TYPES.TEXT)) {
        const content = file.text();

        return (<p>{content}</p>);
    }
    // TODO: Have to improve the way to display the not supported files
    return (
        <pre className="unsupported-file">
            ⚠️ {t("inputs.folders.unsupported")}{Object.values(SUPPORTED_TYPES).join(", ")}
        </pre>
    );
};

const FILE_DISPLAYER_MIN_WIDTH = 620 as const;
type FileDisplayerProps = {
    readonly selectedFile: FileData;
};
export const FileDisplayer = ({ selectedFile }: FileDisplayerProps) => {
    const { t } = useTranslation();

    return (
        <div className="file-displayer" style={{ minWidth: FILE_DISPLAYER_MIN_WIDTH }}>
            {selectedFile.fileInStructure != null
                // @ts-expect-error
                ? (<FileToRender {...selectedFile} />)
                : (
                    <div className="unselected-file">
                        <p>{t("inputs.folders.unselected")}</p>
                    </div>
                )
            }
        </div>
    );
};
