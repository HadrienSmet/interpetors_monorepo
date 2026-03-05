import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { TimeoutInterceptor } from "./common";

const DEFAULT_PORT = 3000 as const;
const DEFAULT_HOST = "0.0.0.0";

const bootstrap = async () => {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        // origin: process.env.CLIENT_URL,
		origin: (origin: string | undefined, callback: (error: Error | null, origin: boolean) => void) => {
			console.log({ origin })
			// Autoriser les requêtes sans Origin (curl, server-to-server)
			if (!origin) return callback(null, true);

			const allowed = (process.env.CLIENT_URL ?? "").replace(/\/$/, "");
			const incoming = origin.replace(/\/$/, "");

			if (incoming === allowed) return callback(null, true);
			return callback(new Error(`CORS blocked: ${origin}`), false);
		},
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type","Authorization"],
    });

    app.useGlobalInterceptors(new TimeoutInterceptor());

    await app.listen(process.env.PORT ?? DEFAULT_PORT, process.env.HOST ?? DEFAULT_HOST);
};

bootstrap().catch(error => console.error(error));
