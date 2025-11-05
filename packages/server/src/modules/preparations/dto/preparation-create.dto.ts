import { IsString } from "class-validator";

export class CreatePreparationDto {
    @IsString()
    title: string;
}
