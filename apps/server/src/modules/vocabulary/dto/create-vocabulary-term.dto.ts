import { Transform, Type } from "class-transformer";
import { IsArray, ArrayNotEmpty, IsString, IsObject, IsOptional, ValidateNested } from "class-validator";

class OccurrenceDto {
    @IsString()
    pdfFileId!: string;

    @IsString()
    filePath!: string;

    @IsArray()
    @IsOptional()
    pageIndex!: number;

    @IsString()
    text!: string;
}
export class CreateVocabularyTermDto {
    @IsObject()
    colorJson: Record<string, any>;

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    translations: string[];
}

// Variante "upsert": on autorise un termId existant
export class UpsertVocabularyTermDto extends CreateVocabularyTermDto {
    @IsOptional()
    @IsString()
    id?: string; // si fourni: on met à jour/relie ce terme existant

    @IsOptional()
    @ValidateNested()
    @Type(() => OccurrenceDto)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    @Transform(({ value, obj }) => value ?? obj?.occurence ?? undefined)
    occurrence?: OccurrenceDto;
}
