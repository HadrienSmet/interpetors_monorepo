import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsArray, ValidateNested } from "class-validator";

export class CreateColorPanelDto {
	@IsArray()
    @ValidateNested({ each: true })
    @Type(() => ColorInput)
    colors!: ColorInput[];
	@IsString() 
	@IsNotEmpty()
	name!: string;
	@IsString()
	@IsNotEmpty()
	workspaceId!: string;
}

class ColorInput {
    @IsString() 
	@IsNotEmpty()
    name!: string;

    @IsString() 
	@IsNotEmpty()
    value!: string;  // "rgb(230,0,0)"
}
