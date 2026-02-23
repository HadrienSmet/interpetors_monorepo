import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";

import { ColorPanelController } from "./color-panel.controller";
import { ColorPanelService } from "./color-panel.service";

@Module({
    imports: [PrismaModule],
    controllers: [ColorPanelController],
    providers: [ColorPanelService],
})
export class ColorPanelModule { }
