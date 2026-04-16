import { PropsWithChildren, ReactNode, useState } from "react";

import { AppHeaderContext } from "./AppHeaderContext";

export const AppHeaderProvider = ({ children }: PropsWithChildren) => {
	const [viewNode, setViewNode] = useState<ReactNode>(undefined);
	const [workspaceNode, setWorkspaceNode] = useState<ReactNode>(null);

	const value = {
		setViewNode,
		setWorkspaceNode,
		viewNode,
		workspaceNode,
	};

	return (
		<AppHeaderContext.Provider value={value}>
			{children}
		</AppHeaderContext.Provider>
	);
};
