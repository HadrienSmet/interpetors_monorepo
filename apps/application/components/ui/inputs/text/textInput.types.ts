type TextContentType = "emailAddress" | "password" | "newPassword" | "name" | "nickname";

export type TextInputRef = {
    readonly focus: () => void;
    readonly clear: () => void;
    readonly getValue: () => string | null;
};
export type TextInputProps = {
    readonly errorMessage: string | null;
    readonly labelKey: string;
    readonly placeholderKey: string;
    readonly textContentType: TextContentType;
    
    readonly isSecuredInput?: boolean;
    readonly onBackground?: boolean;
};
export type TextInputState = {
    value: string | null;
    isVisible: boolean;
};