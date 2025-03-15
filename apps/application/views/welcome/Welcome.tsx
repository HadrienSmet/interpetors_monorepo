import { useMemo, useRef } from "react";
import { Stack } from "expo-router";

import { MainLayout, MainLayoutProps } from "@/layouts";

import { Content, Header } from "./sections";

export const Welcome = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const layoutProps = useMemo((): MainLayoutProps => ({
        sections: {
            ratio: [3, 2],
            first: {
                element: (<Header emailRef={emailRef} passwordRef={passwordRef} />),
            },
            scd: {
                element: (<Content />),
            },
        },
        separatorVH: 0.07,
    }), []);

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
