const EPS = 0.75; // tolérance px

const round = (n: number, p = 2) => {
	const m = Math.pow(10, p);
	return (Math.round(n * m) / m);
};

const sameLine = (a: DOMRect, b: DOMRect) => (
	Math.abs(a.top - b.top) < 2 && Math.abs(a.bottom - b.bottom) < 2
);

const overlapsOrTouches = (a: DOMRect, b: DOMRect) => (b.left <= a.right + EPS); // chevauche ou touche

const mergeRects = (a: DOMRect, b: DOMRect): DOMRect => {
	const left = Math.min(a.left, b.left);
	const right = Math.max(a.right, b.right);
	const top = Math.min(a.top, b.top);
	const bottom = Math.max(a.bottom, b.bottom);

	return ({
		x: left,
		y: top,
		left,
		top,
		right,
		bottom,
		width: right - left,
		height: bottom - top,
		toJSON: () => ({}),
	}) as unknown as DOMRect;
};

const normalizeRects = (rects: DOMRect[]): DOMRect[] => {
	// 1) filtre + arrondi
	const cleaned = rects
		.filter((r) => r.width > 0.5 && r.height > 0.5)
		.map((r) => ({
			...r,
			left: round(r.left),
			right: round(r.right),
			top: round(r.top),
			bottom: round(r.bottom),
			width: round(r.width),
			height: round(r.height),
			x: round(r.x),
			y: round(r.y),
		}) as unknown as DOMRect)
		.sort((a, b) => a.top - b.top || a.left - b.left);


	// 3) merge sur la même ligne si overlap/touch
	const merged: DOMRect[] = [];
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
	const uniq: DOMRect[] = [];
	for (const rect of merged) {
		const key = `${round(rect.left, 1)}|${round(rect.top, 1)}|${round(rect.right, 1)}|${round(rect.bottom, 1)}`;
		if (seen.has(key)) continue;
		seen.add(key);
		uniq.push(rect);
	}

	return (uniq);
};

export const handleRange = (range: Range) => {
	const rects = range.getClientRects();
	const domRects = Array.from(rects);

	return (normalizeRects(domRects));
};
