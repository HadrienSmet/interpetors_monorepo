import { LocaleSelect, ThemeToggler } from "@/components";

import "./header.scss";

export const Header = () => {
    return (
        <header>
            <p>Leonor App</p>
            <div>
                <ThemeToggler containerWidth={60} />
                <LocaleSelect />
            </div>
        </header>
    );
};
