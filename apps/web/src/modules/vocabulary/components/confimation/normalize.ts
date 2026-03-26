export const normalizeVocabulary = (input: string): string => (
	input
		// 2. Replaces insecable spaces
		.replace(/\u00A0/g, " ")
		// Replaces other Unicode spaces
		.replace(/[\u2000-\u200B\u202F\u205F\u3000]/g, " ")
		// 3. Trim start + end
		.trim()
		// 4. Replace multiple spaces
		.replace(/\s+/g, " ")
);
