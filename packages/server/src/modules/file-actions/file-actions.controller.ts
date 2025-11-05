import { Body, Controller, Get, Param, Post, UseGuards, ValidationPipe } from "@nestjs/common";

import { JwtAuthGuard } from "src/common";

import { CreateFileActionDto, UpsertFileActionBody } from "./dto";
import { FileActionsService } from "./file-actions.service";

@Controller("files/actions")
@UseGuards(JwtAuthGuard)
export class FileActionsController {
    constructor(private readonly service: FileActionsService) { }

    /**
     * Crée ou met à jour les actions d’une page du fichier PDF
     */
    @Post()
    async upsert(@Body(new ValidationPipe({ whitelist: true, transform: true })) body: UpsertFileActionBody) {
        const { pdfFileId, ...rest } = body;

        return this.service.upsert(pdfFileId, rest);
    }

    /**
     * Récupère toutes les actions d’un fichier PDF
     */
    @Get(":pdfFileId")
    async findAll(@Param("pdfFileId") pdfFileId: string) {
        return this.service.findAllByPdfFile(pdfFileId);
    }

    @Post("bulk")
    async bulk(@Body() body: { pdfFileIds: Array<string>; }) {
        return this.service.findAllByPdfFiles(body.pdfFileIds ?? []);
    }
}
