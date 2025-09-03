import { Router } from "@/components";
import { ContextMenuProvider, ThemeProvider } from "@/contexts";
import { useWindowSize } from "@/hooks";
import { AuthProvider, ColorPanelWrapper, ResizableLayoutProvider } from "@/modules";

import "./global.classes.scss";
import "./global.root.scss";
import "./global.tags.scss";

import "./app.scss";

const RIGHT_MIN_SPACE = 705 as const;
export const App = () => {
    const { width } = useWindowSize();

    return (
        <ThemeProvider>
            <AuthProvider>
                <ResizableLayoutProvider
                    totalAvailableWidth={width}
                    rightMinSpace={RIGHT_MIN_SPACE}
                >
                    <ContextMenuProvider>
                        <ColorPanelWrapper>
                            <Router />
                        </ColorPanelWrapper>
                    </ContextMenuProvider>
                </ResizableLayoutProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};
