import { Router } from "@/components";
import { ColorPanelsProvider, ContextMenuProvider, ThemeProvider } from "@/contexts";
import { useWindowSize } from "@/hooks";
import { ResizableLayoutProvider } from "@/modules";
import { WorkSpaceWrapper } from "@/wrappers";

import "./global.classes.scss";
import "./global.root.scss";
import "./global.tags.scss";

import "./app.scss";

const RIGHT_MIN_SPACE = 705 as const;
export const App = () => {
    const { width } = useWindowSize();

    return (
        <ThemeProvider>
            <ResizableLayoutProvider
                totalAvailableWidth={width}
                rightMinSpace={RIGHT_MIN_SPACE}
            >
                <ContextMenuProvider>
                    <ColorPanelsProvider>
                        <WorkSpaceWrapper>
                            <Router />
                        </WorkSpaceWrapper>
                    </ColorPanelsProvider>
                </ContextMenuProvider>
            </ResizableLayoutProvider>
        </ThemeProvider>
    );
};
