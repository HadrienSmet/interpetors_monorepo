import { Module } from "@nestjs/common";

import { PrismaService } from "../prisma";

import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";

@Module({
    controllers: [FilesController],
    providers: [FilesService, PrismaService],
    exports: [FilesService],
})
export class FilesModule { }
