import { LocaleSelect, ThemeToggler } from "@/components";
import { APP_NAME } from "@/constants";

import "./header.scss";

export const Header = () => {
    return (
        <header>
            <p>{APP_NAME}</p>
            <div>
                <ThemeToggler containerWidth={60} />
                <LocaleSelect />
            </div>
        </header>
    );
};
