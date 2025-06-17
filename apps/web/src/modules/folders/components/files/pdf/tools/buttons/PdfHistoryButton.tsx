import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { usePdfHistory, usePdfTools } from "../../../../../contexts";

export type HistoryButtonItem = {
    readonly icon: React.JSX.Element;
    readonly id: "backward" | "forward";
};
export const HistoryButton = (props: HistoryButtonItem) => {
    const { backward, forward, historyIndex, isUpToDate } = usePdfHistory();
    const { setTool } = usePdfTools();
    const { t } = useTranslation();

    const isBackward = useMemo(() => (props.id === "backward"), [props.id]);
    const disabled = isBackward
        ? historyIndex < 0
        : isUpToDate
    const onClick = disabled
        ? undefined
        : isBackward
            ? () => backward()
            : () => forward();

    return (
        <button
            onClick={() => {
                setTool(null);

                if (onClick) onClick();
            }}
            disabled={isBackward
                ? historyIndex < 0
                : isUpToDate
            }
            title={t(`files.editor.tools.${props.id}`)}
        >
            {props.icon}
        </button>
    );
};
