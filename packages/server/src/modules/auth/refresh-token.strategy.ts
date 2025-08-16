import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { Request } from "express";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor() {
        const options: StrategyOptionsWithRequest = {
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.refresh_token, // ou header/body selon ton choix
            ]),
            secretOrKey: process.env.JWT_REFRESH_SECRET ?? "",
            passReqToCallback: true,
        };

        super(options);
    }

    validate(req: Request, payload: any) {
        const refreshToken = req.cookies?.refresh_token;

        return {
            ...payload,
            refreshToken,
        };
    }
}
