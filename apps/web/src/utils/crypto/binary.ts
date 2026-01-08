export type EncryptedBinary = {
    readonly iv: Uint8Array;        // 12 bytes
    readonly payload: Uint8Array;   // ciphertext
};

export const encryptBinary = async (key: CryptoKey, buffer: ArrayBuffer): Promise<EncryptedBinary> => {
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        buffer
    );

    return ({
        iv,
        payload: new Uint8Array(encrypted),
    });
};

export const decryptBinary = async (
    key: CryptoKey,
    encrypted: EncryptedBinary
): Promise<ArrayBuffer> => {
    // Copie "safe" -> ArrayBuffer garanti (TS + runtime)
    const iv = new Uint8Array(encrypted.iv);
    const payload = new Uint8Array(encrypted.payload);

    return (crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv.buffer },
        key,
        payload
    ));
};
