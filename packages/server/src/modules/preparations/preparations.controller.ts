import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { CreatePreparationDto } from "./dto";
import { PreparationsService } from "./preparations.service";

@Controller("workspaces/:workspaceId/preparations")
export class PreparationsController {
    constructor(private readonly service: PreparationsService) { }

    @Post()
    async create(
        @Param("workspaceId") workspaceId: string,
        @Body() dto: CreatePreparationDto,
    ) {
        const prep = await this.service.create(workspaceId, dto);

        return (prep);
    }

    /** Récupère toutes les préparations d’un workspace */
    @Get()
    async list(@Param("workspaceId") workspaceId: string) {
        return this.service.listByWorkspace(workspaceId);
    }

}
