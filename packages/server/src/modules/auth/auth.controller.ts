import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";

import { RefreshTokenGuard } from "src/common";

import { AuthService } from "./auth.service";
import { SigninDto, SignupDto } from "./dto";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post("refresh")
        @UseGuards(RefreshTokenGuard)
        refreshTokens(@Req() req: any) {
        const userId = req.user.sub;
        const refreshToken = req.user.refreshToken;

        return this.authService.refreshTokens(userId, refreshToken);
    }

    @Post("signup")
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    @Post("signin")
    signin(@Body() dto: SigninDto) {
        return this.authService.signin(dto);
    }
}
