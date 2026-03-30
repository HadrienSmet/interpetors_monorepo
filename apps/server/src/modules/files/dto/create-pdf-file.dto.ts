import { IsOptional, IsString } from "class-validator";

export class CreatePdfFileDto {
	@IsString()
	filePath: string;
	@IsString()
	@IsOptional()
	language?: string;
	@IsString()
	name: string;
	@IsString()
	s3Key: string;
}
