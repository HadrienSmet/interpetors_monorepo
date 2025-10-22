import { Module } from "@nestjs/common";

import { PrismaService } from "../prisma";

import { FileActionsController } from "./file-actions.controller";
import { FileActionsService } from "./file-actions.service";

@Module({
    controllers: [FileActionsController],
    providers: [FileActionsService, PrismaService],
    exports: [FileActionsService],
})
export class FileActionsModule { }
