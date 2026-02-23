import { IsNotEmpty, IsString } from "class-validator";

class UserDto {
	@IsString()
	@IsNotEmpty()
	sub: string;
	@IsString()
	@IsNotEmpty()
	refreshToken: string;
}
export class CheckDto {
	user: UserDto;
}
