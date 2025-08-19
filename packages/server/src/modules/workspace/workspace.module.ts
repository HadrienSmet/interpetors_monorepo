import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma";

import { WorkspaceService } from "./workspace.service";
import { WorkspaceController } from "./workspace.controller";

@Module({
  imports: [PrismaModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
