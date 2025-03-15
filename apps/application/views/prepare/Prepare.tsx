import { useTranslation } from "react-i18next";

import { Text } from "@/components/ui";

export const Prepare = () => {
    const { t } = useTranslation();

    return (
        <Text>{t("views.sessions.title")}</Text>
    );
};
