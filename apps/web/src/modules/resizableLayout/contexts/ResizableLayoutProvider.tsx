import { PropsWithChildren, useCallback, useMemo, useState } from "react";

import { ResizableLayoutContext, Section, SectionId } from "./ResizableLayoutContext";

const INVISIBLE_COLUMN_WIDTH = 40 as const;
type ResizableLayoutProviderProps =
    & {
        readonly totalAvailableWidth: number;
        readonly rightMinSpace: number;
    }
    & PropsWithChildren;
export const ResizableLayoutProvider = ({
    children,
    totalAvailableWidth,
    rightMinSpace,
}: ResizableLayoutProviderProps) => {
    const [sections, setSections] = useState<Record<SectionId, Section>>({});

    const setSectionVisibility = useCallback((id: SectionId, visible: boolean) => {
        setSections(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                visible,
            },
        }));
    }, []);
    const registerSection = useCallback((id: SectionId, initialWidth: number, minWidth: number) => {
        setSections(prev => ({
            ...prev,
            [id]: { id, width: initialWidth, minWidth, visible: true },
        }));
    }, []);

    const updateWidth = useCallback((id: SectionId, mouseX: number) => {
        setSections(prevSections => {
            const orderedSections = Object.values(prevSections);
            const index = orderedSections.findIndex(s => s.id === id);

            if (index === -1) return (prevSections);

            const section = orderedSections[index];

            const leftEdge = orderedSections
                .slice(0, index)
                .reduce((sum, sec) => sum + (sec.visible ? sec.width : INVISIBLE_COLUMN_WIDTH), 0);

            let newWidth = mouseX - leftEdge;

            newWidth = Math.max(section.minWidth, newWidth);

            const previousWidth = section.width;
            let realDelta = newWidth - previousWidth;

            let occupiedWidth = orderedSections.reduce(
                (sum, sec, i) => (sum + (i === index ? newWidth : sec.width)),
                0
            );
            const maxOccupiedWidth = totalAvailableWidth - rightMinSpace;

            if (occupiedWidth > maxOccupiedWidth) {
                let excess = occupiedWidth - maxOccupiedWidth;

                for (let i = index + 1; i < orderedSections.length; i++) {
                    const sec = orderedSections[i];
                    const reducible = sec.width - sec.minWidth;
                    const reduceBy = Math.min(reducible, excess);

                    orderedSections[i] = { ...sec, width: sec.width - reduceBy };
                    excess -= reduceBy;

                    if (excess <= 0) break;
                }

                if (excess > 0) {
                    realDelta -= excess;
                    newWidth = previousWidth + realDelta;
                }
            }

            const updatedSections = orderedSections.map((sec, i) =>
                i === index ? { ...sec, width: newWidth } : sec
            );

            return (Object.fromEntries(updatedSections.map(s => [s.id, s])));
        });
    }, [totalAvailableWidth, rightMinSpace]);

    const value = useMemo(() => ({
        rightMinSpace,
        registerSection,
        sections,
        setSectionVisibility,
        totalAvailableWidth,
        updateWidth,
    }), [sections, registerSection, updateWidth, totalAvailableWidth, rightMinSpace]);

    return (
        <ResizableLayoutContext.Provider value={value}>
            {children}
        </ResizableLayoutContext.Provider>
    );
};
