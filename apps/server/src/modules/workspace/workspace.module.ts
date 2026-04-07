import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma";
import { TranslateModule } from "../translate";

import { WorkspaceService } from "./workspace.service";
import { WorkspaceController } from "./workspace.controller";

@Module({
  imports: [PrismaModule, TranslateModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
