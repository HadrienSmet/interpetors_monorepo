import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { Request } from "express";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor() {
        const options: StrategyOptionsWithRequest = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET ?? "",
            passReqToCallback: true,
        };

        super(options);
    }

    validate(req: Request, payload: any) {
        const refreshToken = req.headers.authorization?.split(" ")[1];
        if (!refreshToken) {
            console.warn("Missing refresh token in header");
        }


        return {
            ...payload,
            refreshToken,
        };
    }
}
