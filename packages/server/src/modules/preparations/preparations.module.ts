import { Module } from "@nestjs/common";

import { PrismaService } from "../prisma";

import { PreparationsController } from "./preparations.controller";
import { PreparationsService } from "./preparations.service";

@Module({
  controllers: [PreparationsController],
  providers: [PreparationsService, PrismaService],
})
export class PreparationsModule {}
