import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { DEFAULT_LOCALE } from "@/i18n/languages";
import { Layout } from "@/layout";
import {
    Dictionary,
    Home,
    NotFound,
    Preparations,
    Signin,
    Signup,
    WorkspaceCreator,
    Workspaces
} from "@/views";

import { LocaleLayout } from "../layouts";

import { ProtectedRoute } from "./ProtectedRoute";

const PROTECTED_ROUTES = {
    withLayout: [
        { path: "home", element: <Home /> },
        { path: "preparations/*", element: <Preparations /> },
        { path: "dictionary", element: <Dictionary /> },
        { path: "workspaces", element: <Workspaces /> },
        { path: "*", element: <NotFound /> },
    ],
    withoutLayout: [
        { path: "workspace", element: <WorkspaceCreator /> },
    ],
};

const UNPROTECTED_ROUTES = [
    { path: "signin", element: <Signin /> },
    { path: "signup", element: <Signup /> },
];

export const Router = () => (
    <BrowserRouter>
        <Routes>

            {/*
                Redirections
                / → /en
            */}
            <Route
                path="/"
                element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />}
            />
            <Route
                path="/signin"
                element={<Navigate to={`/${DEFAULT_LOCALE}/signin`} replace />}
            />
            <Route
                path="/signup"
                element={<Navigate to={`/${DEFAULT_LOCALE}/signup`} replace />}
            />

            {/* /:locale */}
            <Route path=":locale" element={<LocaleLayout />}>

                {/* ---------------- PUBLIC ---------------- */}
                {UNPROTECTED_ROUTES.map(route => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                    />
                ))}

                {/* -------- PROTECTED (no layout) -------- */}
                {PROTECTED_ROUTES.withoutLayout.map(route => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <ProtectedRoute>
                                {route.element}
                            </ProtectedRoute>
                        }
                    />
                ))}

                {/* -------- PROTECTED (with layout) ------- */}
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Navigate to="home" replace />} />

                    {PROTECTED_ROUTES.withLayout.map(route => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.element}
                        />
                    ))}
                </Route>

            </Route>
        </Routes>
    </BrowserRouter>
);
