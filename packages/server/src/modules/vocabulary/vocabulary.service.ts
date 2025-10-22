import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Prisma, VocabularyTerm } from "@prisma/client";

import { PrismaService } from "../prisma";

import { CreateVocabularyTermDto, UpsertVocabularyTermDto } from "./dto";

type SlimTerm = Pick<VocabularyTerm, "id" | "translations" | "colorJson" | "createdAt" | "updatedAt"> & {
    readonly workspaceId: string;
    readonly preparationId: string;
};

@Injectable()
export class VocabularyService {
    constructor(private readonly prisma: PrismaService) { }

    /** Vérifie que le workspace & la preparation existent et sont cohérents */
    private async assertWorkspaceAndPreparation(workspaceId: string, preparationId: string) {
        const prep = await this.prisma.preparation.findUnique({
            where: { id: preparationId },
            select: { id: true, workspaceId: true },
        });

        if (!prep) throw new NotFoundException(`Preparation ${preparationId} not found`);
        if (prep.workspaceId !== workspaceId) {
            throw new BadRequestException(`Preparation ${preparationId} does not belong to workspace ${workspaceId}`);
        }

        // Optionnel: vérifier existence workspace explicitement
        const ws = await this.prisma.workspace.findUnique({ where: { id: workspaceId }, select: { id: true } });
        if (!ws) throw new NotFoundException(`Workspace ${workspaceId} not found`);
    }

    /** Liste des termes liés à une préparation */
    async listForPreparation(workspaceId: string, preparationId: string) {
        await this.assertWorkspaceAndPreparation(workspaceId, preparationId);

        const rows = await this.prisma.preparationVocabularyTerm.findMany({
            where: { preparationId },
            include: {
                term: {
                    select: {
                        id: true,
                        colorJson: true,
                        translations: true,
                        createdAt: false,
                        updatedAt: false,
                    },
                },
            },
            orderBy: { termId: "asc" },
        });

        return rows.map((r) => ({
            ...r.term,
            workspaceId,
            preparationId,
        }));
    }

    /** Création unitaire: crée OU relie un terme puis l"attache à la préparation + au workspace */
    async createOne(workspaceId: string, preparationId: string, dto: UpsertVocabularyTermDto): Promise<SlimTerm> {
        await this.assertWorkspaceAndPreparation(workspaceId, preparationId);

        const translations = dedupeTranslations(dto.translations);
        if (translations.length === 0) throw new BadRequestException("translations must not be empty");

        return this.prisma.$transaction(async (tx) => {
            // 1) Créer ou récupérer le term
            const term = await upsertTerm(tx, dto);

            // 2) Lier au workspace (idempotent)
            await tx.workspaceVocabularyTerm.upsert({
                where: {
                    workspaceId_termId: { workspaceId, termId: term.id },
                },
                update: {},
                create: { workspaceId, termId: term.id },
            });

            // 3) Lier à la préparation (idempotent)
            await tx.preparationVocabularyTerm.upsert({
                where: {
                    preparationId_termId: { preparationId, termId: term.id },
                },
                update: {},
                create: { preparationId, termId: term.id },
            });

            // 4) Retour "slim"
            const refreshed = await tx.vocabularyTerm.findUniqueOrThrow({
                where: { id: term.id },
                select: { id: true, translations: true, colorJson: true, createdAt: true, updatedAt: true },
            });

            return {
                ...refreshed,
                workspaceId,
                preparationId,
            };
        });
    }

