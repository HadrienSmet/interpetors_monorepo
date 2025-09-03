import { IsString, IsNotEmpty, IsObject } from "class-validator";

export class CreateColorPanelDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsObject()
    colors: Record<string, string>; // exemple : { "Important": "#FF0000" }
}
