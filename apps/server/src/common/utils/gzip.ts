import { gunzipSync, gzipSync } from "zlib";

type GzipToBase64Output = { 
	readonly b64: string; 
	readonly gzBytes: number; 
	readonly rawBytes: number; 
};
export const gzipToBase64 = (inputUtf8: string): GzipToBase64Output => {
  const raw = Buffer.from(inputUtf8, "utf8");
  const nonSharedBuffer = gzipSync(raw, { level: 9 });

  return ({ b64: nonSharedBuffer.toString("base64"), gzBytes: nonSharedBuffer.length, rawBytes: raw.length });
};

export function gunzipFromBase64(b64: string): string {
  const nonSharedBuffer = Buffer.from(b64, "base64");
  const raw = gunzipSync(nonSharedBuffer);

  return (raw.toString("utf8"));
};
