import { NavigationButton } from "./button";
import { NAVIGATION } from "./navigation.types";
import "./navigation.scss";

type NavigationProps = { readonly displayNested?: boolean; };
export const Navigation = ({ displayNested = false }: NavigationProps) => (
    <div className="navigation navigation-padding">
        <div className="navigation-buttons">
            {Object.keys(NAVIGATION).map(key => {
                const current = NAVIGATION[key as keyof typeof NAVIGATION];

                return (
                    <NavigationButton
                        {...current}
                        displayNested={displayNested}
                        key={current.id}
                    />
                );
            })}
        </div>
    </div>
);
