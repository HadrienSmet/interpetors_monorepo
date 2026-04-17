import { APP_NAME } from "@/constants";

import { useAppHeader } from "./AppHeaderContext";
import "./header.scss";

export const AppHeader = () => {
	const { workspaceNode, viewNode } = useAppHeader();

	return (
		<header className="app-header">
			<div className="app-header__data">
				{workspaceNode}
				{viewNode}
			</div>
			<p>{APP_NAME}</p>
		</header>
	);
};
