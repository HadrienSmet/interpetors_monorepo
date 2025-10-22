import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

export class VocabularyListItemDto {
    // couleur: on garde tel quel en JSON
    color: any;

    occurence: {
        filePath: string;     // ex: "test_folder/mocked_subject.pdf"
        pageIndex: number;
        text: string;
    };

    @IsArray()
    translations: string[];
}

export class VocabularyDto {
    @IsArray()
    languages: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VocabularyListItemDto)
    list: VocabularyListItemDto[];
}

export type FileLike =
    | Buffer
    | { data: number[]; }                 // cas Buffer sérialisé via JSON
    | { type: "Buffer"; data: number[]; } // cas standard JSON.stringify(Buffer)
    | string;                            // ex base64

export class FrontPdfFile {
    actions?: Record<string, any>; // { "1": { elements: [], generatedResources?, references? }, ... }
    file: FileLike;                // ⚠️ sera un Buffer côté front (ou base64)
    name: string;
}

export type FolderStructure = {
    // soit sous-dossier => FolderStructure
    // soit fichier pdf => FrontPdfFile
    [name: string]: FolderStructure | FrontPdfFile;
};

export class CreatePreparationDto {
    @IsString()
    title: string;
}
