import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateFolderDto {
    @IsString()
    @MinLength(1)
    name!: string;

    @IsOptional()
    @IsString()
    parentId?: string; // si fourni : le parent doit appartenir à la même preparation
}
