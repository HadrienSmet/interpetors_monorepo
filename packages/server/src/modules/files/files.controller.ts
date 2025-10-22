import { Body, Controller, Param, Post, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "src/common";

import { CreatePdfFileDto } from "./dto";
import { FilesService } from "./files.service";

@Controller("folders/:folderId/files")
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private readonly service: FilesService) { }

    @Post()
    async create(
        @Param("folderId") folderId: string,
        @Body() dto: CreatePdfFileDto,
    ) {
        return this.service.create(folderId, dto);
    }
}
