import { IsString } from "class-validator";

export class CreatePdfFileDto {
    @IsString()
    actions: string;
    @IsString()
    filePath: string;
    @IsString()
    name: string;

    @IsString()
    s3Key: string;
}
