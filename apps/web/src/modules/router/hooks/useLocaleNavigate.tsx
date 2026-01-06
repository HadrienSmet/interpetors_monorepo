import { useNavigate, useParams } from "react-router";

export const useLocaleNavigate = () => {
    const navigate = useNavigate();
    const { locale } = useParams<{ locale: string }>();

    return ((to: string) => {
        const pathTo = to.startsWith("/")
            ? to : `/${to}`;
        const fullPath = `/${locale}${pathTo}`;

        navigate(fullPath);
    });
};
