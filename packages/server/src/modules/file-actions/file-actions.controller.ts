import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "src/common";

import { CreateFileActionDto } from "./dto";
import { FileActionsService } from "./file-actions.service";

@Controller("files/:pdfFileId/actions")
@UseGuards(JwtAuthGuard)
export class FileActionsController {
    constructor(private readonly service: FileActionsService) { }

    /**
     * Crée ou met à jour les actions d’une page du fichier PDF
     */
    @Post()
    async upsert(
        @Param("pdfFileId") pdfFileId: string,
        @Body() dto: CreateFileActionDto,
    ) {
        return this.service.upsert(pdfFileId, dto);
    }

    /**
     * Récupère toutes les actions d’un fichier PDF
     */
    @Get()
    async findAll(@Param("pdfFileId") pdfFileId: string) {
        return this.service.findAllByPdfFile(pdfFileId);
    }
}
