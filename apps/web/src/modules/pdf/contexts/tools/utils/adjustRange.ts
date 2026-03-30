type TextSegment = {
	readonly end: number;
	readonly node: Text;
	readonly start: number;
};

type TextIndex = {
	readonly segments: Array<TextSegment>;
	readonly text: string;
};

const normalizeSourceText = (value: string) => (value.replace(/\u00A0/g, " "));

export const buildTextIndex = (root: HTMLElement): TextIndex => {
	const walker = document.createTreeWalker(
		root,
		NodeFilter.SHOW_TEXT,
		{
			acceptNode: (node) => {
				const text = normalizeSourceText(node.textContent ?? "");
				return (
					text.length > 0
					? NodeFilter.FILTER_ACCEPT
					: NodeFilter.FILTER_REJECT
				);
			},
		},
	);

	const segments: Array<TextSegment> = [];
	let text = "";
	let current: Node | null = walker.nextNode();

	while (current) {
		const node = current as Text;
		const value = normalizeSourceText(node.textContent ?? "");
		const start = text.length;
		text += value;
		const end = text.length;

		segments.push({ node, start, end });
		current = walker.nextNode();
	}

	return ({ text, segments });
};

const getGlobalOffset = (
	segments: Array<TextSegment>,
	container: Node,
	offset: number,
): number | null => {
	if (container.nodeType === Node.TEXT_NODE) {
		const segment = segments.find((seg) => seg.node === container);
		if (!segment) return (null);

		return (segment.start + offset);
	}

	for (const segment of segments) {
		if (container.contains(segment.node)) return (segment.start);
	}

	return (null);
};

type DomPoint = 
	| { 
		readonly node: Text; 
		readonly offset: number; 
	} 
	| null;
const getDomPointFromGlobalOffset = (
	segments: Array<TextSegment>,
	globalOffset: number,
	isEnd = false,
): DomPoint => {
	for (const segment of segments) {
		if (globalOffset < segment.end) {
			return ({
				node: segment.node,
				offset: Math.max(0, globalOffset - segment.start),
			});
		}

		if (globalOffset === segment.end && isEnd) {
			return ({
				node: segment.node,
				offset: segment.end - segment.start,
			});
		}
	}

	const last = segments[segments.length - 1];
	if (!last) {
		return (null);
	}

	return ({
		node: last.node,
		offset: last.end - last.start,
	});
};

type TotalRange = { 
	readonly start: number; 
	readonly end: number; 
};
export const rangeToGlobalOffsets = (
	range: Range,
	segments: Array<TextSegment>,
): TotalRange | null => {
	const start = getGlobalOffset(
		segments,
		range.startContainer,
		range.startOffset,
	);
	const end = getGlobalOffset(
		segments,
		range.endContainer,
		range.endOffset,
	);

	if (start === null || end === null || end < start) {
		return (null);
	}

	return ({ start, end });
};

export const globalOffsetsToRange = (
	segments: Array<TextSegment>,
	start: number,
	end: number,
): Range | null => {
	const startPoint = getDomPointFromGlobalOffset(segments, start, false);
	const endPoint = getDomPointFromGlobalOffset(segments, end, true);

	if (!startPoint || !endPoint) {
		return (null);
	}

	const range = document.createRange();
	range.setStart(startPoint.node, startPoint.offset);
	range.setEnd(endPoint.node, endPoint.offset);

	return (range);
};

const findOccurrences = (source: string, target: string) => {
	const matches: Array<TotalRange> = [];
	let fromIndex = 0;

	while (fromIndex <= source.length) {
		const index = source.indexOf(target, fromIndex);
		if (index === -1) {
			break;
		}

		matches.push({
			start: index,
			end: index + target.length,
		});

		fromIndex = index + 1;
	}

	return (matches);
};

export const adjustedRange = (
	pageRoot: HTMLElement,
	baseRange: Range,
	nextText: string,
): Range | null => {
	const candidate = normalizeSourceText(nextText);

	if (!candidate.trim()) {
		return (null);
	}

	const index = buildTextIndex(pageRoot);
	const baseOffsets = rangeToGlobalOffsets(baseRange, index.segments);

	if (!baseOffsets) {
		return (null);
	}

	const occurrences = findOccurrences(index.text, candidate);

	if (occurrences.length === 0) {
		return (null);
	}

	// On impose que la nouvelle plage chevauche la sélection d’origine.
	// Ça empêche de “sauter” vers une autre occurrence identique ailleurs.
	const overlapping = occurrences.filter(({ start, end }) => (
		Math.max(start, baseOffsets.start) < Math.min(end, baseOffsets.end)
	));

	if (overlapping.length === 0) {
		return (null);
	}

	// On prend la plage la plus proche de la sélection d’origine.
	const best = overlapping.sort((a, b) => {
		const deltaA = Math.abs(a.start - baseOffsets.start) + Math.abs(a.end - baseOffsets.end);
		const deltaB = Math.abs(b.start - baseOffsets.start) + Math.abs(b.end - baseOffsets.end);

		return (deltaA - deltaB);
	})[0];

	return (globalOffsetsToRange(index.segments, best.start, best.end));
};
