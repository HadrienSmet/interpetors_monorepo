export const safeJsonParse = <T>(value: string): T => {
    try {
        return (JSON.parse(value)) as T;
    } catch {
        throw new Error("Invalid encrypted JSON payload");
    }
};
