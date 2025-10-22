import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { UpsertVocabularyTermDto } from "./create-vocabulary-term.dto";

export class UpsertVocabularyBulkDto {
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => UpsertVocabularyTermDto)
    terms!: UpsertVocabularyTermDto[];
}
