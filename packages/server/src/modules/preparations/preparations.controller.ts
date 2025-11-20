import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";

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

    @Patch(":preparationId")
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async patch(
        @Param("workspaceId", ParseUUIDPipe) workspaceId: string,
        @Param("preparationId") preparationId: string,
        @Body() dto: CreatePreparationDto,
    ) {
        const patched = await this.service.patch(workspaceId, preparationId, dto);

        return (patched);
    }
}
