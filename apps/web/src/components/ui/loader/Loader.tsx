import { Loading, AnimationProps } from "@/assets";

export const LoaderSizes = {
    fullScreen: 200,
    small: 80,
} as const;
export const Loader = (props: AnimationProps & { size?: keyof typeof LoaderSizes }) => {
    const style = props.size
        ? { maxWidth: LoaderSizes[props.size], ...props.style }
        : props.style;

    return (<Loading {...props} style={style} />);
};
