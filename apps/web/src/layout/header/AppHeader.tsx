import { useAppHeader } from "./AppHeaderContext";
import "./header.scss";

export const AppHeader = () => {
	const { workspaceNode, viewNode } = useAppHeader();

	return (
		<header className="app-header">
			{workspaceNode}
			{viewNode}
		</header>
	);
};
