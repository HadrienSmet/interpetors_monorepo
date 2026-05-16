import { useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import { NavigationButton } from "./button";
import { NAVIGATION } from "./navigation.types";
import "./navigation.scss";

type NavigationProps = { readonly displayNested?: boolean; };

export const Navigation = ({ displayNested = false }: NavigationProps) => {
	const [indicatorStyle, setIndicatorStyle] = useState({
		height: 0,
		translateY: 0,
		opacity: 0,
	});

	const buttonsRef = useRef<HTMLDivElement>(null);

	const location = useLocation();

	useLayoutEffect(() => {
		const container = buttonsRef.current;
		if (!container) return;

		const updateIndicator = () => {
			const selectedButton = container.querySelector("[data-navigation-selected='true']") as HTMLButtonElement | null;

			if (!selectedButton) {
				setIndicatorStyle(prev => (prev.opacity === 0 ? prev : { ...prev, opacity: 0 }));
				return;
			}

			const containerRect = container.getBoundingClientRect();
			const buttonRect = selectedButton.getBoundingClientRect();

			const nextStyle = {
				height: buttonRect.height,
				translateY: buttonRect.top - containerRect.top,
				opacity: 1,
			};

			setIndicatorStyle(prev => {
				if (
					prev.height === nextStyle.height &&
					prev.translateY === nextStyle.translateY &&
					prev.opacity === nextStyle.opacity
				) {
					return (prev);
				}

				return (nextStyle);
			});
		};

		updateIndicator();

		const resizeObserver = new ResizeObserver(() => {
			updateIndicator();
		});

		resizeObserver.observe(container);
		window.addEventListener("resize", updateIndicator);

		return () => {
			resizeObserver.disconnect();
			window.removeEventListener("resize", updateIndicator);
		};
	}, [location.pathname, displayNested]);

	return (
		<div className="navigation navigation-padding">
			<div
				className="navigation-buttons"
				ref={buttonsRef}
			>
				<div
					className="navigation-indicator"
					style={{
						height: `${indicatorStyle.height}px`,
						transform: `translateY(${indicatorStyle.translateY}px)`,
						opacity: indicatorStyle.opacity,
					}}
				/>

				{Object.keys(NAVIGATION).map(key => {
					const current = NAVIGATION[key as keyof typeof NAVIGATION];

					return (
						<NavigationButton
							{...current}
							displayNested={displayNested}
							key={current.id}
						/>
					);
				})}
			</div>
		</div>
	);
};
