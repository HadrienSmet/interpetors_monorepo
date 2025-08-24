import { PropsWithChildren, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "@/modules/auth";

import { create, getAll, remove, update, UpdateParams } from "../services";
import { Workspace } from "../types";

import { CreateWorkspaceParams, WorkSpacesContext } from "./WorkSpacesContext";

const STORAGE_KEY = "workspaceId";

export const WorkSpacesProvider = (props: PropsWithChildren) => {
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
    const [hasFetch, setHasFetch] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [workspaceId, setWorkspaceId] = useState<string | undefined>(undefined);
    const [workspaces, setWorkspaces] = useState<Record<string, Workspace>>({});

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

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
            navigate("/");
        }
    };
    const changeWorkspace = (id: string) => {
        setWorkspaceId(id);
        localStorage.setItem(STORAGE_KEY, id);
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

                    let record: Record<string, any> = {};
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
    useEffect(() => {
        if (workspaceId && Object.keys(workspaces).length > 0) {
            setCurrentWorkspace(workspaces[workspaceId] ?? null);
        }
    }, [workspaceId, workspaces]);
    useEffect(() => {
        if (!hasFetch) return;

        const hasValidWorkspace = workspaceId && workspaces[workspaceId];
        if (hasValidWorkspace) {
            setCurrentWorkspace(workspaces[workspaceId]);
        }

        // Consider ready when we have fetched and have tried to select a workspace (even null)
        if (hasFetch) {
            setIsReady(true);
        }
    }, [hasFetch, workspaceId, workspaces]);

    return (
        <WorkSpacesContext.Provider
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
        </WorkSpacesContext.Provider>
    );
};
