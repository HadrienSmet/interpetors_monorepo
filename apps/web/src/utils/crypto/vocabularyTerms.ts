import { SavedVocabularyTerm, VocabularyTerm } from "@repo/types";

import { safeJsonParse } from "../json";

import { decryptString, encryptString, EncryptedResource } from "./core";

export const decryptVocabularyTerms = async (
	userKey: CryptoKey,
	terms: Array<SavedVocabularyTerm>,
): Promise<Array<SavedVocabularyTerm>> => {
	const output: Array<SavedVocabularyTerm> = [];

	for (const term of terms) {
		const encrypted = safeJsonParse<EncryptedResource>(
			term.occurrence.text,
		);
		const decryptedText = await decryptString(userKey, encrypted);

		output.push({
			...term,
			occurrence: {
				...term.occurrence,
				text: decryptedText,
			},
		});
	}

	return (output);
};
export type VocToPost = 
	& Omit<VocabularyTerm, "id">
	& { readonly id?: string };
export const encryptVocabularyTerms = async (
	userKey: CryptoKey,
	terms: Array<VocToPost>
) => {
	const output: Array<VocToPost> = [];
	for (const t of terms) {
		const encryptedRef = await encryptString(userKey, t.occurrence.text);
		output.push({
			...t,
			occurrence: {
				...t.occurrence,
				text: JSON.stringify(encryptedRef),
			},
		});
	}

	return (output);
};
