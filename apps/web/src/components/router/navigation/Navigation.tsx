import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { MdExitToApp, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdMenu } from "react-icons/md";
import { useTranslation } from "react-i18next";

import { Select } from "@/components";
import { ResizableSection, useAuth, useResizableLayout, useWorkSpaces } from "@/modules";

import { NavigationButton } from "./NavigationButton";
import { NAVIGATION } from "./navigation.types";
import "./navigation.scss";

const WorkSpacesSelect = () => {
    const { currentWorkspace, workspaces } = useWorkSpaces();

    const options = useMemo(() => (
        Object.keys(workspaces).map(key => {
            const workSpace = workspaces[key];

            return ({ value: workSpace.id, label: workSpace.name });
        })
    ), [workspaces]);

    return (
        <Select
            name="work-space"
            // TODO: Managing creation of other environment + Changing of environment
            onChange={() => console.log("Changed")}
            defaultValue={currentWorkspace?.id}
            options={options}
        />
    );
};

const ICON_SIZE = 24 as const;
const UnexpandedNavigation = (props: { setIsExpanded: Dispatch<SetStateAction<boolean>> }) => {
    const [isHovered, setHovered] = useState(false);

    return (
        <div
            className={`navigation-padding  ${isHovered ? "hover" : ""}`}
            onClick={() => props.setIsExpanded(true)}
            onMouseOver={() => setHovered(true)}
            onMouseOut={() => setHovered(false)}
        >
            {isHovered
                ? <MdKeyboardDoubleArrowRight size={ICON_SIZE} />
                : <MdMenu size={ICON_SIZE} />
            }
        </div>
    );
};

const NAVIGATION_DEFAULT_WIDTH = 275 as const;
const SECTION_ID = "navigation";
export const Navigation = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    const { signout } = useAuth();
    const { setSectionVisibility } = useResizableLayout();
    const { t } = useTranslation();

    useEffect(() => {
        setSectionVisibility(SECTION_ID, isExpanded);
    }, [isExpanded]);

    if (!isExpanded) {
        return (<UnexpandedNavigation setIsExpanded={setIsExpanded} />);
    }

    return (
        <ResizableSection
            initialWidth={NAVIGATION_DEFAULT_WIDTH}
            id={SECTION_ID}
        >
            <div className="navigation navigation-padding">
                <div className="navigation-header">
                    <div className="input-container">
                        <WorkSpacesSelect />
                    </div>
                    <MdKeyboardDoubleArrowLeft
                        size={ICON_SIZE}
                        onClick={() => setIsExpanded(false)}
                    />
                </div>
                <div className="navigation-buttons">
                    {Object.keys(NAVIGATION).map(key => {
                        const current = NAVIGATION[key as keyof typeof NAVIGATION];

                        return (
                            <NavigationButton
                                {...current}
                                key={current.id}
                            />
                        );
                    })}
                </div>
                <button
                    className="navigation-log-out"
                    onClick={signout}
                >
                    <MdExitToApp />
                    <span>{t("auth.signout")}</span>
                </button>
            </div>
        </ResizableSection>
    );
};
