import { PropsWithChildren } from "react";

import { Header } from "./header";
import { Footer } from "./footer";

import "./layout.scss";

export const UnAuthLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="app">
            <Header />
            <div className="app-content">
                {children}
            </div>
            <Footer />
        </div>
    );
};
