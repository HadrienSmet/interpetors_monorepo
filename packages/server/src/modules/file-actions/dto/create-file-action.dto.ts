import { IsInt, IsJSON, IsOptional, Min } from "class-validator";

export class CreateFileActionDto {
    @IsInt()
    @Min(0)
    pageIndex: number;

    @IsJSON()
    elementsJson: string;

    @IsOptional()
    @IsJSON()
    referencesJson?: string;

    @IsOptional()
    @IsJSON()
    generatedResourcesJson?: string;
}
