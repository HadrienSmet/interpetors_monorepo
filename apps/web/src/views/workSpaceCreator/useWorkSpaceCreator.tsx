import { ChangeEvent, useState } from "react";

import { useWorkSpaces, WorkSpace } from "@/contexts";

const EMPTY_WORKSPACE: WorkSpace = {
    colorPanel: null,
    id: -1,
    name: "Default",
    languages: {
        work: [],
        native: "",
    },
    vocabulary: {
        languages: [],
        translations: {},
    },
    preparations: [],
};
export const creationSteps = [
    "WORK",
    "NATIVE",
] as const;

export type WorkSpaceCreatorState = {
    readonly workSpace: WorkSpace;
    readonly currentStep: typeof creationSteps[number];
};
export const useWorkSpaceCreator = () => {
    const [workspaceCreatorState, setWorkSpaceCreatorState] = useState<WorkSpaceCreatorState>({
        workSpace: { ...EMPTY_WORKSPACE },
        currentStep: creationSteps[0],
    });
    const { addNewWorkSpace } = useWorkSpaces();

    const handleNativeLanguage = (language: string) => setWorkSpaceCreatorState(state => ({
        ...state,
        workSpace: {
            ...state.workSpace,
            languages: {
                ...state.workSpace.languages,
                native: language,
            },
        },
    }));
    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => setWorkSpaceCreatorState(state => ({
        ...state,
        workSpace: {
            ...state.workSpace,
            name: e.target.value,
        },
    }));
    const nextStep = () => {
        const currentStepIndex = creationSteps.findIndex(step => step === workspaceCreatorState.currentStep);
        if (currentStepIndex === (creationSteps.length - 1)) {
            addNewWorkSpace(workspaceCreatorState.workSpace);
            return;
        }

        setWorkSpaceCreatorState(state => ({
            ...state,
            currentStep: creationSteps[currentStepIndex + 1],
        }));
    };
    const pushWorkLanguage = (language: string) => setWorkSpaceCreatorState(state => ({
        ...state,
        workSpace: {
            ...state.workSpace,
            languages: {
                ...state.workSpace.languages,
                work: state.workSpace.languages.work.includes(language)
                    ? state.workSpace.languages.work
                    : [...state.workSpace.languages.work, language],
            },
        },
    }));
    const removeWorkLanguage = (languageToRemove: string) => setWorkSpaceCreatorState(state => ({
        ...state,
        workSpace: {
            ...state.workSpace,
            languages: {
                ...state.workSpace.languages,
                work: state.workSpace.languages.work.filter(language => language !== languageToRemove),
            },
        },
    }));

    return ({
        handleNativeLanguage,
        handleTitle,
        nextStep,
        pushWorkLanguage,
        removeWorkLanguage,
        workspaceCreatorState,
    });
};
