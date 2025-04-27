import { useTranslation } from "react-i18next";

import { PdfEditor } from "../editors";
import { SUPPORTED_TYPES } from "../icon";

import "./fileDisplayer.scss";

type FileToRenderProps = {
    readonly file: File;
};
const FileToRender = ({ file }: FileToRenderProps) => {
    const { t } = useTranslation();

    if (file.type.startsWith(SUPPORTED_TYPES.PDF)) {
        return (<PdfEditor file={file} />);
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

export const FILE_DISPLAYER_MIN_WIDTH = 620 as const;
type FileDisplayerProps = {
    readonly selectedFile: File | null;
};
export const FileDisplayer = (props: FileDisplayerProps) => {
    const { t } = useTranslation();

    return (
        <div className="file-displayer" style={{ minWidth: FILE_DISPLAYER_MIN_WIDTH }}>
            {props.selectedFile
                ? (<FileToRender file={props.selectedFile} />)
                : (
                    <div className="unselected-file">
                        <p>{t("inputs.folders.unselected")}</p>
                    </div>
                )
            }
        </div>
    );
};
