import { createContext, useContext } from "react";

import { getContextError } from "@/contexts/utils";

import { Workspace } from "../types";

export type CreateWorkspaceParams = {
    readonly languages: Array<string>;
    readonly name: string;
    readonly nativeLanguage: string;
};
export type WorkSpacesContextType = {
    readonly addNewWorkspace: (params: CreateWorkspaceParams) => void;
    readonly changeWorkspace: (id: string) => void;
    readonly currentWorkspace: Workspace | null;
    readonly isReady: boolean;
    // readonly editWorkSpace: (workSpace: Workspace) => void;
    // readonly removeWorkSpace: (id: string) => void;
    readonly workspaces: Record<string, Workspace>;
};
export const WorkSpacesContext = createContext<WorkSpacesContextType | null>(null);

export const useWorkSpaces = () => {
    const context = useContext(WorkSpacesContext);

    if (!context) {
        throw new Error(getContextError("useWorkSpaces", "WorkSpacesProvider"));
    }

    return (context);
};
