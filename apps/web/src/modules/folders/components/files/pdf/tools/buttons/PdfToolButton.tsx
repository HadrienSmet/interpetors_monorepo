import React from "react";
import { useTranslation } from "react-i18next";

import { usePdfTools } from "../../../../../contexts";
import { PdfTool } from "../../../../../types";

export type ToolButtonItem = {
    readonly icon: React.JSX.Element;
    readonly id: PdfTool;
};
type ToolButtonProps = ToolButtonItem;
export const ToolButton = (props: ToolButtonProps) => {
    const { onToolSelection, tool } = usePdfTools();
    const { t } = useTranslation();

    return (
        <button
            className={props.id === tool ? "selected" : ""}
            onClick={() => onToolSelection(props.id === tool ? null : props.id)}
            title={t(`files.editor.tools.${props.id}`)}
        >
            {props.icon}
        </button>
    );
};
