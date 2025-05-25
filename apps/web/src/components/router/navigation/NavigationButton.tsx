import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { NAVIGATION, NavigationItem } from "./navigation.types";
import { useLocation, useNavigate } from "react-router-dom";

type NavigationButtonProps =
    & NavigationItem
    // & NavigationProps
    & { readonly depth?: number; };

const SELECTED_CLASS = "selected";

export const NavigationButton = ({
    depth = 0,
    icon,
    id,
    // navigation,
    nestedNav,
    // setNavigation,
}: NavigationButtonProps) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { t } = useTranslation();
    const location = useLocation();
    const navigation = location.pathname
        .split("/")
        .filter(Boolean);
    const navigate = useNavigate();

    const buttonStyle = useMemo(() => ({
        fontSize: `${16 - (2 * depth)}px`,
        paddingLeft: `${8 + (depth * 16)}px`,
    }), [depth]);
    const isSelected = useMemo(
        () => (navigation[depth] === id),
        [navigation, depth, id]
    );

    useEffect(() => {
        if (isSelected) {
            buttonRef.current?.classList.add(SELECTED_CLASS);
            return;
        }

        buttonRef.current?.classList.remove(SELECTED_CLASS);
    }, [isSelected]);

    const handleClick = () => {
        const newPath = navigation.slice(0, depth);
        const updatedPath = [...newPath, id];

        let currentItem: NavigationItem | undefined;
        for (const key of updatedPath) {
            // @ts-expect-error
            currentItem = (currentItem?.nestedNav?.[key] ?? NAVIGATION[key.toUpperCase()]) as NavigationItem;
        }

        const descendFirst = (item: NavigationItem | undefined, path: string[]): string[] => {
            if (!item?.nestedNav) return path;

            const firstKey = Object.keys(item.nestedNav)[0];
            const nextItem = item.nestedNav[firstKey];

            return (descendFirst(nextItem, [...path, nextItem.id]));
        };

        const finalPath = descendFirst(currentItem, updatedPath);

        // setNavigation(finalPath as NavigationState);

        const urlPath = "/" + finalPath.join("/");
        navigate(urlPath);
    };

    return (
        <div className="navigation-button">
            <button
                onClick={handleClick}
                ref={buttonRef}
                style={buttonStyle}
            >
                {icon} {t(`navigation.buttons.${id}`)}
            </button>

            {isSelected && nestedNav && (
                <div className="nested-navigation">
                    {Object.values(nestedNav).map(item => (
                        <NavigationButton
                            {...item}
                            key={item.id}
                            // navigation={navigation}
                            // setNavigation={setNavigation}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