    /** Création/MAJ bulk atomique */
    async upsertBulk(
        workspaceId: string,
        preparationId: string,
        items: UpsertVocabularyTermDto[],
    ): Promise<SlimTerm[]> {
        await this.assertWorkspaceAndPreparation(workspaceId, preparationId);

        // dédoublonner côté payload (par termId si présent, sinon par signature de translations)
        const deduped = dedupePayload(items);

        if (deduped.length === 0) throw new BadRequestException("terms must not be empty");

        return this.prisma.$transaction(async (tx) => {
            const results: SlimTerm[] = [];

            for (const item of deduped) {
                const translations = dedupeTranslations(item.translations);
                if (translations.length === 0) {
                    throw new BadRequestException("Each term must have at least one translation");
                }

                const term = await upsertTerm(tx, { ...item, translations });

                // 4) Lier les occurrences (fichier + page)
                if (item.occurrence) {
                    const occurence = item.occurrence;
                    await tx.vocabularyOccurrence.upsert({
                        where: {
                            // clé composite si tu veux éviter les doublons
                            pdfFileId_pageIndex_termId: {
                                pdfFileId: occurence.pdfFileId,
                                pageIndex: occurence.pageIndex,
                                termId: term.id,
                            },
                        },
                        update: {
                            text: occurence.text,
                            filePath: occurence.filePath,
                        },
                        create: {
                            termId: term.id,
                            pdfFileId: occurence.pdfFileId,
                            pageIndex: occurence.pageIndex,
                            text: occurence.text,
                            filePath: occurence.filePath,
                        },
                    });

                }

                await tx.workspaceVocabularyTerm.upsert({
                    where: { workspaceId_termId: { workspaceId, termId: term.id } },
                    update: {},
                    create: { workspaceId, termId: term.id },
                });

                await tx.preparationVocabularyTerm.upsert({
                    where: { preparationId_termId: { preparationId, termId: term.id } },
                    update: {},
                    create: { preparationId, termId: term.id },
                });

                const refreshed = await tx.vocabularyTerm.findUniqueOrThrow({
                    where: { id: term.id },
                    select: { id: true, translations: true, colorJson: true, createdAt: true, updatedAt: true },
                });

                results.push({ ...refreshed, workspaceId, preparationId });
            }

            return results;
        });
    }

    /** Détache un terme d’une préparation (sans supprimer le terme global) */
    async detachFromPreparation(workspaceId: string, preparationId: string, termId: string) {
        await this.assertWorkspaceAndPreparation(workspaceId, preparationId);

        await this.prisma.preparationVocabularyTerm.delete({
            where: { preparationId_termId: { preparationId, termId } },
        });

        return { ok: true };
    }
}

/** Helpers **/

function dedupeTranslations(translations: string[]): string[] {
    const set = new Set(
        translations
            .map((t) => t?.trim())
            .filter((t): t is string => !!t)
            .map((t) => t.toLowerCase()),
    );
    // on renvoie en minuscule; si tu veux conserver la casse d"origine, stocke à part
    return Array.from(set);
}

function signatureFromItem(item: UpsertVocabularyTermDto): string | null {
    if (item.termId) return `id:${item.termId}`;
    const tr = dedupeTranslations(item.translations);
    if (tr.length === 0) return null;
    // signature simple basée sur translations + colorJson (optionnel)
    return `t:${tr.join("|")}|c:${JSON.stringify(item.colorJson ?? {})}`;
}

function dedupePayload(items: UpsertVocabularyTermDto[]): UpsertVocabularyTermDto[] {
    const seen = new Set<string>();
    const out: UpsertVocabularyTermDto[] = [];
    for (const it of items) {
        const sig = signatureFromItem(it);
        if (!sig) continue;
        if (seen.has(sig)) continue;
        seen.add(sig);
        out.push(it);
    }
    return out;
}

/** Upsert "terme" lui-même (hors liens) */
async function upsertTerm(
    tx: Prisma.TransactionClient,
    dto: UpsertVocabularyTermDto | CreateVocabularyTermDto,
) {
    // Si un termId est fourni on considère que c’est ce terme que l’on met à jour (pas d’unicité sur translations globalement)
    const translations = dedupeTranslations(dto.translations);
    if ("termId" in dto && dto.termId) {
        // Update minimal (ou no-op)
        return tx.vocabularyTerm.update({
            where: { id: dto.termId },
            data: {
                colorJson: dto.colorJson,
                translations,
            },
        }).catch((err) => {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
                throw new NotFoundException(`VocabularyTerm ${dto.termId} not found`);
            }
            throw err;
        });
    }

    // Création
    return tx.vocabularyTerm.create({
        data: {
            colorJson: dto.colorJson,
            translations,
        },
    });
}
