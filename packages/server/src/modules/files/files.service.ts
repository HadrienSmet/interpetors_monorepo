import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma";

import { CreatePdfFileDto } from "./dto";

@Injectable()
export class FilesService {
    constructor(private readonly prisma: PrismaService) { }

    async assertPreparation (preparationId: string) {
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
                preparationId,
            },
        });

        return pdfFile;
    }

    async getAll(preparationId: string) {
        await this.assertPreparation(preparationId);

        const pdfFiles = await this.prisma.pdfFile.findMany({
            where: { preparationId },
            orderBy: { filePath: "asc" },
        });

        return (pdfFiles);
    }
}
