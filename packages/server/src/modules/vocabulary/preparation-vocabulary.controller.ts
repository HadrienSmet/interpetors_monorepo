import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { UpsertVocabularyBulkDto, UpsertVocabularyTermDto } from "./dto";
import { VocabularyService } from "./vocabulary.service";

@Controller("workspaces/:workspaceId/preparations/:preparationId/vocabulary")
export class PreparationVocabularyController {
    constructor(private readonly service: VocabularyService) { }

    @Get()
    async list(
        @Param("workspaceId") workspaceId: string,
        @Param("preparationId") preparationId: string,
    ) {
        return this.service.listForPreparation(workspaceId, preparationId);
    }

    // Création/MAJ unitaire + attachements
    @Post()
    async createOne(
        @Param("workspaceId") workspaceId: string,
        @Param("preparationId") preparationId: string,
        @Body() dto: UpsertVocabularyTermDto, // autorise aussi termId pour MAJ
    ) {
        return this.service.createOne(workspaceId, preparationId, dto);
    }

    // Bulk (transaction atomique)
    @Post("bulk")
    async upsertBulk(
        @Param("workspaceId") workspaceId: string,
        @Param("preparationId") preparationId: string,
        @Body() dto: UpsertVocabularyBulkDto,
    ) {
        return this.service.upsertBulk(workspaceId, preparationId, dto.terms);
    }

    // Détacher un terme de la préparation (sans supprimer globalement)
    @Delete(":termId")
    async detach(
        @Param("workspaceId") workspaceId: string,
        @Param("preparationId") preparationId: string,
        @Param("termId") termId: string,
    ) {
        return this.service.detachFromPreparation(workspaceId, preparationId, termId);
    }
}
