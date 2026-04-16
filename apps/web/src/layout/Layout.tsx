import { Outlet } from "react-router";

import { ContextMenu } from "@/components";
import { Navigation } from "@/modules/router";

import { AppHeader } from "./header/AppHeader";

import "./layout.scss";

export const Layout = () => (
	<div className="app">
		<AppHeader />
		<div className="app-container">
			<Navigation />
			<div className="app-content">
				<Outlet />
			</div>
		</div>
		<ContextMenu />
	</div>
 );
