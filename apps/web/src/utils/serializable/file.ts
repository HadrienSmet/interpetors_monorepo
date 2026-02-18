import { SerializableFile } from "@repo/types";

export const toSerializableFile = (f: File): SerializableFile => ({
	lastModified: f.lastModified,
	name: f.name,
	size: f.size,
	type: f.type,
});
