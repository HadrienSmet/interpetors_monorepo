import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsArray, ValidateNested } from "class-validator";

export class CreateColorPanelDto {
    @IsString() 
	@IsNotEmpty()
    name!: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ColorInput)
    colors!: ColorInput[];
}

class ColorInput {
    @IsString() 
	@IsNotEmpty()
    name!: string;

    @IsString() 
	@IsNotEmpty()
    value!: string;  // "rgb(230,0,0)"
}
