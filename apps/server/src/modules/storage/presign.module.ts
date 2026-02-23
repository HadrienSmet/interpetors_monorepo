import { Module } from "@nestjs/common";

import { PresignController } from "./presign.controller";
import { PresignService } from "./presign.service";

@Module({
    controllers: [PresignController],
    providers: [PresignService],
    exports: [PresignService],
})
export class PresignModule { }
