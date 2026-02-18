import { SerializableRect } from "@repo/types";

export const toSerializableRect = (r: DOMRect | DOMRectReadOnly): SerializableRect => ({
	bottom: r.bottom,
	height: r.height,
	left: r.left,
	right: r.right,
	top: r.top,
	width: r.width,
	x: r.x,
	y: r.y,
});
