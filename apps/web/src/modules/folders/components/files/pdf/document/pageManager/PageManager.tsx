import { RefObject, useEffect, useRef, useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

import { usePdfFile } from "../../../../../contexts";

import "./pageManager.scss";

const OFFSET = 60;
const TIME = 3000;
const useVisibilityToggleOnMouseMove = (
    containerRef: RefObject<HTMLDivElement | null>,
) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (event: MouseEvent) => {
            const { top } = container.getBoundingClientRect();
            const mouseY = event.clientY;

            // Check if mouse is within top X pixels
            if (mouseY - top <= OFFSET) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            // Reset timer
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setIsVisible(false);
            }, TIME);
        };

        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [containerRef]);

    return (isVisible);
};

export const PageManager = () => {
    const {
        nextPage,
        numPages,
        pageIndex,
        pageRef,
        previousPage,
    } = usePdfFile();

    const isVisible = useVisibilityToggleOnMouseMove(pageRef);

    return (
        <div className={`page-manager ${isVisible ? "visible" : ""}`}>
            <button onClick={previousPage}>
                <MdArrowBack />
            </button>
            <p>
                {`${pageIndex} / ${numPages}`}
            </p>
            <button onClick={nextPage}>
                <MdArrowForward />
            </button>
        </div>
    );
};
