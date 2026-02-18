import { Module } from "@nestjs/common";

import { PrismaService } from "../prisma";

import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { RedisProvider } from "./redis.provider";

@Module({
    controllers: [FilesController],
    providers: [FilesService, PrismaService, RedisProvider],
    exports: [FilesService],
})
export class FilesModule { }
