import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { retryAsync } from "src/common";

import { PrismaService } from "../prisma";

import { CreateFileActionDto, PatchFileActionDto } from "./dto";

@Injectable()
export class FileActionsService {
    constructor(private readonly prisma: PrismaService) { }

    async patch(pdfFileId: string, dto: PatchFileActionDto) {
        if (!pdfFileId) {
            throw new BadRequestException("pdfFileId is required");
        }

        const pdfFile = await this.prisma.pdfFile.findUnique({
            where: { id: pdfFileId },
            select: { id: true },
        });

        if (!pdfFile) {
            throw new NotFoundException(`PdfFile ${pdfFileId} not found`);
        }

        // 1) récupérer l'action existante s'il y en a une
        const existing = await this.prisma.fileAction.findUnique({
            where: {
                pdfFileId_pageIndex: {
                    pdfFileId,
                    pageIndex: dto.pageIndex,
                },
            },
        });

        // 2) parser les nouvelles valeurs
        const newElements = dto.elements ?? [];
        const newReferences = dto.references ?? [];
        const newResources = dto.generatedResources ?? [];

        // 3) fusionner avec l’existant
        const merged = {
            elementsJson: existing ? [...existing.elementsJson as any[], ...newElements] : newElements,
            referencesJson: existing ? [...(existing.referencesJson as any[] ?? []), ...newReferences] : newReferences,
            generatedResourcesJson: existing ? [...(existing.generatedResourcesJson as any[] ?? []), ...newResources] : newResources,
        };

        const updated = await this.prisma.fileAction.upsert({
            where: {
                pdfFileId_pageIndex: {
                    pdfFileId,
                    pageIndex: dto.pageIndex,
                },
            },
            update: merged,
            create: {
                pdfFileId,
                pageIndex: dto.pageIndex,
                ...merged,
            },
        });

        // 4) Upsert final avec données fusionnées
        return updated;
    }

    /**
     * Crée ou met à jour une FileAction (1 par pageIndex)
     */
    async post(pdfFileId: string, dto: CreateFileActionDto) {
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
            return (retryAsync(() => (
                this.prisma.fileAction.upsert({
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
                })
            )));
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
