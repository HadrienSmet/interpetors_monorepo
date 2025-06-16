import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { usePdfHistory } from "../../../../../contexts";

export type HistoryButtonItem = {
    readonly icon: React.JSX.Element;
    readonly id: "backward" | "forward";
};
export const HistoryButton = (props: HistoryButtonItem) => {
    const { backward, forward, historyIndex, isUpToDate } = usePdfHistory();
    const { t } = useTranslation();

    const isBackward = useMemo(() => (props.id === "backward"), [props.id]);

    return (
        <button
            onClick={isBackward ? backward : forward}
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
