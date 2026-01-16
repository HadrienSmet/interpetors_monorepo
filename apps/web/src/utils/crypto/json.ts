import { decoder, encoder } from "./constants";
import { EncryptedResource } from "./types";

export const encryptJson = async <T>(
    key: CryptoKey,
    data: T
): Promise<EncryptedResource> => {
    const encoded = encoder.encode(JSON.stringify(data));
    const iv = crypto.getRandomValues(new Uint8Array(12));


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

export const decryptJson = async <T>(
    key: CryptoKey,
    encrypted: EncryptedResource
): Promise<T> => {
    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: new Uint8Array(encrypted.iv),
        },
        key,
        new Uint8Array(encrypted.payload).buffer
    );

    return (JSON.parse(decoder.decode(decrypted)));
};
