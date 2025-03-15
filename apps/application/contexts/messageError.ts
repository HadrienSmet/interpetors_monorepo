export const getContextError = (contextName: string, providerName: string) => (
    `CONTEXT ERROR: Wrong order of call ${contextName}, ${providerName} not init yet.`
);
