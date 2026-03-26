export const FORBIDDEN_CHAR = [".", "!", "?", ":", ";"] as const;
export const LIMITS = {
	length: 80,
	words: 6,
} as const;

export const hasBackToLine = (expression: string) => /[\r\n]/.test(expression);
export const hasForbiddenChar = (expression: string) => {
	for (const char of FORBIDDEN_CHAR) {
		if (expression.includes(char)) {
			return (true);
		}
	}

	return (false);
};
export const hasTooMuchWords = (expression: string) => expression.split(" ").length >= LIMITS.words;
export const isTooLong = (expression: string) => expression.length >= LIMITS.length;
