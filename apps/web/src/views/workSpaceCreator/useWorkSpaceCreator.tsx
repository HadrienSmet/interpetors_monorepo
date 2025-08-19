import { ChangeEvent, useState } from "react";

import { CreateWorkspaceParams, useWorkSpaces, Workspace } from "@/modules";

const EMPTY_WORKSPACE: CreateWorkspaceParams = {
    name: "Default",
    languages: [],
    nativeLanguage: "",
};
export const creationSteps = [
    "WORK",
    "NATIVE",
] as const;
export type CreationStep = typeof creationSteps[number]

export type WorkSpaceCreatorState = {
    readonly workSpace: Workspace;
    readonly currentStep: CreationStep;
};
export const useWorkSpaceCreator = () => {
    const [workspace, setWorkspace] = useState<CreateWorkspaceParams>({ ...EMPTY_WORKSPACE });
    const [creationStep, setCreationStep] = useState<CreationStep>(creationSteps[0]);

    const { addNewWorkspace } = useWorkSpaces();

    const handleNativeLanguage = (nativeLanguage: string) => setWorkspace(state => ({
        ...state,
        nativeLanguage,
    }));
    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => setWorkspace(state => ({
        ...state,
        name: e.target.value,
    }));
    const nextStep = () => {
        const currentStepIndex = creationSteps.findIndex(step => step === creationStep);
        if (currentStepIndex === (creationSteps.length - 1)) {
            addNewWorkspace(workspace);
            return;
        }

        setCreationStep(creationSteps[currentStepIndex + 1])
    };
    const pushLanguage = (language: string) => setWorkspace(state => ({
        ...state,
        languages: state.languages.length === 0
            ? [language]
            : [...state.languages, language],
    }));
    const removeLanguage = (languageToRemove: string) => setWorkspace(state => ({
        ...state,
        languages: state.languages.filter(language => language !== languageToRemove),
    }));

    return ({
        creationStep,
        handleNativeLanguage,
        handleTitle,
        nextStep,
        pushLanguage,
        removeLanguage,
        workspace,
    });
};
