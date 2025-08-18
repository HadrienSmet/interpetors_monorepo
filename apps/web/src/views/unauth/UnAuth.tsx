import { ChangeEvent, RefObject, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Input, SecureInput } from "@/components";
import { UnAuthLayout } from "@/layout";
import { AUTH_STORAGE_KEY, REFRESH_STORAGE_KEY, useAuth } from "@/modules";
import { AUTH } from "@/services";

import "./unauth.scss";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

type UnAuthFormParams = {
    readonly email: string;
    readonly emailRef: RefObject<HTMLInputElement | null>;
    readonly errorMessage: string | undefined;
    readonly isEmailValid?: boolean | null;
    readonly isPasswordValid?: boolean | null;
    readonly onEmailBlur?: () => void;
    readonly onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    readonly onPasswordBlur?: () => void;
    readonly onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
    readonly onSubmit: () => void;
    readonly password: string;
    readonly passwordRef: RefObject<HTMLInputElement | null>;
    readonly submitLabel: string;
    readonly title: string;
}
const UnAuthForm = (props: UnAuthFormParams) => {
    const { i18n, t } = useTranslation();

    const passwordConditions = useMemo(() => {
        const output: Array<string> = [];

        for (let i = 0; i < 5; i++) {
            output.push(t(`auth.password.requirements.conditions.${i}`))
        }

        return (output);
    }, [i18n.language]);

    return (
        <div className="unauth-form">
            <h2>{props.title}</h2>
            <div className="unauth-input">
                <label htmlFor="email">{t("auth.email.label")}</label>
                <Input
                    id="email"
                    name="email"
                    onBlur={props.onEmailBlur}
                    onChange={props.onEmailChange}
                    placeholder={t("auth.email.placeholder")}
                    ref={props.emailRef}
                    type="text"
                    value={props.email}
                />
                {props.isEmailValid === false && (
                    <p>{t("auth.email.requirements.main")}</p>
                )}
            </div>
            <div className="unauth-input">
                <label htmlFor="password">{t("auth.password.label")}</label>
                <SecureInput
                    id="password"
                    name="password"
                    onBlur={props.onPasswordBlur}
                    onChange={props.onPasswordChange}
                    placeholder={t("auth.password.placeholder")}
                    ref={props.passwordRef}
                    value={props.password}
                />
                {props.isPasswordValid === false && (
                    <>
                        <p>{t("auth.password.requirements.main")}</p>
                        <ul>
                            {passwordConditions.map((condition, i) => (
                                <li key={`condition-${i}`}>{condition}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
            <Button
                label={props.submitLabel}
                onClick={props.onSubmit}
            />
            {props.errorMessage && (
                <p className="error-msg">{t(`auth.errors.${props.errorMessage}`)}</p>
            )}
        </div>
    );
};

const Signin = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState("");

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { signin } = useAuth();
    const { t } = useTranslation();

    const onClick = async () => {
        setErrorMessage(undefined)
        if (email === "") {
            emailRef.current?.focus();
            return;
        }
        if (password === "") {
            passwordRef.current?.focus();
            return;
        }

        const response = await AUTH.signin({ email, password });

        if (!response.ok) {
            const errorMsg = await response.text();
            const parsed = JSON.parse(errorMsg);

            setErrorMessage(parsed.message);
            return;
        }

        const text = await response.text();
        const tokens = JSON.parse(text);

        if (
            "access_token" in tokens &&
            "refresh_token" in tokens
        ) {
            localStorage.setItem(AUTH_STORAGE_KEY, tokens.access_token);
            localStorage.setItem(REFRESH_STORAGE_KEY, tokens.refresh_token);

            signin();
        }
    };

    return (
        <UnAuthForm
            email={email}
            emailRef={emailRef}
            errorMessage={errorMessage}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={onClick}
            password={password}
            passwordRef={passwordRef}
            submitLabel={t("auth.signingIn")}
            title={t("auth.signin")}
        />
    );
};

const Signup = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { signin } = useAuth();
    const { t } = useTranslation();

    const onClick = async () => {
        setErrorMessage(undefined);
        if (!isEmailValid) {
            emailRef.current?.focus();
            return;
        }
        if (!isPasswordValid) {
            passwordRef.current?.focus();
            return;
        }

        const response = await AUTH.signup({ email, password });

        if (!response.ok) {
            const errorMsg = await response.text();
            const parsed = JSON.parse(errorMsg);

            setErrorMessage(parsed.message);
            return;
        }

        const text = await response.text();
        const tokens = JSON.parse(text);

        if (
            "access_token" in tokens &&
            "refresh_token" in tokens
        ) {
            localStorage.setItem(AUTH_STORAGE_KEY, tokens.access_token);
            localStorage.setItem(REFRESH_STORAGE_KEY, tokens.refresh_token);

            signin();
        }
    };
    const onEmailBlur = () => {
        if (email.match(EMAIL_REGEX)) {
            setIsEmailValid(true);
            return;
        }

        setIsEmailValid(false);
    };
    const onPasswordBlur = () => {
        if (password.match(PWD_REGEX)) {
            setIsPasswordValid(true);
            return;
        }

        setIsPasswordValid(false);
    };

    return (
        <UnAuthForm
            email={email}
            emailRef={emailRef}
            errorMessage={errorMessage}
            isEmailValid={isEmailValid}
            isPasswordValid={isPasswordValid}
            onEmailBlur={onEmailBlur}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordBlur={onPasswordBlur}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={onClick}
            password={password}
            passwordRef={passwordRef}
            submitLabel={t("auth.signingUp")}
            title={t("auth.signup")}
        />
    );
};
export const UnAuthScreen = () => {
    const [isSigningIn, setIsSigningIn] = useState(true);

    const { t } = useTranslation();

    const toggleState = () => setIsSigningIn(state => !state);

    return (
        <UnAuthLayout>
            {isSigningIn
                ? <Signin />
                : <Signup />
            }
            <button
                className="unauth-toggler"
                onClick={toggleState}
            >
                <span>{isSigningIn
                    ? t("auth.toSignup")
                    : t("auth.toSignin")
                }</span>
            </button>
        </UnAuthLayout>
    );
};
