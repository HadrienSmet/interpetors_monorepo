import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export class TranslateDto {
	@IsString()
	@IsNotEmpty()
	text!: string;

	@IsString()
	@IsNotEmpty()
	origin!: string; // Origin lng

	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	targets: Array<string>; // Toutes les langues vers lesquelles on souhaite traduire
}
