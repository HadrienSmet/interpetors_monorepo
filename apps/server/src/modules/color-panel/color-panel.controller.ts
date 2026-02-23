import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "src/common";

import { ColorPanelService } from "./color-panel.service";
import { CreateColorPanelDto, UpdateColorPanelDto } from "./dto";

@Controller("color-panels")
@UseGuards(JwtAuthGuard)
export class ColorPanelController {
    constructor(private readonly colorPanelService: ColorPanelService) { }

    @Post()
    create(@Req() req: any, @Body() dto: CreateColorPanelDto) {
        return this.colorPanelService.create(req.user.sub, dto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.colorPanelService.findAll(req.user.sub);
    }

    @Get(":id")
    findOne(@Req() req: any, @Param("id") id: string) {
        return this.colorPanelService.findOne(req.user.sub, id);
    }

    @Patch(":id")
    update(
        @Req() req: any,
        @Param("id") id: string,
        @Body() dto: UpdateColorPanelDto
    ) {
        return this.colorPanelService.update(req.user.sub, id, dto);
    }

    @Delete(":id")
    remove(@Req() req: any, @Param("id") id: string) {
        return this.colorPanelService.remove(req.user.sub, id);
    }
}
