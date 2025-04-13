"use client";

import { useState } from "react";

import { NAVIGATION, Navigation, NavigationState } from "./components";
import { Footer, Header, Main } from "./layouts";
import { WorkSpaceWrapper } from "./wrappers";

import "./home.scss";

const HomePageChild = () => {
    const [homeNavigation, setHomeNavigation] = useState<NavigationState>(NAVIGATION.NEW.id);

    return (
        <>
			<Header />
            <div className="home-container">
                <Navigation
                    homeNavigation={homeNavigation}
                    setHomeNavigation={setHomeNavigation}
                />
                <div className="home-content">
                    <Main navigationState={homeNavigation} />
                    <Footer />
                </div>
            </div>
		</>
    );
};

export const HomePage = () => (
    <WorkSpaceWrapper>
        <HomePageChild />
    </WorkSpaceWrapper>
);
