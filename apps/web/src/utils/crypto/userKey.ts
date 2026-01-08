import { toArrayBuffer } from "../binary";

import { encoder } from "./constants";

export const deriveKey = async (
    password: string,
    salt: Uint8Array
): Promise<CryptoKey> => {
    const passwordBytes = encoder.encode(password);

    const baseKey = await crypto.subtle.importKey(
        "raw",
        toArrayBuffer(passwordBytes),
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
