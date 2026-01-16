import { decryptBinary, encryptBinary } from "./binary";

export const encryptPdfFile = async (file: File, key: CryptoKey): Promise<File> => {
    const buffer = await file.arrayBuffer();
    const { iv, payload } = await encryptBinary(key, buffer);

    const packed = new Uint8Array(iv.byteLength + payload.byteLength);
    packed.set(iv, 0);
    packed.set(payload, iv.byteLength);

    return new File([packed], `${file.name}.enc`, { type: "application/octet-stream" });
};

export const decryptPdfFile = async (file: File, key: CryptoKey): Promise<File> => {
    const packed = new Uint8Array(await file.arrayBuffer());

    const iv = packed.slice(0, 12);
    const payload = packed.slice(12);

    const decrypted = await decryptBinary(key, { iv, payload });

    return new File([decrypted], file.name.replace(/\.enc$/, ""), { type: "application/pdf" });
};
