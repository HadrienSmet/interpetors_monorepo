import { decodeJwt } from "./jwt";

export const LOCAL_STORAGE = {
	coloPanel: "colorPanelId",
	cryptoSalt: "cryptoSalt",
	refresh: "authRefresh",
	token: "authToken",
	theme: "theme",
	userId: "userId",
	workspace: "workspaceId",
};

export const getUserEmail = () => {
	const jwt = localStorage.getItem(LOCAL_STORAGE.token);

	if (!jwt) return;

	const payload = decodeJwt(jwt);
	if (!payload) return;

	const { email } = payload;

	return (email);
};
