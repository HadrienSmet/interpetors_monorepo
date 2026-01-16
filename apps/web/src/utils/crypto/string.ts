import { encoder, decoder } from "./constants";
import { EncryptedResource } from "./types";


export const encryptString = async (
    key: CryptoKey,
    value: string
): Promise<EncryptedResource> => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = encoder.encode(value);

    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key,
        encoded
    );

    return ({
        iv: Array.from(iv),
        payload: Array.from(new Uint8Array(encrypted)),
    });
};

export const decryptString = async (
    key: CryptoKey,
    encrypted: EncryptedResource
): Promise<string> => {
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: new Uint8Array(encrypted.iv),
        },
        key,
        new Uint8Array(encrypted.payload).buffer
    );

    return (decoder.decode(decrypted));
};
