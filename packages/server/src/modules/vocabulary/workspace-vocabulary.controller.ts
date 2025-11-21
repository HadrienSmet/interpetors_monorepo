import { Controller, Get, Param } from "@nestjs/common";

import { VocabularyService } from "./vocabulary.service";

@Controller("workspaces/:workspaceId/vocabulary")
export class WorkspaceVocabularyController {
    constructor(private readonly service: VocabularyService) {}

    // Liste tous les termes attachés au workspace (via WorkspaceVocabularyTerm)
    @Get()
    async listForWorkspace(
        @Param("workspaceId") workspaceId: string,
    ) {
        return this.service.listForWorkspace(workspaceId);
    }
}
