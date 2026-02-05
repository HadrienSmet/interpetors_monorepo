import { ChangeEvent, KeyboardEvent, RefObject, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { Button, Input, SecureInput } from "@/components";
import { UnAuthLayout } from "@/layout";
import { AUTH, AuthTokens, useAuth } from "@/modules/auth";
import { useLocaleNavigate, useLocalePath } from "@/modules/router";
import { LOCAL_STORAGE } from "@/utils";

import "./unauth.scss";

const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

type UnAuthFormParams = {
    readonly email: string;
    readonly emailRef: RefObject<HTMLInputElement | null>;
    readonly errorMessage: string | undefined;
    readonly isEmailValid?: boolean | null;
    readonly isPasswordValid?: boolean | null;
    readonly isPending: boolean;
    readonly onEmailBlur?: () => void;
    readonly onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    readonly onPasswordBlur?: () => void;
    readonly onPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
    readonly onSubmit: () => void;
    readonly password: string;
    readonly passwordRef: RefObject<HTMLInputElement | null>;
    readonly submitLabel: string;
    readonly title: string;
};
const UnAuthForm = (props: UnAuthFormParams) => {
    const { i18n, t } = useTranslation();

    const passwordConditions = useMemo(() => {
        const output: Array<string> = [];

        for (let i = 0; i < 5; i++) {
            output.push(t(`auth.password.requirements.conditions.${i}`));
        }

        return (output);
    }, [i18n.language]);

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            props.onSubmit();
        }
    };

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
                    onKeyDown={onKeyDown}
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
                    onKeyDown={onKeyDown}
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
                isPending={props.isPending}
                label={props.submitLabel}
                onClick={props.onSubmit}
            />
            {props.errorMessage && (
                <p className="error-msg">{t(`auth.errors.${props.errorMessage}`)}</p>
            )}
        </div>
    );
};

const storeTokens = (tokens: AuthTokens) => {
    localStorage.setItem(LOCAL_STORAGE.cryptoSalt, tokens.user.cryptoSalt);
    localStorage.setItem(LOCAL_STORAGE.refresh, tokens.refresh_token);
    localStorage.setItem(LOCAL_STORAGE.token, tokens.access_token);
    localStorage.setItem(LOCAL_STORAGE.userId, tokens.user.id);
};

export const Signin = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [password, setPassword] = useState("");

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const auth = useAuth();
    const navigate = useLocaleNavigate();
    const localePath = useLocalePath();
    const { t } = useTranslation();

    const onClick = async () => {
        setErrorMessage(undefined);
        if (email === "") {
            emailRef.current?.focus();
            return;
        }
        if (password === "") {
            passwordRef.current?.focus();
            return;
        }

        setIsSigningIn(true);
        const response = await AUTH.signin({ email, password });

        if (!response.success) {
            setIsSigningIn(false);
            setErrorMessage(response.message);
            return;
        }

        const tokens = response.data;
        storeTokens(tokens);

        await auth.signin(password);
        setIsSigningIn(false);
        navigate("/");
    };

    return (
        <UnAuthLayout>
            <UnAuthForm
                email={email}
                emailRef={emailRef}
                errorMessage={errorMessage}
                isPending={isSigningIn}
                onEmailChange={(e) => setEmail(e.target.value)}
                onPasswordChange={(e) => setPassword(e.target.value)}
                onSubmit={onClick}
                password={password}
                passwordRef={passwordRef}
                submitLabel={t("auth.signingIn")}
                title={t("auth.signin")}
            />
            <Link
                className="unauth-toggler"
                to={localePath("signup")}
            >
                <span>{t("auth.toSignup")}</span>
            </Link>
        </UnAuthLayout>
    );
};

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [password, setPassword] = useState("");

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { signin } = useAuth();
    const navigate = useLocaleNavigate();
    const localePath = useLocalePath();
    const { t } = useTranslation();

    const onSubmit = async () => {
        setErrorMessage(undefined);
        if (!isEmailValid) {
            emailRef.current?.focus();
            return;
        }
        if (!isPasswordValid) {
            passwordRef.current?.focus();
            return;
        }

        setIsSigningUp(true);
        const response = await AUTH.signup({ email, password });

        if (!response.success) {
            setIsSigningUp(false);
            setErrorMessage(response.message);
            return;
        }

        const tokens = response.data;
        storeTokens(tokens);

        await signin(password);
        setIsSigningUp(false);
        navigate("/");
    };
    const onEmailBlur = () => {
        if (EMAIL_REGEX.exec(email)) {
            setIsEmailValid(true);
            return;
        }

        setIsEmailValid(false);
    };
    const onPasswordBlur = () => {
        if (PWD_REGEX.exec(password)) {
            setIsPasswordValid(true);
            return;
        }

        setIsPasswordValid(false);
    };

    return (
        <UnAuthLayout>
            <UnAuthForm
                email={email}
                emailRef={emailRef}
                errorMessage={errorMessage}
                isEmailValid={isEmailValid}
                isPasswordValid={isPasswordValid}
                isPending={isSigningUp}
                onEmailBlur={onEmailBlur}
                onEmailChange={(e) => setEmail(e.target.value)}
                onPasswordBlur={onPasswordBlur}
                onPasswordChange={(e) => setPassword(e.target.value)}
                onSubmit={onSubmit}
                password={password}
                passwordRef={passwordRef}
                submitLabel={t("auth.signingUp")}
                title={t("auth.signup")}
            />
            <Link
                className="unauth-toggler"
                to={localePath("signin")}
            >
                <span>{t("auth.toSignin")}</span>
            </Link>
        </UnAuthLayout>
    );
};
