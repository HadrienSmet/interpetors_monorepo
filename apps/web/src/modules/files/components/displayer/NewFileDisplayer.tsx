import { useTranslation } from "react-i18next";

import { Loader } from "@/components";
import { useFoldersManager } from "@/modules/folders";
import { PdfEditor } from "@/modules/pdf";

import { SUPPORTED_TYPES } from "../icon";

import "./fileDisplayer.scss";


const FileToRender = () => {
    const { t } = useTranslation();

    const { selectedFile } = useFoldersManager();

    if (!selectedFile.fileInStructure) {
        return (<Loader />)
    }

    const { file } = selectedFile.fileInStructure;

    if (file.type.startsWith(SUPPORTED_TYPES.PDF)) {
        return (<PdfEditor />);
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
export const NewFileDisplayer = () => {
    const { selectedFile } = useFoldersManager();
    const { t } = useTranslation();

    return (
        <div className="file-displayer" style={{ minWidth: FILE_DISPLAYER_MIN_WIDTH }}>
            {selectedFile.fileInStructure != null
                ? (<FileToRender />)
                : (
                    <div className="unselected-file">
                        <p>{t("inputs.folders.unselected")}</p>
                    </div>
                )
            }
        </div>
    );
};
