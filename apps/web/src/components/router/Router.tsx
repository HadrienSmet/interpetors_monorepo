import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Layout } from "@/layout";
import { Dictionary, NotFound, Preparations, Prepare } from "@/views";

export const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/prepare/files" replace />} />
                <Route path="prepare/*" element={<Prepare />} />
                <Route path="preparations" element={<Preparations />} />
                <Route path="dictionary" element={<Dictionary />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
