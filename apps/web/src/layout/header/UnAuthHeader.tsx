import { LocaleSelect, ThemeToggler } from "@/components";
import { APP_NAME } from "@/constants";

import "./header.scss";

export const UnauthHeader = () => (
    <header className="unauth-header">
        <p>{APP_NAME}</p>
        <div>
            <ThemeToggler containerWidth={60} />
            <LocaleSelect />
        </div>
    </header>
);
