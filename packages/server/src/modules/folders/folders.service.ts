import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma";

import { CreateFolderDto, RenameFolderDto } from "./dto";

@Injectable()
export class FoldersService {
    constructor(private readonly prisma: PrismaService) { }

    private async assertWorkspaceAndPreparation(workspaceId: string, preparationId: string) {
        const prep = await this.prisma.preparation.findUnique({
            where: { id: preparationId },
            select: { id: true, workspaceId: true },
        });

        if (!prep) throw new NotFoundException(`Preparation ${preparationId} not found`);
        if (prep.workspaceId !== workspaceId) {
            throw new BadRequestException(
                `Preparation ${preparationId} does not belong to workspace ${workspaceId}`,
            );
        }
    }

    /** Crée un dossier (optionnellement enfant d'un parent) */
    async create(
        workspaceId: string,
        preparationId: string,
        dto: CreateFolderDto,
    ) {
        await this.assertWorkspaceAndPreparation(workspaceId, preparationId);

        const name = dto.name.trim();
        if (!name) throw new BadRequestException("name is required");

        let parentId: string | undefined = dto.parentId;
        if (parentId) {
            const parent = await this.prisma.folder.findUnique({
                where: { id: parentId },
                select: { id: true, preparationId: true },
            });

            if (!parent) throw new NotFoundException(`Parent folder ${parentId} not found`);
            if (parent.preparationId !== preparationId) {
                throw new BadRequestException("Parent folder belongs to a different preparation");
            }
        }

        // (Optionnel) Empêcher les doublons de nom au même niveau (même preparation + même parentId)
        const existing = await this.prisma.folder.findFirst({
            where: {
                preparationId,
                parentId: parentId ?? null,
                name: name,
            },
            select: { id: true },
        });

        if (existing) {
            throw new ConflictException("A folder with the same name already exists at this level");
        }

        const created = await this.prisma.folder.create({
            data: {
                name,
                preparation: { connect: { id: preparationId } },
                parent: parentId ? { connect: { id: parentId } } : undefined,
            },
            select: {
                id: true,
                name: true,
                preparationId: true,
                parentId: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return created;
    }

    /** Liste les dossiers d"une preparation. Si parentId est fourni, liste ses enfants, sinon les dossiers racine. */
    async list(
        workspaceId: string,
        preparationId: string,
        parentId?: string,
    ) {
        await this.assertWorkspaceAndPreparation(workspaceId, preparationId);

        if (parentId) {
            // vérifier parent
            const parent = await this.prisma.folder.findUnique({
                where: { id: parentId },
                select: { id: true, preparationId: true },
            });

            if (!parent) throw new NotFoundException(`Folder ${parentId} not found`);
            if (parent.preparationId !== preparationId) {
                throw new BadRequestException("Folder belongs to a different preparation");
            }
        }

        const rows = await this.prisma.folder.findMany({
            where: {
                preparationId,
                parentId: parentId ?? null,
            },
            select: {
                id: true,
                name: true,
                parentId: true,
                preparationId: true,
                createdAt: true,
                updatedAt: true,
                _count: { select: { children: true, files: true } },
            },
            orderBy: [{ name: "asc" }, { id: "asc" }],
        });

        return rows;
    }

    /** Renommer un dossier (et empêcher les doublons de nom au même niveau) */
    async rename(
        workspaceId: string,
        preparationId: string,
        folderId: string,
        dto: RenameFolderDto,
    ) {
        await this.assertWorkspaceAndPreparation(workspaceId, preparationId);

        const folder = await this.prisma.folder.findUnique({
            where: { id: folderId },
            select: { id: true, name: true, preparationId: true, parentId: true },
        });

        if (!folder) throw new NotFoundException(`Folder ${folderId} not found`);
        if (folder.preparationId !== preparationId) {
            throw new BadRequestException("Folder belongs to a different preparation");
        }

        const name = dto.name.trim();
        if (!name) throw new BadRequestException("name is required");

        // empêcher doublon sibling
        const conflict = await this.prisma.folder.findFirst({
            where: {
                preparationId,
                parentId: folder.parentId,
                name: name,
                NOT: { id: folderId },
            },
            select: { id: true },
        });

        if (conflict) {
            throw new ConflictException("A folder with the same name already exists at this level");
        }

        return this.prisma.folder.update({
            where: { id: folderId },
            data: { name },
            select: {
                id: true,
                name: true,
                parentId: true,
                preparationId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    /** Suppression simple (hard delete). Refuse si des enfants/fichiers existent, sauf si cascade gérée côté BD. */
    async remove(workspaceId: string, preparationId: string, folderId: string) {
        await this.assertWorkspaceAndPreparation(workspaceId, preparationId);

        const folder = await this.prisma.folder.findUnique({
            where: { id: folderId },
            include: { _count: { select: { children: true, files: true } } },
        });

        if (!folder) throw new NotFoundException(`Folder ${folderId} not found`);
        if (folder.preparationId !== preparationId) {
            throw new BadRequestException("Folder belongs to a different preparation");
        }

        if (folder._count.children > 0 || folder._count.files > 0) {
            throw new BadRequestException("Folder is not empty");
        }

        await this.prisma.folder.delete({ where: { id: folderId } });

        return { ok: true };
    }
}
