import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { NavigationItem, NavigationProps, NavigationState } from "./navigation.types";

type NavigationButtonProps =
    & NavigationItem
    & NavigationProps
    & { readonly depth?: number; };

const SELECTED_CLASS = "selected";

export const NavigationButton = ({
    depth = 0,
    icon,
    id,
    navigation,
    nestedNav,
    setNavigation,
}: NavigationButtonProps) => {
    const { t } = useTranslation();
    const buttonRef = useRef<HTMLButtonElement>(null);

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

        setNavigation([...newPath, id] as NavigationState);
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
                            navigation={navigation}
                            setNavigation={setNavigation}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
