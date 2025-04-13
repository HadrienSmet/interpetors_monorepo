"use client";

import { createContext, useContext } from "react";

import { getContextError } from "../errorMessage";

import { WorkSpacesContextType } from "./workspaces.types";

export const WorkSpacesContext = createContext<WorkSpacesContextType | null>(null);

export const useWorkSpaces = () => {
    const context = useContext(WorkSpacesContext);

    if (!context) {
        throw new Error(getContextError("useWorkSpaces", "WorkSpacesProvider"));
    }

    return (context);
};
