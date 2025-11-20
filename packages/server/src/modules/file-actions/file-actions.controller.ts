import { Body, Controller, Get, Param, Patch, Post, UseGuards, ValidationPipe } from "@nestjs/common";

import { JwtAuthGuard } from "src/common";

import { PatchFileActionDto, UpsertFileActionBody } from "./dto";
import { FileActionsService } from "./file-actions.service";

@Controller("files/actions")
@UseGuards(JwtAuthGuard)
export class FileActionsController {
    constructor(private readonly service: FileActionsService) { }

    /**
     * Récupère toutes les actions d’un fichier PDF
     */
    @Get(":pdfFileId")
    async findAll(@Param("pdfFileId") pdfFileId: string) {
        return this.service.findAllByPdfFile(pdfFileId);
    }
    @Patch(":pdfFileId")
    async patch(
        @Param("pdfFileId") pdfFileId: string,
        @Body() dto: PatchFileActionDto
    ) {
        return this.service.patch(pdfFileId, dto);
    }
    /**
     * Crée ou met à jour les actions d’une page du fichier PDF
     */
    @Post()
    async upsert(@Body(new ValidationPipe({ whitelist: true, transform: true })) body: UpsertFileActionBody) {
        const { pdfFileId, ...rest } = body;

        return this.service.post(pdfFileId, rest);
    }
    @Post("bulk")
    async bulk(@Body() body: { pdfFileIds: Array<string>; }) {
        return this.service.findAllByPdfFiles(body.pdfFileIds ?? []);
    }
}
