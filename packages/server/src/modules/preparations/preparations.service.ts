import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma";

import { CreatePreparationDto } from "./dto";

@Injectable()
export class PreparationsService {
    constructor(private readonly prisma: PrismaService) { }
    async assertPreparation(preparationId: string) {
        const preparation = await this.prisma.preparation.findUnique({
            where: { id: preparationId },
            select: { id: true },
        });
        if (!preparation) {
            throw new NotFoundException(`Preparation ${preparationId} not found`);
        }
    }
    assertTitle(dto: CreatePreparationDto) {
        const title = dto.title?.trim();
        if (!title) {
            throw new BadRequestException("title is required");
        }
        return title;
    }
    async assertWorkspace(workspaceId: string) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { id: true },
        });
        if (!workspace) {
            throw new NotFoundException(`Workspace ${workspaceId} not found`);
        }
    }
    async create(workspaceId: string, dto: CreatePreparationDto) {
        const title = this.assertTitle(dto);
        await this.assertWorkspace(workspaceId);

        try {
            const preparation = await this.prisma.preparation.create({
                data: {
                    title,
                    workspace: { connect: { id: workspaceId } },
                },
                select: {
                    id: true,
                    title: true,
                    workspaceId: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });

            return preparation;
        } catch (err) {
            // Sécurise le retour d’erreurs Prisma pour ne pas exposer de détails
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                // P2003 = violation de contrainte FK (au cas où on retire la vérif ci-dessus)
                if (err.code === "P2003") {
                    throw new NotFoundException(`Workspace ${workspaceId} not found`);
                }
            }
            throw err;
        }
    }

    /** Retourne toutes les préparations d’un workspace */
    async listByWorkspace(workspaceId: string) {
        // Vérifie que le workspace existe
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { id: true },
        });

        if (!workspace) {
            throw new NotFoundException(`Workspace ${workspaceId} not found`);
        }

        // Récupère les préparations
        const preparations = await this.prisma.preparation.findMany({
            where: { workspaceId },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true,
                // optionnel: renvoyer un comptage ou aperçu
                _count: {
                    select: {
                        pdfFiles: true,
                        vocabularyTerms: true,
                    },
                },
            },
        });

        return preparations;
    }

    async patch(workspaceId: string, preparationId: string, dto: CreatePreparationDto) {
        await this.assertWorkspace(workspaceId);
        await this.assertPreparation(preparationId);

        const title = this.assertTitle(dto);

        try {
            const patched = this.prisma.preparation.update({
                where: { id: preparationId },
                data: { title },
                select: {
                    id: true,
                    title: true,
                    workspaceId: true,
                },
            });

            return (patched);
        }
        catch (error) {
            throw error;
        }
    }
}
