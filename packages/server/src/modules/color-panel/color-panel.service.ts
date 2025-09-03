import {
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma";

import { CreateColorPanelDto, UpdateColorPanelDto } from "./dto";

@Injectable()
export class ColorPanelService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateColorPanelDto) {
        return this.prisma.colorPanel.create({
            data: {
                ...dto,
                userId,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.colorPanel.findMany({
            where: { userId },
            orderBy: { name: "asc" },
        });
    }

    async findOne(userId: string, id: string) {
        const colorPanel = await this.prisma.colorPanel.findUnique({ where: { id } });
        if (!colorPanel || colorPanel.userId !== userId) {
            throw new NotFoundException();
        }
        return colorPanel;
    }

    async update(userId: string, id: string, dto: UpdateColorPanelDto) {
        await this.findOne(userId, id); // vérifie ownership
        return this.prisma.colorPanel.update({
            where: { id },
            data: dto,
        });
    }

    async remove(userId: string, id: string) {
        await this.findOne(userId, id); // vérifie ownership
        return this.prisma.colorPanel.delete({ where: { id } });
    }
}
