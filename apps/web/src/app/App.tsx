import { useState } from "react";

import { ContextMenu, NAVIGATION, Navigation, NavigationState } from "@/components";
import { ContextMenuProvider, ThemeProvider } from "@/contexts";
import { Footer, Header, Main } from "@/layout";
import { WorkSpaceWrapper } from "@/wrappers";

import "./global.classes.scss";
import "./global.root.scss";
import "./global.tags.scss";

import "./app.scss";

const DEFAULT_TABS: NavigationState = [NAVIGATION.NEW.id, NAVIGATION.NEW.nestedNav.FILES.id];

const AppChild = () => {
    const [navigation, setNavigation] = useState<NavigationState>(DEFAULT_TABS);

    const onError404 = () => setNavigation(DEFAULT_TABS);

    return (
        <div className="app">
            <Header />
            <div className="app-container">
                <Navigation
                    navigation={navigation}
                    setNavigation={setNavigation}
                />
                <div className="app-content">
                    <Main
                        navigationState={navigation}
                        onError404={onError404}
                    />
                    <Footer />
                </div>
            </div>
            <ContextMenu />
        </div>
    );
};

export const App = () => {
    return (
        <ThemeProvider>
            <ContextMenuProvider>
                <WorkSpaceWrapper>
                    <AppChild />
                </WorkSpaceWrapper>
            </ContextMenuProvider>
        </ThemeProvider>
    );
};
