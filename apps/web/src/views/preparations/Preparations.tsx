import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";

import { Loader } from "@/components";
import { useAuth } from "@/modules/auth";
import {
    PreparationLayout,
    PreparationsEmpty,
    PreparationsFilled,
    usePreparations,
} from "@/modules/preparations";
import { NavigationState, useLocaleNavigate } from "@/modules/router";

import "./preparations.scss";

const SCREEN_NAVIGATION_LEVEL = 1 as const;

export const Preparations = () => {
    const { userKey } = useAuth();
    const navigate = useLocaleNavigate();
    const location = useLocation();
    const { isLoading, preparationsOverview, setShouldFetch } = usePreparations();

    const currentView = useMemo(() => (
        (location.pathname
            .split("/")
            .filter(Boolean)
            .slice(1)
            .filter(Boolean) as NavigationState
        )[SCREEN_NAVIGATION_LEVEL]
    ), [location.pathname]);

    useEffect(() => {
        if (!userKey) return;

        setShouldFetch(true);
    }, [userKey]);

    if (isLoading || !userKey) return (<Loader />);

    if (currentView === "new") {
        return (
            <PreparationLayout
                backToList={() => navigate("/preparations")}
                editable
				isNew
            />
        );
    }

    return (
        <main
            style={{ overflow: "hidden" }}
            className="preparations-view"
        >
            {(!preparationsOverview || Object.keys(preparationsOverview).length === 0)
                ? (<PreparationsEmpty />)
                : (<PreparationsFilled />)
            }
        </main>
    );
};
