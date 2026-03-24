import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from "class-validator";

export class TranslateDto {
	@IsString()
	@IsNotEmpty()
	text!: string;

	@IsString()
	@IsNotEmpty()
	origin!: string;

	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	targets: Array<string>;
}
