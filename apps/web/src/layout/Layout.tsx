import { Outlet } from "react-router";

import { ContextMenu } from "@/components";
import { Navigation } from "@/modules/router";

import { Header } from "./header";
import "./layout.scss";

export const Layout = () => {
    return (
        <div className="app">
            <Header />
            <div className="app-container">
                <Navigation />
                <div className="app-content">
                    <Outlet />
                </div>
            </div>
            <ContextMenu />
        </div>
    );
};
