export const utf8ToBytes = (s: string) => new TextEncoder().encode(s);
export const bytesToBase64 = (bytes: Uint8Array): string => {
	let binary = "";
	const chunkSize = 0x8000;

	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	}
	
	return (btoa(binary));
};
export const base64ToBytes = (b64: string): Uint8Array => {
	const bin = atob(b64);
	const output = new Uint8Array(bin.length);

	for (let i = 0; i < bin.length; i++) output[i] = bin.charCodeAt(i);

	return (output);
};
