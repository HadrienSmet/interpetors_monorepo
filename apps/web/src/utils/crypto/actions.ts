import { FileAction } from "@repo/types";

import { safeJsonParse } from "../json";

import { decryptJson, encryptJson, EncryptedResource } from "./core";

export const decryptActions = async (userKey: CryptoKey, actions: string): Promise<Record<number, FileAction>> => {
	const encryptedActions = safeJsonParse<EncryptedResource>(actions);
	const decryptedActions = await decryptJson<Record<number, FileAction>>(userKey, encryptedActions);

	return (decryptedActions);
};
export const encryptActions = async (userKey: CryptoKey, actions: Record<number, FileAction>): Promise<string> => {
	const encryptedActions = await encryptJson(userKey, actions);

	return (JSON.stringify(encryptedActions));
};