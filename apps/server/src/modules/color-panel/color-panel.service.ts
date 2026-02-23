import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";

import { PrismaService } from "../prisma";

import { CreateColorPanelDto, UpdateColorPanelDto } from "./dto";

@Injectable()
export class ColorPanelService {
    constructor(private prisma: PrismaService) { }

    private async getOwnedPanelOrThrow(userId: string, id: string) {
        const panel = await this.prisma.colorPanel.findFirst({
            where: { id, userId },
            include: { colors: { orderBy: { name: "asc" } } },
        });

        if (!panel) throw new NotFoundException();

        return (panel);
    }

    async create(userId: string, dto: CreateColorPanelDto) {
        const panel = await this.prisma.colorPanel.create({
            data: {
                name: dto.name,
                userId,
                colors: {
                    create: dto.colors.map(c => ({
                        name: c.name,
                        value: c.value,
                    })),
                },
            },
            include: { colors: { orderBy: { name: "asc" } } },
        });

        return (panel);
    }

    async findAll(userId: string) {
        const panels = await this.prisma.colorPanel.findMany({
            where: { userId },
            orderBy: { name: "asc" },
            include: { colors: { orderBy: { name: "asc" } } },
        });

        return (panels);
    }

    async findOne(userId: string, id: string) {
        return (this.getOwnedPanelOrThrow(userId, id));
    }

    async update(userId: string, id: string, dto: UpdateColorPanelDto) {
        // 1) Checks the ownership + retrieving existing
        const panel = await this.getOwnedPanelOrThrow(userId, id);

        // 2) Splits colors to create and colors to update
        const toCreate = (dto.colors ?? []).filter(c => !c.id);
        const toUpdate = (dto.colors ?? []).filter(c => !!c.id);

        // 3) Security => Ensuring that each colors to update belongs to color panel
        if (toUpdate.length > 0) {
            const ids = toUpdate.map(c => c.id!) as string[];
            const owned = await this.prisma.colorSwatch.findMany({
                where: { id: { in: ids }, panelId: panel.id },
                select: { id: true },
            });
            const ownedIds = new Set(owned.map(o => o.id));
            const notOwned = ids.filter(x => !ownedIds.has(x));
            if (notOwned.length) {
                throw new BadRequestException(
                    `Some color ids do not belong to this panel: ${notOwned.join(", ")}`
                );
            }
        }

        // 4) Transaction : updating name + creations + updates
        await this.prisma.$transaction(async tx => {
            if (typeof dto.name !== "undefined") {
                await tx.colorPanel.update({
                    where: { id: panel.id },
                    data: { name: dto.name },
                });
            }

            if (toCreate.length > 0) {
                await tx.colorSwatch.createMany({
                    data: toCreate.map(c => ({
                        name: c.name,
                        value: c.value,
                        panelId: panel.id,
                    })),
                });
            }

            for (const c of toUpdate) {
                await tx.colorSwatch.update({
                    where: { id: c.id! },
                    data: {
                        name: c.name,
                        value: c.value,
                    },
                });
            }
        });

        // 5) Returns updated state
        const updated = await this.prisma.colorPanel.findFirst({
            where: { id, userId },
            include: { colors: { orderBy: { name: "asc" } } },
        });
        if (!updated) throw new NotFoundException(); // Just for safety

        return (updated);
    }

    async remove(userId: string, id: string) {
        // Checking ownership
        await this.getOwnedPanelOrThrow(userId, id);

        // Removing color swatches first
        await this.prisma.$transaction([
            this.prisma.colorSwatch.deleteMany({ where: { panelId: id } }),
            this.prisma.colorPanel.delete({ where: { id } }),
        ]);

        return ({ id });
    }
}
