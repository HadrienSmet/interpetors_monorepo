import { useParams } from "react-router";

import { DEFAULT_LOCALE } from "@/i18n/languages";

export const useLocalePath = () => {
  const { locale } = useParams<{ locale: string }>();

  return ((path: string) => (
        `/${locale ?? DEFAULT_LOCALE}${path.startsWith("/")
            ? path
            : `/${path}`
        }`
    ));
};
