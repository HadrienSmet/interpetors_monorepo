import { IsArray, IsNotEmpty, IsObject, IsString } from "class-validator";

export class CreatePreparationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsArray()
    foldersStructures: Array<any>; // TODO handle validation here and not in service

    @IsObject()
    vocabulary: {
        header: Array<string>;
        list: Array<any>; // TODO improve typing
    };
}
