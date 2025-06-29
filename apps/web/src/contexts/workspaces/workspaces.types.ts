export type FilesRecord = Record<string, string | { [key: string]: string }>;
export type Preparation = {
    readonly customColor?: string;
    readonly files: FilesRecord;
    readonly id: string;
    // readonly notes: Array<any>;
    readonly title: string;
    // readonly vocabulary: Vocabulary;
};
export type Vocabulary = {
    readonly languages: Array<string>;
    // TODO: Need to add the occurences
    readonly translations: Record<string, Array<string>>;
};
export type WorkSpace = {
    readonly colorPanel: string | null;
    readonly id: number;
    readonly languages: {
        readonly work: Array<string>;
        readonly native: string;
    };
    readonly name: string;
    readonly preparations: Array<Preparation>;
    readonly vocabulary: Vocabulary;
};

export type WorkSpacesState = {
    readonly currentWorkSpaceId: number;
    readonly workSpaces: Record<number, WorkSpace>;
};
export type WorkSpacesContextType = {
    readonly addNewWorkSpace: (workSpace: WorkSpace) => void;
    readonly changeWorkSpace: (id: number) => void;
    readonly currentWorkSpace: WorkSpace | null;
    readonly editWorkSpace: (workSpace: WorkSpace) => void;
    readonly removeWorkSpace: (id: number) => void;
    readonly workSpaces: Record<number, WorkSpace>;
};
