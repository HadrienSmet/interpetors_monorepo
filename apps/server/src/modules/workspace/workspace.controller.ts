import { Controller, Post, Get, Param, Patch, Delete, Body, UseGuards, Req } from "@nestjs/common";

import { JwtAuthGuard } from "src/common";

import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto, UpdateWorkspaceDto } from "./dto";

@Controller("workspaces")
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
    constructor(private workspaceService: WorkspaceService) { }

    @Post()
    create(@Body() dto: CreateWorkspaceDto, @Req() req: any) {
        return this.workspaceService.create(req.user.sub, dto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.workspaceService.findAll(req.user.sub);
    }

    @Get(":id")
    findOne(@Param("id") id: string, @Req() req: any) {
        return this.workspaceService.findOne(req.user.sub, id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() dto: UpdateWorkspaceDto) {
        return this.workspaceService.update(id, dto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.workspaceService.remove(id);
    }
}
