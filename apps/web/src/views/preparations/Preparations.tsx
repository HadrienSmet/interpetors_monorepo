import { Loader } from "@/components";
import {
    PreparationsEmpty,
    PreparationsFilled,
    PreparationsProvider,
    usePreparations
} from "@/modules/preparations";

import "./preparations.scss";

const PreparationsChild = () => {
    const { isLoading, preparations } = usePreparations();

    if (isLoading) return (<Loader />);

    return (
        <main
            style={{ overflow: "hidden" }}
            className="preparations-view"
        >
            {(!preparations || preparations.length === 0)
                ? (<PreparationsEmpty />)
                : (<PreparationsFilled preparations={preparations} />)
            }
        </main>
    );
};
export const Preparations = () => (
    <PreparationsProvider>
        <PreparationsChild />
    </PreparationsProvider>
);
