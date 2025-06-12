import { Loader } from "@/components";

import "./pdfLoader.scss";

export const PdfEditorLoader = () => (
    <div className="pdf-loader-container">
        <Loader size="fullScreen" />
    </div>
);
