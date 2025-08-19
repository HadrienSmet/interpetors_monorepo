import { PropsWithChildren, useEffect, useMemo, useState } from "react";

import { create, getAll } from "../services";
import { Workspace } from "../types";

import { CreateWorkspaceParams, WorkSpacesContext } from "./WorkSpacesContext";

const STORAGE_KEY = "workspaceId";

export const WorkSpacesProvider = (props: PropsWithChildren) => {
    const [hasFetch, setHasFetch] = useState(false);
    const [workspaceId, setWorkspaceId] = useState<string | undefined>(undefined);
    const [workspaces, setWorkspaces] = useState<Record<string, Workspace>>({});

    const currentWorkspace = useMemo(() => (
        workspaceId
            ? workspaces[workspaceId] ?? null
            : null
    ), [workspaceId, workspaces]);

    const addNewWorkspace = async (params: CreateWorkspaceParams) => {
        const response = await create(params);

        if (response.success) {
            const workspace = response.data;

            setWorkspaceId(workspace.id);
            setWorkspaces(state => ({
                ...state,
                [workspace.id]: workspace
            }));
            localStorage.setItem(STORAGE_KEY, workspace.id);
        }
    };
    const changeWorkspace = (id: string) => setWorkspaceId(id);

    useEffect(() => {
        if (hasFetch) {
            return;
        }

        const fetchWorkspaces = async () => {
            try {
                const response = await getAll();

                if (response.success) {
                    const { data } = response;

                    let record: Record<string, any> = {};
                    for (const workspace of data) {
                        record[workspace.id] = workspace;
                    }

                    setWorkspaces(record);
                }
            } catch (error) {
                console.error("An error occured while retrieving the workspaces.\nError: ", error)
            } finally {
                setHasFetch(true);
            }
        };

        fetchWorkspaces();
    }, []);

    // // Retrieves the value stored locaclly to set it as current workspace
    useEffect(() => {
        const storedItem = localStorage.getItem(STORAGE_KEY);

        if (!storedItem) {
            return;
        }

        setWorkspaceId(storedItem);
    }, []);
    useEffect(() => {
        const workspacesKeys = Object.keys(workspaces);
        if (workspacesKeys.length > 0 && !workspaceId) {
            setWorkspaceId(workspacesKeys[0]);
            localStorage.setItem(STORAGE_KEY, workspacesKeys[0]);
        }
    }, [workspaces]);

    return (
        <WorkSpacesContext.Provider
            value={{
                addNewWorkspace,
                currentWorkspace,
                changeWorkspace,
                workspaces,
            }}
        >
            {props.children}
        </WorkSpacesContext.Provider>
    );
};
