import { Error, NavigationState } from "@/components";
import { Preparations, Prepare, Vocabulary } from "@/views";

type ContentProps = {
    readonly navigationState: NavigationState;
};
export const Main = ({ navigationState }: ContentProps) => {
    if (navigationState === "new") {
        return (<Prepare />);
    };
    if (navigationState === "old") {
        return (<Preparations />);
    };
    if (navigationState === "voc") {
        return (<Vocabulary />);
    };

    return (<Error message="Navigation error" />);
};
