import { useState } from "react";

import { NAVIGATION, Navigation, NavigationState } from "@/components";
import { ThemeProvider } from "@/contexts";
import { Footer, Header, Main } from "@/layout";
import { WorkSpaceWrapper } from "@/wrappers";

import "./global.classes.scss";
import "./global.root.scss";
import "./global.tags.scss";

import "./app.scss";

const AppChild = () => {
    const [navigation, setNavigation] = useState<NavigationState>(NAVIGATION.NEW.id);

    return (
        <div className="app">
            <Header />
            <div className="app-container">
                <Navigation
                    navigation={navigation}
                    setNavigation={setNavigation}
                />
                <div className="app-content">
                    <Main navigationState={navigation} />
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export const App = () => {
    return (
        <ThemeProvider>
            <WorkSpaceWrapper>
                <AppChild />
            </WorkSpaceWrapper>
        </ThemeProvider>
    );
};
