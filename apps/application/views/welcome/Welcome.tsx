import { useCallback, useMemo, useRef, useState } from "react";
import { Stack } from "expo-router";

import { TextInputRef } from "@/components/ui";
import { MainLayout, MainLayoutProps } from "@/layouts";

import { Content, Header } from "./sections";


type FormState = {
    readonly isLoading : boolean;
    readonly errorMessageKeys: {
        readonly email: string | null;
        readonly password: string | null;
    };
    
    readonly errorMessageKey?: string;
};
type ErrorMessageKeys = keyof FormState["errorMessageKeys"];

export const Welcome = () => {
    const [formState, setFormState] = useState<FormState>({
        isLoading: false,
        errorMessageKeys: {
            email: null,
            password: null,
        },
    });
    
    const emailRef = useRef<TextInputRef>(null);
    const passwordRef = useRef<TextInputRef>(null);

    const handleErrorMessage = (inputKey: ErrorMessageKeys, remove: boolean) => setFormState(state => ({
        ...state,
        errorMessageKeys: {
            ...state.errorMessageKeys,
            [inputKey]: remove 
                ? null
                : `views.welcome.errorMessages.${inputKey}`,
        },
    }));
    const handleLoading = (isLoading: boolean) => setFormState(state => ({ ...state, isLoading }));

    const onSubmit = useCallback(async () => {
        if (!emailRef.current || !passwordRef.current) {
            console.error("[REF ERROR]: emailRef or passwordRef has not been linked to inputs yet")
            return;
        }

        const emailValue = emailRef.current.getValue();
        const passwordValue = passwordRef.current.getValue();

        // Handling the errorMessages
        if (!emailValue) {
            handleErrorMessage("email", false);
        } else {
            handleErrorMessage("email", true);
        }
        if (!passwordValue) {
            handleErrorMessage("password", false);
        } else {
            handleErrorMessage("password", true);
        }

        // Handling the input focus
        if (!emailValue) {
            emailRef.current.focus();
            return;
        }
        if (!passwordValue) {
            passwordRef.current.focus();
            return;
        }
        
        // Authenticating user
        handleLoading(true);
        console.log({ emailValue, passwordValue })
        handleLoading(false);
    }, []);

    const layoutProps = useMemo((): MainLayoutProps => ({
        sections: {
            ratio: [3, 2],
            first: {
                element: (
                    <Header 
                        email={{
                            ref: emailRef, 
                            errorMessage: formState.errorMessageKeys.email,
                        }} 
                        password={{
                            ref: passwordRef,
                            errorMessage: formState.errorMessageKeys.password,
                        }} 
                    />
                ),
            },
            scd: {
                element: (<Content isLoading={formState.isLoading} onSubmit={onSubmit} />),
            },
        },
        separatorVH: 0.07,
    }), [formState.isLoading, formState.errorMessageKeys.email, formState.errorMessageKeys.password]);

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Authentication",
                    header: () => null,
                }}
            />
            <MainLayout {...layoutProps} />
        </>
    );
};
