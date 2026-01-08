import { ChangeEvent, useState } from "react";

import { useLocaleNavigate } from "@/modules/router";
import { CreateWorkspaceParams, useWorkspaces } from "@/modules/workspace";

const EMPTY_WORKSPACE: CreateWorkspaceParams = {
    name: "Default",
    languages: [],
    nativeLanguage: "",
};
export const creationSteps = [
    "WORK",
    "NATIVE",
] as const;
export type CreationStep = typeof creationSteps[number];

export const useWorkSpaceCreator = () => {
    const [creationStep, setCreationStep] = useState<CreationStep>(creationSteps[0]);
    const [isPending, setIsPending] = useState(false);
    const [workspace, setWorkspace] = useState<CreateWorkspaceParams>({ ...EMPTY_WORKSPACE });

    const navigate = useLocaleNavigate();
    const { addNewWorkspace } = useWorkspaces();

    const handleNativeLanguage = (nativeLanguage: string) => setWorkspace(state => ({
        ...state,
        nativeLanguage,
    }));
    const handleTitle = (e: ChangeEvent<HTMLInputElement>) => setWorkspace(state => ({
        ...state,
        name: e.target.value,
    }));
    const nextStep = async () => {
        const currentStepIndex = creationSteps.findIndex(step => step === creationStep);
        if (currentStepIndex === (creationSteps.length - 1)) {
            setIsPending(true);
            const res = await addNewWorkspace(workspace);
            setIsPending(false);

            if (res) navigate("/");

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
        isPending,
        nextStep,
        pushLanguage,
        removeLanguage,
        workspace,
    });
};
