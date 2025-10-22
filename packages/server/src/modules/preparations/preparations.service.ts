import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../prisma";

import { CreatePreparationDto } from "./dto";

@Injectable()
export class PreparationsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(workspaceId: string, dto: CreatePreparationDto) {
        const title = dto.title?.trim();
        if (!title) {
            throw new BadRequestException("title is required");
        }

        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { id: true },
        });

        if (!workspace) {
            throw new NotFoundException(`Workspace ${workspaceId} not found`);
        }

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
}
