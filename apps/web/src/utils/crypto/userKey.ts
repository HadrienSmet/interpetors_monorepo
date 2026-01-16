import { encoder } from "./constants";

export const toArrayBuffer = (u8: Uint8Array): ArrayBuffer => (new Uint8Array(u8).buffer);

export const deriveKey = async (
    password: string,
    salt: Uint8Array
): Promise<CryptoKey> => {
    const passwordBytes = encoder.encode(password);

    const baseKey = await crypto.subtle.importKey(
        "raw",
        passwordBytes,
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    return (crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: toArrayBuffer(salt),
            iterations: 250_000,
            hash: "SHA-256",
        },
        baseKey,
        {
            name: "AES-GCM",
            length: 256,
        },
        false,
        ["encrypt", "decrypt"]
    ));
};
