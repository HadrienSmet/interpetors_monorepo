import { useRef, useState } from "react";

import { Button, Input, SecureInput } from "@/components";
import { UnAuthLayout } from "@/layout";
import { signin, signup } from "@/services";

import "./unauth.scss";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const onClick = async () => {
        if (email === "") {
            emailRef.current?.focus();
            return;
        }
        if (password === "") {
            passwordRef.current?.focus();
            return;
        }

        const response = await signin({
            email,
            password
        });

        // if (response.ok) {

        // }
    };

    return (
        <div className="unauth-form">
            <h2>Sign in</h2>
            <div className="unauth-input">
                <label htmlFor="email">Email</label>
                <Input
                    id="email"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    ref={emailRef}
                    type="text"
                    value={email}
                />
            </div>
            <div className="unauth-input">
                <label htmlFor="password">Password</label>
                <SecureInput
                    id="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    ref={passwordRef}
                    value={password}
                />
            </div>
            <Button
                label="Sign in"
                onClick={onClick}
            />
        </div>
    );
};

const Signup = () => {
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const onClick = async () => {
        if (!isEmailValid) {
            emailRef.current?.focus();
            return;
        }
        if (!isPasswordValid) {
            passwordRef.current?.focus();
            return;
        }

        await signup({
            email,
            password
        });
    };
    const onEmailBlur = () => {
        if (email.match(EMAIL_REGEX)) {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }
    };
    const onPasswordBlur = () => {
        if (password.match(PWD_REGEX)) {
            setIsPasswordValid(true);
        } else {
            setIsPasswordValid(false);
        }
    };

    return (
        <div className="unauth-form">
            <h2>Sign up</h2>
            <div className="unauth-input">
                <label htmlFor="email">Email</label>
                <Input
                    id="email"
                    name="email"
                    onBlur={onEmailBlur}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    ref={emailRef}
                    type="text"
                    value={email}
                />
                {isEmailValid === false && (
                    <p>Email must be a valid email</p>
                )}
            </div>
            <div className="unauth-input">
                <label htmlFor="password">Password</label>
                <SecureInput
                    id="password"
                    name="password"
                    onBlur={onPasswordBlur}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    ref={passwordRef}
                    value={password}
                />
                {isPasswordValid === false && (
                    <>
                        <p>A valid password requires:</p>
                        <ul>
                            <li>Minimum 8 characters</li>
                            <li>Minimum 1 lowercase</li>
                            <li>Minimum 1 uppercase</li>
                            <li>Minimum 1 digits</li>
                            <li>Minimum 1 symbol</li>
                        </ul>
                    </>
                )}
            </div>
            <Button
                label="Sign up"
                onClick={onClick}
            />
        </div>
    );
};
export const UnAuthScreen = () => {
    const [isSigningIn, setIsSigningIn] = useState(true);

    const toggleState = () => setIsSigningIn(state => !state);

    return (
        <UnAuthLayout>
            {isSigningIn
                ? <Signin />
                : <Signup />
            }
            <div
                className="unauth-toggler"
                onClick={toggleState}
            >
                <span>{isSigningIn
                    ? "Create my account"
                    : "I have already an account"
                }</span>
            </div>
        </UnAuthLayout>
    );
};
