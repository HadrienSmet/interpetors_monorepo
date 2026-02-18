export const safeBuffer = (bytes: Uint8Array) => bytes.buffer instanceof ArrayBuffer
	? bytes.buffer.slice(
		bytes.byteOffset,
		bytes.byteOffset + bytes.byteLength
	)
	: new Uint8Array(bytes).buffer;
