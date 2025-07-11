import "./loader.scss";

export const LoaderSizes = {
    fullScreen: 200,
    small: 80,
} as const;
export const Loader = ({ size = "small" }: { size?: keyof typeof LoaderSizes }) => {
    const style = { maxWidth: LoaderSizes[size] };

    return (
        <div className="loader-container">
            <div style={style} className="loader" />
        </div>
    );
};
