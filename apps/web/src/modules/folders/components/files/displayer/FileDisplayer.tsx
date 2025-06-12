import { useTranslation } from "react-i18next";

import { FileInStructure } from "../../../contexts";

import { PdfEditor } from "../pdf";
import { SUPPORTED_TYPES } from "../icon";

import "./fileDisplayer.scss";

type FileToRenderProps = {
    readonly fileInStructure: FileInStructure;
    readonly path: string;
};
const FileToRender = (props: FileToRenderProps) => {
    const { t } = useTranslation();
    const { fileInStructure } = props;
    const { file } = fileInStructure;

    if (file.type.startsWith(SUPPORTED_TYPES.PDF)) {
        return (
            <PdfEditor
                fileInStructure={props.fileInStructure}
                filePath={props.path}
            />
        );
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
    readonly selectedFileInStructure: {
        readonly fileInStructure: FileInStructure | null;
        readonly path: string;
    };
};
export const FileDisplayer = (props: FileDisplayerProps) => {
    const { t } = useTranslation();

    return (
        <div className="file-displayer" style={{ minWidth: FILE_DISPLAYER_MIN_WIDTH }}>
            {props.selectedFileInStructure.fileInStructure != null
                // @ts-expect-error
                ? (<FileToRender {...props.selectedFileInStructure} />)
                : (
                    <div className="unselected-file">
                        <p>{t("inputs.folders.unselected")}</p>
                    </div>
                )
            }
        </div>
    );
};
