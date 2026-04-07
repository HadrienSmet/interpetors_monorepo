import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma";
import { TranslateService } from "../translate";

import { CreateWorkspaceDto, UpdateWorkspaceDto } from "./dto";

@Injectable()
export class WorkspaceService {
    constructor(private prisma: PrismaService, private translateService: TranslateService) { }

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
			include: {
				_count: {
					select: {
						preparations: true,
						vocabularyTerms: true,
					},
				},
			},
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
		const existingWorkspace = await this.prisma.workspace.findUnique({ where: { id } });

		if (!existingWorkspace) {
			throw new NotFoundException();
		}

		const previousLanguages = Array.isArray(existingWorkspace.languages)
			? existingWorkspace.languages as string[]
			: [];
		const nextLanguages = Array.isArray(dto.languages)
			? dto.languages
			: previousLanguages;

		const { addedLanguages, removedLanguages } = this.getLanguagesDiff(previousLanguages, nextLanguages);

		const data = {
			languages: dto.languages,
			name: dto.name,
			nativeLanguage: dto.nativeLanguage,
		};
		const updatedWorkspace = await this.prisma.workspace.update({
			where: { id },
			data,
		});

		if (removedLanguages.length > 0) {
			await this.removeTranslationsForRemovedWorkspaceLanguages(id, removedLanguages);
		}

		if (addedLanguages.length > 0) {
			await this.addTranslationsForNewWorkspaceLanguages(id, addedLanguages);
		}

		return updatedWorkspace;
	}

    async remove(id: string) {
        return this.prisma.workspace.delete({ where: { id } });
    }

	private getLanguagesDiff(
		previousLanguages: string[],
		nextLanguages: string[],
	) {
		const previousSet = new Set(previousLanguages);
		const nextSet = new Set(nextLanguages);

		const addedLanguages = nextLanguages.filter((lang) => !previousSet.has(lang));
		const removedLanguages = previousLanguages.filter((lang) => !nextSet.has(lang));

		return {
			addedLanguages,
			removedLanguages,
		};
	}

	private async removeTranslationsForRemovedWorkspaceLanguages(
		workspaceId: string,
		removedLanguages: string[],
	) {
		const workspaceTerms = await this.prisma.workspaceVocabularyTerm.findMany({
			where: { workspaceId },
			select: {
				termId: true,
				term: {
					select: {
						id: true,
						translations: true,
					},
				},
			},
		});

		for (const item of workspaceTerms) {
			const currentTranslations = this.asTranslationRecord(item.term.translations);

			let hasChanged = false;
			const nextTranslations = { ...currentTranslations };

			for (const language of removedLanguages) {
				if (language in nextTranslations) {
					delete nextTranslations[language];
					hasChanged = true;
				}
			}

			if (!hasChanged) {
				continue;
			}

			await this.prisma.vocabularyTerm.update({
				where: { id: item.term.id },
				data: { translations: nextTranslations },
			});
		}
	}

	private async addTranslationsForNewWorkspaceLanguages(
		workspaceId: string,
		addedLanguages: string[],
	) {
		const workspaceTerms = await this.prisma.workspaceVocabularyTerm.findMany({
			where: { workspaceId },
			select: {
				termId: true,
				term: {
					select: {
						id: true,
						translations: true,
						occurrences: {
							orderBy: { createdAt: "asc" },
							take: 1,
							select: {
								text: true,
								language: true,
							},
						},
					},
				},
			},
		});

		await Promise.all(
			workspaceTerms.map(async (item) => {
				const occurrence = item.term.occurrences[0];
				if (!occurrence) return;

				const currentTranslations = this.asTranslationRecord(item.term.translations);

				const targets = addedLanguages
					.filter((lang) => lang !== occurrence.language)
					.filter((lang) => !currentTranslations[lang]);

				if (targets.length === 0) return;

				const newTranslations = await this.translateService.translate({
					text: currentTranslations[occurrence.language],
					origin: occurrence.language,
					targets,
				});

				await this.prisma.vocabularyTerm.update({
					where: { id: item.term.id },
					data: {
						translations: {
							...currentTranslations,
							...newTranslations,
						},
					},
				});
			})
		);
	}

	private asTranslationRecord(json: unknown): Record<string, string> {
		if (!json || typeof json !== "object" || Array.isArray(json)) {
			return {};
		}

		const output: Record<string, string> = {};

		for (const [key, value] of Object.entries(json)) {
			if (typeof key === "string" && typeof value === "string") {
				output[key] = value;
			}
		}

		return (output);
	}
}
