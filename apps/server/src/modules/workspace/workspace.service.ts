import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma";

import { CreateWorkspaceDto, UpdateWorkspaceDto } from "./dto";

@Injectable()
export class WorkspaceService {
    constructor(private prisma: PrismaService) { }

    create(userId: string, dto: CreateWorkspaceDto) {
        return this.prisma.workspace.create({
            data: {
                ...dto,
                userId,
            },
        });
    }

    findAll(userId: string) {
        return this.prisma.workspace.findMany({
            where: { userId },
        });
    }

    async findOne(userId: string, id: string) {
        const workspace = await this.prisma.workspace.findUnique({ where: { id } });
        if (!workspace || workspace.userId !== userId) {
            throw new NotFoundException();
        }

        return workspace;
    }

    async update(id: string, dto: UpdateWorkspaceDto) {
        return this.prisma.workspace.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.workspace.delete({ where: { id } });
    }
}
