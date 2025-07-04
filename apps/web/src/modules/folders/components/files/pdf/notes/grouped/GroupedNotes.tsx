import { useEffect, useRef, useState } from "react";
import { MdComment } from "react-icons/md";
import { Trans } from "react-i18next";

import { sleep } from "@/utils";

import { usePdfNotes } from "../../../../../contexts";
import { PdfNote } from "../../../../../types";

import { PdfCustomNote } from "../customNote";

import "./groupedNotes.scss";

const ANIMATION_DURATION = 350 as const;
const COMPONENT_STATE = {
    default: "default",
    focus: "focus",
    expanded: "expanded",
} as const;
type ComponentState = keyof typeof COMPONENT_STATE;

type GroupedNotesProps = {
    readonly group: Array<PdfNote>;
    readonly y: number;
};
export const GroupedNotes = ({ group, y }: GroupedNotesProps) => {
    const [previousState, setPreviousState] = useState<ComponentState | null>(null);
    const [state, setState] = useState<ComponentState>(COMPONENT_STATE.default);

    const containerRef = useRef<HTMLDivElement>(null);

    const { selectedNote } = usePdfNotes();

    const handleClass = (state: ComponentState) => {
        const classPrefix = "notes-poc--";
        const classesToRemove = Object.keys(COMPONENT_STATE).filter(elem => elem !== state);

        for (const classToRemove of classesToRemove) {
            containerRef.current?.classList.remove(classPrefix + classToRemove);
        }
        containerRef.current?.classList.add(classPrefix + state);
    };
    const handleClick = () => {
        setPreviousState(state);
        if (state === COMPONENT_STATE.expanded) {
            setState(COMPONENT_STATE.focus);
            handleClass(COMPONENT_STATE.focus);
        }
        else {
            containerRef.current?.classList.add("switch-shadow");
            setState(COMPONENT_STATE.expanded);
            handleClass(COMPONENT_STATE.expanded);
        }
    };
    const handleMouseEnter = () => {
        if (state === COMPONENT_STATE.default) {
            setPreviousState(state);
            setState(COMPONENT_STATE.focus);
            handleClass(COMPONENT_STATE.focus);
        }
    };
    const handleMouseLeave = () => {
        if (state === COMPONENT_STATE.focus) {
            setPreviousState(state);
            setState(COMPONENT_STATE.default);
            handleClass(COMPONENT_STATE.default);
            containerRef.current?.classList.remove("switch-shadow");
        }
    };

    useEffect(() => {
        let timeoutId: number;
        if (previousState === COMPONENT_STATE.default) {
            timeoutId = setTimeout(() => {
                containerRef.current?.classList.add("switch-shadow");
            }, ANIMATION_DURATION);
        }

        return () => {
            clearTimeout(timeoutId);
        }
    }, [previousState]);
    useEffect(() => {
        const handleNoteSelection = async () => {
            setState("focus");
            handleClass("focus");

            await sleep(ANIMATION_DURATION);

            containerRef.current?.classList.add("switch-shadow");

            await sleep(50);

            setState("expanded");
            handleClass("expanded");
        }
        if (y === selectedNote?.y) {
            handleNoteSelection();
        }
    }, [selectedNote, y])
    useEffect(() => {
        const handleClickOutside = async (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (
                state === COMPONENT_STATE.default ||
                !containerRef.current ||
                containerRef.current.contains(target) ||
                target.closest("[data-ignore-outside-click]")
            ) return;

            setState(COMPONENT_STATE.focus);
            handleClass(COMPONENT_STATE.focus);

            await sleep(ANIMATION_DURATION);

            setState(COMPONENT_STATE.default);
            handleClass(COMPONENT_STATE.default);
            containerRef.current?.classList.remove("switch-shadow");
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [state]);

    return (
        <div
            className={`notes-poc notes-poc--default`}
            ref={containerRef}
            style={{ top: y - 4 }}
        >
            <button
                className="notes-poc__trigger"
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="notes-poc__content">
                    <div className="notes-poc__circle-content">
                        <span className="notes-poc__count">{group.length}</span>
                        <MdComment className="notes-poc__icon" />
                    </div>

                    <div className="notes-poc__header-content">
                        <Trans
                            components={{
                                default: <span />,
                                strong: <strong />
                            }}
                            i18nKey="notes.groupHeader"
                            values={{ count: group.length }}
                        />
                    </div>
                </div>
            </button>

            <div className="notes-poc__expanded-content">
                <div className="notes-poc__notes-list">
                    {group.map(note => (
                        <PdfCustomNote
                            key={note.id}
                            note={note}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
