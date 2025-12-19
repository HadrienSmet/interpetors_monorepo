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

import { ProtectedRoute } from "./ProtectedRoute";
import { LocaleLayout } from "./LocaleLayout";

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

            {/* / → /en */}
            <Route
                path="/"
                element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />}
            />

            {/* /:locale/* */}
            <Route path=":locale" element={<LocaleLayout />}>

                {/* Unprotected */}
                {UNPROTECTED_ROUTES.map(route => (
                    <Route key={route.path} {...route} />
                ))}

                {/* Without layout */}
                {PROTECTED_ROUTES.withoutLayout.map(route => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={route.element}
                    />
                ))}

                {/* With layout */}
                <Route element={<Layout />}>
                    <Route index element={<Navigate to="home" replace />} />
                    {PROTECTED_ROUTES.withLayout.map(route => (
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
                </Route>

            </Route>
        </Routes>
    </BrowserRouter>
);
