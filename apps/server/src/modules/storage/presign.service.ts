import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import * as crypto from "crypto";

@Injectable()
export class PresignService {
    private readonly bucket = process.env.S3_BUCKET!;
    private readonly s3 = new S3Client({
        region: process.env.S3_REGION,
        // endpoint: process.env.S3_ENDPOINT,
        endpoint: `https://s3.${process.env.S3_REGION}.scw.cloud`,
        forcePathStyle: true,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY!,
            secretAccessKey: process.env.S3_SECRET_KEY!,
        },
    });

    async presignPutPdf(opts: {
        fileName: string;
        contentType: string;  // "application/pdf"
        tenantId: string;     // ton workspaceId par ex.
        ttlSeconds?: number;  // 60–300s
    }) {
        const ext = (opts.fileName.split(".").pop() || "pdf").toLowerCase();
        const key = [
            "pdf",
            new Date().toISOString().slice(0, 10),
            opts.tenantId,
            crypto.randomUUID() + "." + ext,
        ].join("/");

        const cmd = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: opts.contentType,
            // ACL par défaut: private
        });

        const url = await getSignedUrl(this.s3, cmd, { expiresIn: opts.ttlSeconds ?? 120 });
        return {
            url,
            key,
            headers: { "Content-Type": opts.contentType },
            s3Uri: `s3://${this.bucket}/${key}`,
        };
    }

    async presignGet(opts: { key: string; ttlSeconds?: number; }) {
        const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: opts.key });
        const url = await getSignedUrl(this.s3, cmd, { expiresIn: opts.ttlSeconds ?? 120 });

        return { url };
    }
}
