import { RefObject, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";

import { FILE_ACTION } from "@/modules/fileActions";
import { FILES } from "@/modules/files";
import { PDF_TYPE, uploadFile } from "@/modules/pdf";
import { handleServicesConcurrency, scrollToChild, URL_PARAMETERS } from "@/utils";
import { VOCABULARY } from "@/modules/vocabulary";
import { useWorkspaces } from "@/modules/workspace";

import { usePreparations } from "../../contexts";
import { patch } from "../../services";
import { diffPreparations } from "../../utils";

import { CreateButton } from "../createButton";
import { PreparationLayout, SavePreparationParams } from "../layout";
import { PreparationsFilledProps, PreparationsList } from "../list";

import "./preparationsFilled.scss";

const TABS_NAMES = {
    list: "list",
    tabs: "tabs",
} as const;
type TabsNames = typeof TABS_NAMES[keyof typeof TABS_NAMES];

const limit = handleServicesConcurrency(4);

export const PreparationsFilled = ({ preparations }: PreparationsFilledProps) => {
    const currentTarget = useRef<TabsNames>(TABS_NAMES.list);
    const listRef = useRef<HTMLDivElement>(null);
    const tabsRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    const { selectedPreparation, setSelectedPreparation } = usePreparations();
    const [searchParams, setSearchParams] = useSearchParams();
    const { currentWorkspace } = useWorkspaces();

    const scrollTo = (targetRef: RefObject<HTMLDivElement | null>, targetName: TabsNames) => {
        const viewport = viewportRef.current;
        const target = targetRef.current;
        currentTarget.current = targetName;

        if (!viewport || !target) return;
        scrollToChild(viewport, target, true);
    };

    const scrollToList = () => scrollTo(listRef, TABS_NAMES.list);
    const scrollToTabs = () => scrollTo(tabsRef, TABS_NAMES.tabs);

    const backToList = () => {
        setSearchParams(state => {
            const next = new URLSearchParams(state);

            next.delete(URL_PARAMETERS.preparationid);
            next.delete(URL_PARAMETERS.view)

            return (next);
        });
        setSelectedPreparation(undefined);
        scrollToList();
    };
    const patchPreparation = async (params: SavePreparationParams) => {
        const { old, ...updated } = params;
        const { files, title, voc: terms } = diffPreparations(old!, updated);

        const preparationId = selectedPreparation?.id;
        const workspaceId = currentWorkspace?.id;

        if (!preparationId || !workspaceId) {
            return;
        }

        if (title) {
            // Patch new title
            await patch({
                preparationId,
                title,
                workspaceId,
            });
        }
        if (terms && terms.length > 0) {
            // Patch vocabulary terms
            await VOCABULARY.postBulk({
                preparationId,
                terms,
                workspaceId,
            });
        }
        if (files) {
            if (files.movedFiles && files.movedFiles.length > 0) {
                await FILES.patchApi({
                    body: { files: files.movedFiles },
                    preparationId,
                });
            }
            if (files.newFiles && files.newFiles.length > 0) {
                await Promise.all(
                    files.newFiles.map(newFile => (
                        uploadFile({
                            contentType: PDF_TYPE.type,
                            file: newFile.pdfFile.file,
                            filePath: newFile.filePath,
                            name: newFile.pdfFile.name,
                            preparationId,
                        })
                    ))
                );
            }
            if (files.newActions && files.newActions.length > 0) {
                await Promise.all(files.newActions.map(newAction => limit(() => FILE_ACTION.post(newAction))));
            }
            if (files.patchActions && files.patchActions.length > 0) {
                await Promise.all(
                    files.patchActions.map(({ fileId, ...body }) => limit(() => FILE_ACTION.patch({ pdfFileId: fileId, body })))
                );
            }
        }
    };

    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const realignToCurrentTarget = (smooth: boolean) => {
            const target = currentTarget.current === TABS_NAMES.tabs
                ? tabsRef.current
                : listRef.current;
            if (!target) return;

            // Realign only if there is a delta
            const vp = viewport.getBoundingClientRect();
            const tg = target.getBoundingClientRect();
            const delta = tg.left - vp.left;
            if (Math.abs(delta) > 1) {
                scrollToChild(viewport, target, smooth);
            }
        };

        const observer = new ResizeObserver(() => realignToCurrentTarget(false));
        observer.observe(viewport);

        const onLayoutResized = () => realignToCurrentTarget(false);
        window.addEventListener("layout-resized", onLayoutResized);

        return () => {
            observer.disconnect();
            window.removeEventListener("layout-resized", onLayoutResized);
        };
    }, []);
    useEffect(() => {
        const path = searchParams.get(URL_PARAMETERS.preparationid);
        if (!path) return;

        setSelectedPreparation(path);
        scrollToTabs();
    }, [searchParams.toString()]);

    return (
        <div className="preparations-filled">
            <div
                className="preparations-viewport"
                ref={viewportRef}
            >
                <div
                    className="preparations-list-container"
                    ref={listRef}
                >
                    <PreparationsList
                        preparations={preparations}
                    />
                    <CreateButton />
                </div>
                <div
                    className="preparation-tabs-container"
                    ref={tabsRef}
                >
                    <PreparationLayout
                        backToList={backToList}
                        preparation={selectedPreparation}
                        savePreparation={patchPreparation}
                    />
                </div>
            </div>
        </div>
    );
};
