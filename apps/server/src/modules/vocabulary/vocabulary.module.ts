import { Module } from "@nestjs/common";

import { PrismaService } from "../prisma";

import { PreparationVocabularyController,  } from "./preparation-vocabulary.controller";
import { VocabularyService } from "./vocabulary.service";
import { WorkspaceVocabularyController } from "./workspace-vocabulary.controller";

@Module({
    controllers: [PreparationVocabularyController, WorkspaceVocabularyController],
    providers: [VocabularyService, PrismaService],
    exports: [VocabularyService],
})
export class VocabularyModule { }
