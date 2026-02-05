import { PropsWithChildren, useEffect, useState } from "react";

import { useAuth } from "@/modules/auth";
import { useLocaleNavigate } from "@/modules/router";
import { LOCAL_STORAGE } from "@/utils";

import { create, getAll, remove, update, UpdateParams } from "../services";
import { Workspace } from "../types";

import { CreateWorkspaceParams, WorkspacesContext } from "./WorkspacesContext";

export const WorkspacesProvider = (props: PropsWithChildren) => {
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
    const [hasFetch, setHasFetch] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [workspaceId, setWorkspaceId] = useState<string | undefined>(undefined);
    const [workspaces, setWorkspaces] = useState<Record<string, Workspace>>({});

    const { isAuthenticated } = useAuth();
    const navigate = useLocaleNavigate();

    const addNewWorkspace = async (params: CreateWorkspaceParams) => {
        const response = await create(params);

        if (response.success) {
            const workspace = response.data;

            setWorkspaceId(workspace.id);
            setWorkspaces(state => ({ ...state, [workspace.id]: workspace }));
            setCurrentWorkspace(workspace);
            localStorage.setItem(LOCAL_STORAGE.workspace, workspace.id);

            return (workspace);
        }
    };
    const changeWorkspace = (id: string) => {
        setWorkspaceId(id);
        localStorage.setItem(LOCAL_STORAGE.workspace, id);
        navigate("/");
    };
    const removeWorkspace = async (id: string) => {
        const response = await remove({ id });

        if (response.success) {
            setWorkspaces(state => {
                const copy = { ...state };

                if (id in copy) {
                    delete copy[id];
                }

                return (copy);
            });
        }
    };
    const updateWorkspace = async ({ body, id }: UpdateParams) => {
        const response = await update({ body, id });

        if (response.success) {
            setWorkspaces(state => ({
                ...state,
                [id]: {
                    ...state[id],
                    ...body,
                },
            }));
        }
    };

    useEffect(() => {
        if (hasFetch || !isAuthenticated) {
            return;
        }

        const fetchWorkspaces = async () => {
            try {
                const response = await getAll();

                if (response.success) {
                    const { data } = response;

                    const record: Record<string, any> = {};
                    for (const workspace of data) {
                        record[workspace.id] = workspace;
                    }

                    setWorkspaces(record);
                }
            } catch (error) {
                console.error("An error occured while retrieving the workspaces.\nError: ", error);
            } finally {
                setHasFetch(true);
            }
        };

        fetchWorkspaces();
    }, [isAuthenticated, hasFetch]);

    // Retrieves the value stored locaclly to set it as current workspace
    useEffect(() => {
        const storedItem = localStorage.getItem(LOCAL_STORAGE.workspace);

        if (!storedItem) {
            return;
        }

        setWorkspaceId(storedItem);
    }, []);
    useEffect(() => {
        const workspacesKeys = Object.keys(workspaces);
        if (workspacesKeys.length > 0 && !workspaceId) {
            setWorkspaceId(workspacesKeys[0]);
            localStorage.setItem(LOCAL_STORAGE.workspace, workspacesKeys[0]);
        }
    }, [workspaces]);
    useEffect(() => {
        if (!hasFetch) return;

        const hasValidWorkspace = (
            workspaceId !== undefined &&
            workspaces[workspaceId] !== undefined
        );

        if (hasValidWorkspace) {
            setCurrentWorkspace(workspaces[workspaceId]);
        }

        setIsReady(true);
    }, [hasFetch, workspaceId, workspaces]);

    return (
        <WorkspacesContext.Provider
            value={{
                addNewWorkspace,
                changeWorkspace,
                currentWorkspace,
                isReady,
                removeWorkspace,
                updateWorkspace,
                workspaces,
            }}
        >
            {props.children}
        </WorkspacesContext.Provider>
    );
};
