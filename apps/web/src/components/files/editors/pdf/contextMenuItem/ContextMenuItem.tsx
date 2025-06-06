import { TFunction } from "i18next";

import { TOOLS_ON_SELECTION } from "../pdfTools";

export type ActionItem = {
    readonly icon: React.JSX.Element,
    readonly onClick: () => void;
};
type ContextMenuItemProps = {
    readonly actionItem: ActionItem;
    readonly t: TFunction<"translation", undefined>;
    readonly tool: TOOLS_ON_SELECTION;
};
export const ContextMenuItem = ({ actionItem, tool, t }: ContextMenuItemProps) => (
    <>
        {actionItem.icon}
        <p>{t(`files.editor.context-menu.${tool}`)}</p>
    </>
);
