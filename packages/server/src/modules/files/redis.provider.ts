import Redis from "ioredis";

export const RedisProvider = {
	provide: "REDIS",
	useFactory: () => {
		if (!process.env.REDIS_URL) throw new Error("Missing environment variable: REDIS_URL");
		
		return new Redis(process.env.REDIS_URL);
	},
};
