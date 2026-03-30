import { Type } from "class-transformer";
import { 
	IsArray, 
	IsNotEmpty, 
	IsOptional, 
	IsString,
	ValidateNested, 
} from "class-validator";

export class PatchPdfFileDto {
    @IsOptional()
    @IsString()
    filePath?: string;
	@IsOptional()
	@IsString()
	language?: string;
    @IsOptional()
    @IsString()
    name?: string;
}

class PatchedPdfFile {
    @IsOptional()
    @IsString()
    actions: string;
    @IsOptional()
    @IsString()
    filePath: string;
    @IsString()
    @IsNotEmpty()
    id: string;
	@IsOptional()
	@IsString()
	language?: string;
    @IsOptional()
    @IsString()
    name: string;
}
export class PatchPdfFilesDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PatchedPdfFile)
    files: Array<PatchedPdfFile>;
}
