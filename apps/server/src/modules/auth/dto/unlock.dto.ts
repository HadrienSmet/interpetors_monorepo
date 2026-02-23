import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class UnlockDto {
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    })
    password: string;
    // Should be taken from jwt
    @IsString()
    @IsNotEmpty()
    userId: string;
}
