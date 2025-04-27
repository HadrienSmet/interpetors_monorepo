import { AnimationProps, LottieAnimation } from "../core";

export const Loading = (props: AnimationProps) => (
    <LottieAnimation
        {...props}
        animationName="spinner.lottie"
    />
);
