/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { SerializableRect } from "@repo/types";

import { toSerializableRect } from "@/utils";

const EPS = 0.75; // tolérance px

const round = (n: number, p = 2) => {
	const m = Math.pow(10, p);
	
	return (Math.round(n * m) / m);
};

const sameLine = (a: SerializableRect, b: SerializableRect) => (
	Math.abs(a.top - b.top) < 2 && Math.abs(a.bottom - b.bottom) < 2
);

const overlapsOrTouches = (a: SerializableRect, b: SerializableRect) => (b.left <= a.right + EPS); // chevauche ou touche

const mergeRects = (a: SerializableRect, b: SerializableRect): SerializableRect => {
	const bottom = Math.max(a.bottom, b.bottom);
	const left = Math.min(a.left, b.left);
	const right = Math.max(a.right, b.right);
	const top = Math.min(a.top, b.top);

	return ({
		bottom,
		height: bottom - top,
		left,
		right,
		top,
		width: right - left,
		x: left,
		y: top,
	});
};

const normalizeRects = (rects: Array<SerializableRect>): Array<SerializableRect> => {
	// 1) filtre + arrondi
	const cleaned = rects
		.filter((r) => r.width > 0.5 && r.height > 0.5)
		.map((r) => ({
			left: round(r.left),
			right: round(r.right),
			top: round(r.top),
			bottom: round(r.bottom),
			width: round(r.width),
			height: round(r.height),
			x: round(r.x),
			y: round(r.y),
		}))
		.sort((a, b) => a.top - b.top || a.left - b.left);


	// 3) merge sur la même ligne si overlap/touch
	const merged: Array<SerializableRect> = [];
	for (const rect of cleaned) {
		const last = merged[merged.length - 1];
		if (last && sameLine(last, rect) && overlapsOrTouches(last, rect)) {
			merged[merged.length - 1] = mergeRects(last, rect);
		} else {
			merged.push(rect);
		}
	}

	// 4) dédup "quasi identiques" (par hash)
	const seen = new Set<string>();
	const uniq: Array<SerializableRect> = [];
	for (const rect of merged) {
		const key = `${round(rect.left, 1)}|${round(rect.top, 1)}|${round(rect.right, 1)}|${round(rect.bottom, 1)}`;
		if (seen.has(key)) continue;
		seen.add(key);
		uniq.push(rect);
	}

	return (uniq);
};

export const handleRange = (range: Range): Array<SerializableRect> => {
	const rects = range.getClientRects();
	const domRects = Array.from(rects).map(toSerializableRect);

	return (normalizeRects(domRects));
};
