export type AuthTokens = {
    readonly access_token: string;
    readonly refresh_token: string;
    readonly user: {
        readonly cryptoSalt: string;
        readonly email: string;
        readonly id: string;
    };
};
