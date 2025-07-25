import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdMenu } from "react-icons/md";

import { Select } from "@/components";
import { useWorkSpaces } from "@/contexts";
import { ResizableSection, useResizableLayout } from "@/modules";

import { NavigationButton } from "./NavigationButton";
import { NAVIGATION } from "./navigation.types";
import "./navigation.scss";

const WorkSpacesSelect = () => {
    const { currentWorkSpace, workSpaces } = useWorkSpaces();

    const options = useMemo(() => (
        Object.keys(workSpaces).map(key => {
            const parsedKey = parseInt(key);
            const workSpace = workSpaces[parsedKey];

            return ({ value: workSpace.id.toString(), label: workSpace.name });
        })
    ), [workSpaces]);

    return (
        <Select
            name="work-space"
            // TODO: Managing creation of other environment + Changing of environment
            onChange={() => console.log("Changed")}
            defaultValue={currentWorkSpace?.id.toString()}
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

    const { setSectionVisibility } = useResizableLayout();

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
            </div>
        </ResizableSection>
    );
};
