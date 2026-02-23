import { Body, Controller, Post, Query, Get, UseGuards } from "@nestjs/common";

import { JwtAuthGuard, UserId } from "src/common";

import { PresignService } from "./presign.service";

class PresignPutDto {
    fileName!: string;
    contentType!: string;  // vérifie que c"est "application/pdf"
}

@Controller("uploads")
@UseGuards(JwtAuthGuard)
export class PresignController {
    constructor(private readonly presign: PresignService) { }

    @Post("presign-put-pdf")
    async presignPut(@Body() body: PresignPutDto, @UserId() userId: string) {
        if (body.contentType !== "application/pdf") {
            // tu peux être plus souple si besoin
            throw new Error("Invalid content type");
        }

        return this.presign.presignPutPdf({
            fileName: body.fileName,
            contentType: body.contentType,
            tenantId: userId,
        });
    }

    @Get("presign-get")
    async presignGet(@Query("key") key: string) {
        return this.presign.presignGet({ key });
    }
}
