import { PropsWithChildren } from "react";

import { Router } from "@/components";
import { ColorPanelsProvider, ContextMenuProvider, ThemeProvider } from "@/contexts";
import { useWindowSize } from "@/hooks";
import { AuthProvider, AuthWrapper, ResizableLayoutProvider } from "@/modules";
import { WorkSpaceWrapper } from "@/wrappers";

import "./global.classes.scss";
import "./global.root.scss";
import "./global.tags.scss";

import "./app.scss";

const RIGHT_MIN_SPACE = 705 as const;
const AuthContexts = ({ children }: PropsWithChildren) => {
    const { width } = useWindowSize();

    return (
        <ResizableLayoutProvider
            totalAvailableWidth={width}
            rightMinSpace={RIGHT_MIN_SPACE}
        >
            <ContextMenuProvider>
                <ColorPanelsProvider>
                    <WorkSpaceWrapper>
                        {children}
                    </WorkSpaceWrapper>
                </ColorPanelsProvider>
            </ContextMenuProvider>
        </ResizableLayoutProvider>
    );
};
const UnAuthWrapper = ({ children }: PropsWithChildren) => (
    <ThemeProvider>
        <AuthProvider>
            <AuthWrapper>
                {children}
            </AuthWrapper>
        </AuthProvider>
    </ThemeProvider>
);

export const App = () => (
    <UnAuthWrapper>
        <AuthContexts>
            <Router />
        </AuthContexts>
    </UnAuthWrapper>
);
