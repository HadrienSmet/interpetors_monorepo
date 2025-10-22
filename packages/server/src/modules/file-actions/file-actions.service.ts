import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma";

import { CreateFileActionDto } from "./dto";

@Injectable()
export class FileActionsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Crée ou met à jour une FileAction (1 par pageIndex)
     */
    async upsert(pdfFileId: string, dto: CreateFileActionDto) {
        // Vérifie que le fichier existe
        const pdfFile = await this.prisma.pdfFile.findUnique({
            where: { id: pdfFileId },
            select: { id: true },
        });

        if (!pdfFile) {
            throw new NotFoundException(`PdfFile ${pdfFileId} not found`);
        }

        try {
            const action = await this.prisma.fileAction.upsert({
                where: {
                    pdfFileId_pageIndex: {
                        pdfFileId,
                        pageIndex: dto.pageIndex,
                    },
                },
                update: {
                    elementsJson: JSON.parse(dto.elementsJson),
                    referencesJson: dto.referencesJson ? JSON.parse(dto.referencesJson) : undefined,
                    generatedResourcesJson: dto.generatedResourcesJson ? JSON.parse(dto.generatedResourcesJson) : undefined,
                },
                create: {
                    pdfFileId,
                    pageIndex: dto.pageIndex,
                    elementsJson: JSON.parse(dto.elementsJson),
                    referencesJson: dto.referencesJson ? JSON.parse(dto.referencesJson) : undefined,
                    generatedResourcesJson: dto.generatedResourcesJson ? JSON.parse(dto.generatedResourcesJson) : undefined,
                },
            });

            return action;
        } catch (err) {
            console.error("[FileActionsService.upsert] Error:", err);
            throw new BadRequestException("Invalid JSON or database error");
        }
    }

    /**
     * Récupère toutes les actions d’un PDF (facultatif)
     */
    async findAllByPdfFile(pdfFileId: string) {
        return this.prisma.fileAction.findMany({
            where: { pdfFileId },
            orderBy: { pageIndex: "asc" },
        });
    }
}
