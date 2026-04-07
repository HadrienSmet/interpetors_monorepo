export type Workspace = {
    readonly colorPanelId: string | null;
    readonly id: string;
    readonly languages: Array<string>;
    readonly name: string;
    readonly nativeLanguage: string;
    readonly userId: string;
	readonly _count: {
		readonly preparations: number;
		readonly vocabularyTerms: number;
	}
};
