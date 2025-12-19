import { useNavigate, useParams } from "react-router";

export const useLocaleNavigate = () => {
    const navigate = useNavigate();
    const { locale } = useParams<{ locale: string }>();

    return (to: string) => {
        navigate(`/${locale}${to.startsWith("/") ? to : `/${to}`}`);
    };
};
