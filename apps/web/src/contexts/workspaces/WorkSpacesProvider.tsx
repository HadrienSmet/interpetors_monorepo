import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { useColorPanels } from "@/contexts";

import { WorkSpace, WorkSpacesState } from "./workspaces.types";
import { WorkSpacesContext } from "./WorkSpacesContext";

const STORAGE_KEY = "workspaces";

export const WorkSpacesProvider = (props: PropsWithChildren) => {
    const [workSpacesState, setWorkSpacesState] = useState<WorkSpacesState>({
        currentWorkSpaceId: 0,
        workSpaces: {},
    });
    const { colorPanels } = useColorPanels();

    const currentWorkSpace = useMemo(() => (
        workSpacesState.workSpaces[workSpacesState.currentWorkSpaceId] ?? null
    ), [workSpacesState]);

    const addNewWorkSpace = (workSpace: WorkSpace) => setWorkSpacesState(state => {
        const workSpaceId = Object.keys(state.workSpaces).length;

        return ({
            ...state,
            workSpaces: {
                ...state.workSpaces,
                [workSpaceId]: {
                    ...workSpace,
                    id: workSpaceId,
                },
            },
        });
    });
    const changeWorkSpace = (id: number) => setWorkSpacesState(state => ({
        ...state,
        currentWorkSpaceId: id,
    }));
    const editWorkSpace = (workSpace: WorkSpace) => setWorkSpacesState(state => ({
        ...state,
        workSpaces: {
            ...state.workSpaces,
            [workSpace.id]: workSpace,
        },
    }));
    const removeWorkSpace = (id: number) => setWorkSpacesState(state => {
        const copy = { ...state };

        if (id in copy.workSpaces) {
            delete copy.workSpaces[id];
        }

        return (copy);
    });

    useEffect(() => {
        if (currentWorkSpace && currentWorkSpace.colorPanel && !(currentWorkSpace.colorPanel in colorPanels)) {
            // Color panel has been deleted
            editWorkSpace({ ...currentWorkSpace, colorPanel: null });
        }
    }, [
        colorPanels,
        workSpacesState.currentWorkSpaceId,
        workSpacesState.workSpaces,
    ]);
    // Retrieves the value stored locaclly to set it as current workspace
    useEffect(() => {
        const storedItem = localStorage.getItem(STORAGE_KEY);

        if (!storedItem) {
            return;
        }

        setWorkSpacesState(JSON.parse(storedItem));
    }, []);
    useEffect(() => {
        if (currentWorkSpace) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(workSpacesState));
        }
    }, [workSpacesState]);

    return (
        <WorkSpacesContext.Provider
            value={{
                addNewWorkSpace,
                currentWorkSpace,
                changeWorkSpace,
                editWorkSpace,
                removeWorkSpace,
                workSpaces: workSpacesState.workSpaces,
            }}
        >
            {props.children}
        </WorkSpacesContext.Provider>
    );
};
