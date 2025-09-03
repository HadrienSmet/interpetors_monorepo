/** Color indexed */
export type ColorPanelType = {
    readonly colors: Record<string, string>;
    readonly id: string;
    readonly name: string;
};
export type CreateColorPanelParams =
    & Omit<ColorPanelType, "id" | "name">
    & { readonly name?: string | undefined; };

export type PatchColorPanelParams = Partial<CreateColorPanelParams>;
/** Id indexed */
export type ColorPanels = Record<string, ColorPanelType>;
