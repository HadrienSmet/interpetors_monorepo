import { PropsWithChildren } from "react";

import { UnauthHeader } from "./header";
import { Footer } from "./footer";

import "./layout.scss";

export const UnAuthLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="app">
            <UnauthHeader />
            <div className="app-content">
                {children}
            </div>
            <Footer />
        </div>
    );
};
