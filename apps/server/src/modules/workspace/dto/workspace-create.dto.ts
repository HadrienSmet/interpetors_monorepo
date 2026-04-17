import { IsNotEmpty, IsArray, IsString, IsOptional } from "class-validator";

export class CreateWorkspaceDto {
	@IsOptional()
	@IsString()
	colorPanelId: string;
    @IsArray()
    languages: Array<string>;
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    nativeLanguage: string;
}
