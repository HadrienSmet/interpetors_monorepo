export const toArrayBuffer = (u8: Uint8Array): ArrayBuffer => (new Uint8Array(u8).buffer);
export const base64ToUint8Array = (base64: string): Uint8Array => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return (bytes);
};
