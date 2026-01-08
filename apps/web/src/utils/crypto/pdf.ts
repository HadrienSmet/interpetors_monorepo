import { encryptBinary } from "./binary";

export const encryptPdfFile = async (file: File, key: CryptoKey): Promise<File> => {
  const buffer = await file.arrayBuffer();
  const encrypted = await encryptBinary(key, buffer);

  const payload = new Uint8Array(encrypted.payload);

  return new File([payload], file.name, { type: "application/octet-stream" });
};
