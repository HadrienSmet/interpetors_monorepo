import { createContext, useContext } from "react";

import { getContextError } from "@/contexts/utils";

import { UpdateParams } from "../services";
import { Workspace } from "../types";

export type CreateWorkspaceParams = {
	readonly colorPanelId?: string;
    readonly languages: Array<string>;
    readonly name: string;
    readonly nativeLanguage: string;
};
export type WorkspacesContextType = {
    readonly addNewWorkspace: (params: CreateWorkspaceParams) => Promise<Workspace | undefined>;
    readonly changeWorkspace: (id: string) => void;
    readonly currentWorkspace: Workspace | null;
    readonly isReady: boolean;
    readonly removeWorkspace: (id: string) => Promise<void>;
    readonly updateWorkspace: (params: UpdateParams) => Promise<void>;
    readonly workspaces: Record<string, Workspace>;
};
export const WorkspacesContext = createContext<WorkspacesContextType | null>(null);

export const useWorkspaces = () => {
    const context = useContext(WorkspacesContext);

    if (!context) {
        throw new Error(getContextError("useWorkspaces", "WorkspacesProvider"));
    }

    return (context);
};
