const SHADOW_COLOR = "#000";

export const Shadows = {
    small: {
        shadowColor: SHADOW_COLOR,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    medium: {
        shadowColor: SHADOW_COLOR,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 5,
    },
    large: {
        shadowColor: SHADOW_COLOR,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 7.84,
        elevation: 8,
    },
} as const;
