import { call, CallOutput, HTTP_METHODS } from "@/utils";

import { ROUTE } from "./const";

type PresignGetOneResponse = {
    readonly url: string;
};
const presignGetOne = async (key: string) => {
    const response = await call<PresignGetOneResponse>({
        method: HTTP_METHODS.GET,
        route: `${ROUTE}/presign-get?key=${key}`
    });

    return (response);
};


export const getOne = async (key: string, name: string): Promise<CallOutput<File>> => {
    const urlRes = await presignGetOne(key);

    if (!urlRes.success) {
        throw new Error(`An error occured while retrieving the file. [ERROR]: ${urlRes.message}`);
    }

    const { url } = urlRes.data;
    const pdfRes = await fetch(
        url,
        { method: HTTP_METHODS.GET }
    );

    if (!pdfRes.ok) {
        return ({
            success: false,
            message: await pdfRes.text(),
        })
    }

    const blob = await pdfRes.blob();

    const file = new File([blob], name, { type: "application/pdf" });

    return ({
        success: true,
        data: file
    })
};
