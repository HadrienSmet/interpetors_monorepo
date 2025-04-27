import { NavigationState } from "@/components";
import { NotFound, Preparations, Prepare, Vocabulary } from "@/views";

type ContentProps = {
    readonly navigationState: NavigationState;
    readonly onError404: () => void;
};
export const Main = ({ navigationState, onError404 }: ContentProps) => {
    if (navigationState === "new") {
        return (<Prepare />);
    };
    if (navigationState === "old") {
        return (<Preparations />);
    };
    if (navigationState === "voc") {
        return (<Vocabulary />);
    };

    return (<NotFound onError404={onError404} />);
};
