import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";

import { JwtAuthGuard } from "src/common";

import { CreatePdfFileDto, PatchPdfFileDto, PatchPdfFilesDto } from "./dto";
import { FilesService } from "./files.service";

@Controller("preparations/:preparationId/files")
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private readonly service: FilesService) { }

    @Post()
    async create(
        @Param("preparationId") preparationId: string,
        @Body() dto: CreatePdfFileDto,
    ) {
        return this.service.create(preparationId, dto);
    }

    @Get()
    async getAll(@Param("preparationId") preparationId: string) {
        return this.service.getAll(preparationId);
    }

    @Patch()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async patch(
        @Param("preparationId") preparationId: string,
        @Body() dto: PatchPdfFilesDto
    ) {
        return this.service.patch(preparationId, dto);
    }

    @Patch(":fileId")
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async patchOne(
        @Param("preparationId") preparationId: string,
        @Param("fileId") fileId: string,
        @Body() dto: PatchPdfFileDto
    ) {
        return this.service.patchOne(preparationId, fileId, dto);
    }
}
