import { IsNotEmpty, IsString } from "class-validator";

export class CreatePreparationDto {
    @IsString()
    @IsNotEmpty()
    title!: string;
}
