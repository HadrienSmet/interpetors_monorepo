import { IsString } from "class-validator";

export class CreatePdfFileDto {
    @IsString()
    name: string;

    @IsString()
    s3Key: string;
}
