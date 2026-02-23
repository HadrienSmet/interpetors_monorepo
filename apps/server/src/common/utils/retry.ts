import { sleep } from "./dev";

// src/common/retry.util.ts
export type RetryOptions = {
    readonly factor?: number;            // default 2
    readonly initialDelayMs?: number;    // default 100
    readonly jitter?: boolean;           // default true
    readonly maxAttempts?: number;       // default 5
    readonly maxDelayMs?: number;        // default 2000
    readonly onRetry?: (err: unknown, attempt: number, delayMs: number) => void;
};

const FACTOR = 2 as const;
const INITIAL_DELAY_MS = 100 as const;
const MAX_ATTEMPS = 5 as const;
const MAX_DELAY_MS = 2000 as const;
const RETRYABLE_CODES = [
    "P2024", // timed out fetching connection from pool
    "P1001", // can't reach database server
    "P1008", // operations timed out
    "P1009", // database is busy
    "P1017", // server closed connection
    "P2037", // too many connections
] as const;

const isRetryableError = (err: any): boolean => {
    const code = err?.code; // PrismaClientKnownRequestError etc.
    const msg = String(err?.message || "");

    // Prisma : pool/connexions/timeout
    const prismaRetryables = new Set(RETRYABLE_CODES);

    if (code && prismaRetryables.has(code)) return (true);

    // Réseau
    return (/ECONNRESET|ETIMEDOUT|EAI_AGAIN|ENETUNREACH|socket hang up/i.test(msg));
};

export const retryAsync = async <T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> => {
    const {
        maxAttempts = MAX_ATTEMPS,
        initialDelayMs = INITIAL_DELAY_MS,
        maxDelayMs = MAX_DELAY_MS,
        factor = FACTOR,
        jitter = true,
        onRetry,
    } = opts;

    let attempt = 0;
    let delay = initialDelayMs;

    while (true) {
        attempt++;
        try {
            return (await fn());
        } catch (err) {
            if (attempt >= maxAttempts || !isRetryableError(err)) {
                throw err;
            }

            const wait = jitter
                ? Math.min(maxDelayMs, Math.round(delay * (1 + Math.random())))
                : Math.min(maxDelayMs, delay);

            onRetry?.(err, attempt, wait);
            await sleep(wait);
            delay = Math.min(maxDelayMs, delay * factor);
        }
    }
};

export const retryOnP1017 = async <T>(fn: () => Promise<T>, retries = 2) => {
    let lastErr: any;
    for (let i = 0; i <= retries; i++) {
        try {
            return (await fn());
        } catch (e: any) {
            lastErr = e;
            if (e?.code !== "P1017" || i === retries) throw e;
            await new Promise(r => setTimeout(r, 200 * (i + 1)));
        }
    }
    throw lastErr;
};
