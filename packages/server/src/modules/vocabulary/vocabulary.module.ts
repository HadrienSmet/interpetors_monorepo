import { Module } from "@nestjs/common";

import { PrismaService } from "../prisma";

import { VocabularyController } from "./vocabulary.controller";
import { VocabularyService } from "./vocabulary.service";

@Module({
    controllers: [VocabularyController],
    providers: [VocabularyService, PrismaService],
    exports: [VocabularyService],
})
export class VocabularyModule { }
