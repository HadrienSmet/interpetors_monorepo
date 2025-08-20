import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { Layout } from "@/layout";
import { Dictionary, Home, NotFound, Preparations, Prepare, Signin, Signup, WorkSpaceCreator, Workspaces } from "@/views";

import { ProtectedRoute } from "./ProtectedRoute";

const PROTECTED_ROUTES = {
    withLayout: [
        {
            path: "home",
            element: <Home />,
        },
        {
            path: "prepare/*",
            element: <Prepare />,
        },
        {
            path: "preparations",
            element: <Preparations />,
        },
        {
            path: "dictionary",
            element: <Dictionary />,
        },
        {
            path: "workspaces",
            element: <Workspaces />,
        },
        {
            path: "*",
            element: <NotFound />,
        },
    ],
    withoutLayout: [
        {
            path: "workspace",
            element: <WorkSpaceCreator />,
        },
    ],
};
const UNPROTECTED_ROUTES = [
    {
        path: "signin",
        element: <Signin />
    },
    {
        path: "signup",
        element: <Signup />
    },
];
export const Router = () => (
    <BrowserRouter>
        <Routes>
            {UNPROTECTED_ROUTES.map(route => (
                <Route key={route.path} {...route} />
            ))}
            {PROTECTED_ROUTES.withoutLayout.map(route => (
                <Route
                    element={
                        <ProtectedRoute>
                            {route.element}
                        </ProtectedRoute>
                    }
                    key={route.path}
                    path={route.path}
                />
            ))}
            <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/home" replace />} />
                {PROTECTED_ROUTES.withLayout.map(route => (
                    <Route
                        element={
                            <ProtectedRoute>
                                {route.element}
                            </ProtectedRoute>
                        }
                        key={route.path}
                        path={route.path}
                    />
                ))}
            </Route>
        </Routes>
    </BrowserRouter>
);
