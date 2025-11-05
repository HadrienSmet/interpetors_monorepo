import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "src/common";

import { CreateFolderDto, RenameFolderDto } from "./dto";
import { FoldersService } from "./folders.service";

@Controller("workspaces/:workspaceId/preparations/:preparationId/folders")
@UseGuards(JwtAuthGuard)
export class FoldersController {
    constructor(private readonly service: FoldersService) { }

    @Post()
    async create(
        @Param("workspaceId") workspaceId: string,
        @Param("preparationId") preparationId: string,
        @Body() dto: CreateFolderDto,
    ) {
        return this.service.create(workspaceId, preparationId, dto);
    }

    // Liste les enfants d"un parent, ou les dossiers racine si parentId est absent
    @Get()
    async list(
        @Param("workspaceId") workspaceId: string,
        @Param("preparationId") preparationId: string,
    ) {
        return this.service.tree(workspaceId, preparationId, { includeFiles: true });
    }

    @Patch(":folderId")
    async rename(
        @Param("workspaceId") workspaceId: string,
        @Param("preparationId") preparationId: string,
        @Param("folderId") folderId: string,
        @Body() dto: RenameFolderDto,
    ) {
        return this.service.rename(workspaceId, preparationId, folderId, dto);
    }

    @Delete(":folderId")
    async remove(
        @Param("workspaceId") workspaceId: string,
        @Param("preparationId") preparationId: string,
        @Param("folderId") folderId: string,
    ) {
        return this.service.remove(workspaceId, preparationId, folderId);
    }
}
