// TODO: Implement properly an ErrorScreen
type ErrorProps = {
    readonly message: string;
};
export const Error = (props: ErrorProps) => {
    return (
        <p>{props.message}</p>
    );
};
