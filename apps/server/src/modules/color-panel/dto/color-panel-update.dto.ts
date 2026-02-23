import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";

export class UpdateColorPanelDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ColorUpdate)
    colors!: ColorUpdate[]; // Only used to update!
}

class ColorUpdate {
    @IsOptional()
    @IsString()
    id: string;

    @IsString()
    name!: string;

    @IsString()
    value!: string;
}
