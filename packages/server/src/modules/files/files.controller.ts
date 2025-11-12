import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "src/common";

import { CreatePdfFileDto } from "./dto";
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
}
