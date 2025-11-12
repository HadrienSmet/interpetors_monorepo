import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { retryAsync } from "src/common";

import { PrismaService } from "../prisma";

import { CreateFileActionDto } from "./dto";

@Injectable()
export class FileActionsService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Crée ou met à jour une FileAction (1 par pageIndex)
     */
    async upsert(pdfFileId: string, dto: CreateFileActionDto) {
        if (!pdfFileId) {
            throw new BadRequestException("pdfFileId is required");
        }

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
                    referencesJson: dto.referencesJson ? JSON.parse(dto.referencesJson) : [],
                    generatedResourcesJson: dto.generatedResourcesJson ? JSON.parse(dto.generatedResourcesJson) : [],
                },
                create: {
                    pdfFileId,
                    pageIndex: dto.pageIndex,
                    elementsJson: JSON.parse(dto.elementsJson),
                    referencesJson: dto.referencesJson ? JSON.parse(dto.referencesJson) : [],
                    generatedResourcesJson: dto.generatedResourcesJson ? JSON.parse(dto.generatedResourcesJson) : [],
                },
            });

            return action;
        } catch (err) {
            throw new BadRequestException("Invalid JSON or database error");
        }
    }

    /**
     * Récupère toutes les actions d’un PDF (facultatif)
     */
    async findAllByPdfFile(pdfFileId: string) {
        return (retryAsync(
            () => (
                this.prisma.fileAction.findMany({
                    where: { pdfFileId },
                    orderBy: { pageIndex: "asc" },
                })
            ),
        ));
    }
    async findAllByPdfFiles(pdfFileIds: string[]) {
        if (!pdfFileIds.length) return {};

        const rows = await retryAsync(
            () => (
                this.prisma.fileAction.findMany({
                    where: { pdfFileId: { in: pdfFileIds } },
                    orderBy: [
                        { pdfFileId: "asc" },
                        { pageIndex: "asc" },
                    ],
                })
            ),
            { maxAttempts: 5 },
        );

        // Regroupe par pdfFileId
        const map: Record<string, typeof rows> = {};
        for (const row of rows) {
            (map[row.pdfFileId] ??= []).push(row);
        }
        return map;
    }
}
