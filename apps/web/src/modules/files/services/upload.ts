import { CallOutput, HTTP_METHODS } from "@/utils";

import { presignPostFile, PresignPostFileOutput, PresignPostFileParams } from "./postS3";

export type UploadParams =
    & PresignPostFileParams
    & { readonly file: File; };

export const upload = async (params: UploadParams): Promise<CallOutput<PresignPostFileOutput>> => {
    const { file, ...rest } = params;

    const presignedUrlRes = await presignPostFile(rest);
    if (!presignedUrlRes.success) {
        throw new Error(`An error occured while retrieving url to S3 bucket. ERROR: ${presignedUrlRes.message}`);
    }

    const { headers, url } = presignedUrlRes.data;

    const pdfRes = await fetch(
        url,
        {
            method: HTTP_METHODS.PUT,
            headers,
            body: file,
        }
    );

    if (pdfRes.ok) {
        return ({
            success: true,
            data: presignedUrlRes.data,
        });
    }

    return ({
        success: false,
        message: await pdfRes.text(),
    });
};
