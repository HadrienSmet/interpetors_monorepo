import { IsNotEmpty, IsArray, IsString } from "class-validator";

export class CreateWorkspaceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsArray()
    languages: Array<string>;

    @IsString()
    nativeLanguage: string;
}
