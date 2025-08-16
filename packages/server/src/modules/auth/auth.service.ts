import { Injectable, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../prisma";

import { SigninDto, SignupDto } from "./dto";

type SignToken = {
    readonly access_token: string;
    readonly refresh_token: string;
};

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) { }

    async signup(dto: SignupDto) {
        const alreadyExists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (alreadyExists) {
            throw new ForbiddenException("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
            },
        });

        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }

    async signin(dto: SigninDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new ForbiddenException("Wrong credentials");
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid) {
            throw new ForbiddenException("Wrong credentials");
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.hashedRefreshToken) {
            throw new ForbiddenException('Accès refusé');
        }

        const tokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

        if (!tokenMatches) {
            throw new ForbiddenException('Refresh token invalide');
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hash = await bcrypt.hash(refreshToken, 10);

        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken: hash },
        });
    }

    async generateTokens(userId: string, email: string): Promise<SignToken> {
        const payload = { sub: userId, email };

        const [access_token, refresh_token] = await Promise.all([
            this.jwt.signAsync(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: "15m",
            }),
            this.jwt.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: "7d",
            }),
        ]);

        return { access_token, refresh_token };
    }
}
