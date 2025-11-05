import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma";

import { CreatePdfFileDto } from "./dto";

@Injectable()
export class FilesService {
    constructor(private readonly prisma: PrismaService) { }

    async create(folderId: string, dto: CreatePdfFileDto) {
        if (!dto.name || !dto.s3Key) {
            throw new BadRequestException("Missing required fields");
        }

        // Vérifie que le folder existe
        const folder = await this.prisma.folder.findUnique({
            where: { id: folderId },
            select: { id: true },
        });
        if (!folder) {
            throw new NotFoundException(`Folder ${folderId} not found`);
        }

        // Création du PdfFile
        const pdfFile = await this.prisma.pdfFile.create({
            data: {
                ...dto,
                folderId: folderId,
            },
        });

        return pdfFile;
    }
}
