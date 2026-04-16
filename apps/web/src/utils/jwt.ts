type JwtPayload = {
	readonly sub: string;
	readonly email: string;
	readonly iat: number;
	readonly exp: number;
};
export const decodeJwt = <T = JwtPayload>(token: string): T | null => {
	try {
		const parts = token.split(".");

		if (parts.length !== 3) throw new Error("Invalid JWT format");

		const payload = parts[1];

		const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
		const decoded = atob(base64);

		return (JSON.parse(decoded) as T);
	}
	catch (error) {
		console.error("Failed to decode JWT:", error);
		return (null);
	}
};
