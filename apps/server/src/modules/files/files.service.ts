import { BadGatewayException, BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { createHash } from "crypto";
import Redis from "ioredis";

import { PdfFileApi } from "@repo/types";

import { PrismaService } from "../prisma";

import { CreatePdfFileDto, PatchPdfFileDto, PatchPdfFilesDto, UploadChunkDto } from "./dto";

@Injectable()
export class FilesService {
	constructor(
		private readonly prisma: PrismaService,
		@Inject("REDIS") private readonly redis: Redis
	) {}

	async assertPreparation(preparationId: string) {
		const preparation = await this.prisma.preparation.findUnique({
			where: { id: preparationId },
			select: { id: true },
		});
		if (!preparation) {
			throw new NotFoundException(`Folder ${preparationId} not found`);
		}
	}
	async create(preparationId: string, dto: CreatePdfFileDto) {
		if (!dto.name || !dto.s3Key) {
			throw new BadRequestException("Missing required fields");
		}

		await this.assertPreparation(preparationId);
		const pdfFile = await this.prisma.pdfFile.create({
			data: {
				...dto,
				actions: "",
				preparationId,
			},
		});

		return pdfFile;
	}

	async getActions(preparationId: string, fileId: string) {
		await this.assertPreparation(preparationId);

		const file = await this.prisma.pdfFile.findUnique({
			where: { id: fileId },
			select: { id: true, preparationId: true, actions: true },
		});

		if (!file || file.preparationId !== preparationId) {
			throw new NotFoundException("PdfFile not found");
		}

		return { fileId: file.id, actions: file.actions };
	}
	async getAll(preparationId: string) {
		await this.assertPreparation(preparationId);

		const pdfFiles = await this.prisma.pdfFile.findMany({
			where: { preparationId },
			orderBy: { filePath: "asc" },
			select: {
				createdAt: true,
				filePath: true,
				id: true,
				language: true,
				name: true,
				preparationId: true,
				s3Key: true,
				updatedAt: true,
			},
		});

		return pdfFiles;
	}

	async patch(preparationId: string, { files }: PatchPdfFilesDto) {
		const output: Array<PdfFileApi> = [];
		await this.assertPreparation(preparationId);
		for (const { id, ...data } of files) {
			const patched = await this.prisma.pdfFile.update({
				where: { id },
				data,
			});

			output.push(patched);
		}

		return output;
	}
	async patchOne(preparationId: string, fileId: string, dto: PatchPdfFileDto) {
		await this.assertPreparation(preparationId);

		const updated = await this.prisma.pdfFile.update({
			where: { id: fileId },
			data: dto,
		});

		return updated;
	}
	async receiveChunk(preparationId: string, fileId: string, dto: UploadChunkDto) {
		await this.assertPreparation(preparationId);

		const { uploadId, index, total, chunkB64, checksum } = dto;

		const metaKey = `upload:${uploadId}`;
		const chunksKey = `upload:${uploadId}:chunks`;

		const exists = await this.redis.exists(metaKey);

		if (!exists) {
			await this.redis.hmset(metaKey, {
				preparationId,
				fileId,
				total,
				checksum,
				receivedCount: 0,
				createdAt: Date.now(),
			});

			await this.redis.expire(metaKey, 900); // 15min
			await this.redis.expire(chunksKey, 900);
		}

		const meta = await this.redis.hgetall(metaKey);
		if (meta.fileId !== fileId) {
			throw new BadGatewayException("Upload mismatch");
		}

		const already = await this.redis.hexists(chunksKey, index.toString());
		if (!already) {
			await this.redis.hset(chunksKey, index.toString(), chunkB64);
			await this.redis.hincrby(metaKey, "receivedCount", 1);
		}

		const receivedCount = Number(await this.redis.hget(metaKey, "receivedCount"));
		if (receivedCount === Number(meta.total)) {
			const chunkMap = await this.redis.hgetall(chunksKey);

			const ordered = Object.entries(chunkMap)
				.sort(([a], [b]) => Number(a) - Number(b))
				.map(([_, value]) => Buffer.from(value, "base64"));

			const fullBuffer = Buffer.concat(ordered);
			const hash = createHash("sha256").update(fullBuffer).digest("base64");

			if (hash !== meta.checksum) {
				await this.redis.del(metaKey, chunksKey);
				throw new BadRequestException("Checksum mismatch");
			}

			await this.prisma.pdfFile.update({
				where: { id: fileId },
				data: {
					actions: fullBuffer.toString("base64"),
				},
			});

			await this.redis.del(metaKey, chunksKey);

			return { completed: true };
		}

		return { received: receivedCount, total };
	}
}
