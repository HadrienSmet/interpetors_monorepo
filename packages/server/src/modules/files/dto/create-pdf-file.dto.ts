import { IsString } from "class-validator";

export class CreatePdfFileDto {
    @IsString()
    name: string;

    @IsString()
    filePath: string; // ex: s3://bucket/...
}
