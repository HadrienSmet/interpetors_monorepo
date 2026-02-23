import { PartialType } from "@nestjs/mapped-types";

import { CreateWorkspaceDto } from "./workspace-create.dto";

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}
