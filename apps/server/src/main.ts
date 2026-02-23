import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";
import { TimeoutInterceptor } from "./common";

const DEFAULT_PORT = 3000 as const;
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type,Authorization",
    });

    app.useGlobalInterceptors(new TimeoutInterceptor());

    await app.listen(process.env.PORT ?? DEFAULT_PORT);
}
bootstrap();
