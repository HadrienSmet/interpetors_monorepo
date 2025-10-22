import { IsArray, ArrayNotEmpty, IsString, IsObject, IsOptional } from "class-validator";

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
    termId?: string; // si fourni: on met à jour/relie ce terme existant

    @IsOptional()
    occurrence?: {
        pdfFileId: string;
        pageIndex: number;
        text: string;
        filePath: string;
    };
}
