import { ReactNode } from "react";
import { TFunction } from "i18next";

import { TOOLS_ON_SELECTION } from "../../../types";

export type ActionItem = {
    readonly icon: ReactNode,
    readonly onClick: () => void;
};
type ContextMenuItemProps = {
    readonly actionItem: ActionItem;
    readonly t: TFunction<"translation", undefined>;
    readonly tool: TOOLS_ON_SELECTION;
};
export const EditorContextMenuItem = ({ actionItem, tool, t }: ContextMenuItemProps) => (
    <>
        {actionItem.icon}
        <p>{t(`files.editor.context-menu.${tool}`)}</p>
    </>
);
