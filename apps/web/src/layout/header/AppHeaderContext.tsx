import { createContext, ReactNode, useContext } from "react";

import { getContextError } from "@/contexts/utils";

type AppHeaderContextType = {
	readonly setViewNode: (node: ReactNode) => void;
	readonly setWorkspaceNode: (node: ReactNode) => void;
	readonly viewNode?: ReactNode;
	readonly workspaceNode: ReactNode;
};
export const AppHeaderContext = createContext<AppHeaderContextType | null>(null);

export const useAppHeader = () => {
	const ctx = useContext(AppHeaderContext);

	if (!ctx) throw new Error(getContextError("useAppHeader", "AppHeaderProvider"));

	return (ctx);
};
