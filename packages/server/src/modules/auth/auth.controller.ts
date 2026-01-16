import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";

import { JwtAuthGuard, RefreshTokenGuard } from "src/common";

import { AuthService } from "./auth.service";
import { SigninDto, SignupDto, UnlockDto } from "./dto";

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
    @Post("unlock")
    unklock(@Body() dto: UnlockDto) {
        return this.authService.unlock(dto);
    }
    @Get("verify")
    @UseGuards(JwtAuthGuard)
    verify(@Req() req: any) {
        // req.user est injecté par JwtStrategy → contient { sub, email }
        return {
            userId: req.user.sub,
            email: req.user.email,
        };
    }
}
