import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { useTheme } from "@/contexts";

export type LottieAnimationProps = {
    readonly autoplay?: boolean;
    readonly animationName: string;
    readonly loop?: boolean;
    readonly style?: React.CSSProperties;
};
export type AnimationProps = Omit<LottieAnimationProps, "animationName">;

export const LottieAnimation = ({
    autoplay = true,
    animationName,
    loop = true,
    style,
}: LottieAnimationProps) => {
    const { theme } = useTheme();

    return (
        <DotLottieReact
            autoplay={autoplay}
            loop={loop}
            src={`./animations/${animationName}`}
            style={{
                flex: 1,
                height: "100%",
                width: "100%",
                ...style,
            }}
            themeId={theme}
        />
    );
};
