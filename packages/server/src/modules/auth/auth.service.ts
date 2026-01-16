import { Injectable, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { randomBytes } from "crypto";

import { sleep } from "src/common";

import { PrismaService } from "../prisma";

import { SigninDto, SignupDto, UnlockDto } from "./dto";

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
            throw new ForbiddenException("User already exists");
        }

        const cryptoSalt = randomBytes(16).toString("base64");
        const passwordHash = await argon2.hash(dto.password, {
            type: argon2.argon2id,
        });

        const user = await this.prisma.user.create({
            data: {
                cryptoSalt,
                email: dto.email,
                passwordHash,
                role: "user",
            },
        });

        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return {
            ...tokens,
            user: {
                cryptoSalt: user.cryptoSalt,
                email: user.email,
                id: user.id,
            },
        };
    }
    async signin(dto: SigninDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) {
            throw new ForbiddenException("Wrong credentials");
        }

        const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);

        if (!isPasswordValid) {
            await sleep(2000); // Prevent brut force
            throw new ForbiddenException("Wrong credentials");
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return {
            ...tokens,
            user: {
                cryptoSalt: user.cryptoSalt,
                email: user.email,
                id: user.id,
            },
        };;
    }

    async unlock(dto: UnlockDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: dto.userId }
        });

        if (!user) {
            throw new ForbiddenException("User not found");
        }

        const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);
        if (!isPasswordValid) {
            await sleep(2000); // Prevent brut force
            throw new Error("Wrong credentials");
        }

        return { isPasswordValid };
    }

    async refreshTokens(userId: string, refreshToken: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.hashedRefreshToken) {
            throw new ForbiddenException("Access denied");
        }

        const tokenMatches = await argon2.verify(
            user.hashedRefreshToken,
            refreshToken
        );

        if (!tokenMatches) {
            throw new ForbiddenException("Invalid token refresh");
        }

        const tokens = await this.generateTokens(user.id, user.email);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return {
            ...tokens,
            user: {
                cryptoSalt: user.cryptoSalt,
                email: user.email,
                id: user.id,
            },
        };
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        const hash = await argon2.hash(refreshToken, {
            memoryCost: 65536, // 64 MB
            parallelism: 1,
            timeCost: 3,
            type: argon2.argon2id,
        });

        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken: hash },
        });
    }
    async generateTokens(userId: string, email: string): Promise<SignToken> {
        const payload = { sub: userId, email };

        const [access_token, refresh_token] = await Promise.all([
            this.jwt.signAsync(payload, {
                expiresIn: "15m",
                secret: process.env.JWT_SECRET,
            }),
            this.jwt.signAsync(payload, {
                expiresIn: "7d",
                secret: process.env.JWT_REFRESH_SECRET,
            }),
        ]);

        return { access_token, refresh_token };
    }
}
