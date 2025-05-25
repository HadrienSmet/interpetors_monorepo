import { NavigationState } from "@/components";
import { Dictionary, NotFound, Preparations, Prepare } from "@/views";

/** App navigation */
const APP_NAVIGATION_LEVEL = 0 as const;

type ContentProps = {
    readonly navigationState: NavigationState;
    readonly onError404: () => void;
};
export const Main = ({ navigationState, onError404 }: ContentProps) => {
    if (navigationState[APP_NAVIGATION_LEVEL] === "new") {
        return (<Prepare navigationState={navigationState} />);
    };
    if (navigationState[APP_NAVIGATION_LEVEL] === "old") {
        return (<Preparations />);
    };
    if (navigationState[APP_NAVIGATION_LEVEL] === "dic") {
        return (<Dictionary />);
    };

    return (<NotFound onError404={onError404} />);
};
