import { useMemo } from "react";

import { useWorkSpaces } from "@/contexts";
import { Select } from "@/components";

import { NavigationButton } from "./NavigationButton";
import { NAVIGATION, NavigationProps } from "./navigation.types";
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
            name="work-environment"
            onChange={() => console.log("Changed")}
            defaultValue={currentWorkSpace?.id.toString()}
            options={options}
        />
    );
};

export const Navigation = (props: NavigationProps) => {
    return (
        <div className="navigation">
            <div className="navigation-header">
                <WorkSpacesSelect />
            </div>
            <div className="navigation-buttons">
                {Object.keys(NAVIGATION).map(key => {
                    const current = NAVIGATION[key as keyof typeof NAVIGATION];

                    return (
                        <NavigationButton
                            {...props}
                            buttonId={current.id}
                            icon={current.icon}
                            key={current.id}
                        />
                    );
                })}
            </div>
        </div>
    );
};
