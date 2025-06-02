import { Router } from "@/components";
import { ColorPanelsProvider, ContextMenuProvider, ThemeProvider } from "@/contexts";
import { WorkSpaceWrapper } from "@/wrappers";

import "./global.classes.scss";
import "./global.root.scss";
import "./global.tags.scss";

import "./app.scss";

export const App = () => {
    return (
        <ThemeProvider>
            <ContextMenuProvider>
                <ColorPanelsProvider>
                    <WorkSpaceWrapper>
                        <Router />
                    </WorkSpaceWrapper>
                </ColorPanelsProvider>
            </ContextMenuProvider>
        </ThemeProvider>
    );
};
