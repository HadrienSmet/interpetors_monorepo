import { Body, Controller, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";

import { JwtAuthGuard } from "src/common";

import { CreatePdfFileDto, PatchPdfFileDto, PatchPdfFilesDto, UploadChunkDto } from "./dto";
import { FilesService } from "./files.service";

@Controller("preparations/:preparationId/files")
@UseGuards(JwtAuthGuard)
export class FilesController {
	constructor(private readonly service: FilesService) {}

	@Post()
	async create(@Param("preparationId") preparationId: string, @Body() dto: CreatePdfFileDto) {
		return this.service.create(preparationId, dto);
	}
	@Post(":fileId/actions/chunk")
	async uploadChunk(
		@Param("preparationId") preparationId: string,
		@Param("fileId") fileId: string, 
		@Body() dto: UploadChunkDto
	) {
		return this.service.receiveChunk(preparationId, fileId, dto);
	}

	@Get()
	async getAll(@Param("preparationId") preparationId: string) {
		return this.service.getAll(preparationId);
	}
	@Get(":fileId/actions")
	async getActions(
		@Param("preparationId") preparationId: string,
		@Param("fileId") fileId: string
	) {
		return this.service.getActions(preparationId, fileId);
	}

	@Patch()
	@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
	async patch(@Param("preparationId") preparationId: string, @Body() dto: PatchPdfFilesDto) {
		return this.service.patch(preparationId, dto);
	}

	@Patch(":fileId")
	@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
	async patchOne(@Param("preparationId") preparationId: string, @Param("fileId") fileId: string, @Body() dto: PatchPdfFileDto) {
		return this.service.patchOne(preparationId, fileId, dto);
	}
}
