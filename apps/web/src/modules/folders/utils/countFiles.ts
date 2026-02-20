import { FolderStructure } from "@repo/types";

import { isPdfMetadata } from "../contexts";

export const countFiles = (structure: FolderStructure): number => {
	let count = 0;

	for (const key in structure) {
		const value = structure[key];

		if (isPdfMetadata(value)) count++;
		else count += countFiles(value);
	}

	return (count);
};
