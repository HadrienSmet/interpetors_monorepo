import { Outlet } from "react-router-dom";

import { ContextMenu, Navigation } from "@/components";

import { Header } from "./header";
import { Footer } from "./footer";
import "./layout.scss";

export const Layout = () => {
    return (
        <div className="app">
            <Header />
            <div className="app-container">
                <Navigation />
                <div className="app-content">
                    <Outlet />
                    <Footer />
                </div>
            </div>
            <ContextMenu />
        </div>
    );
};
