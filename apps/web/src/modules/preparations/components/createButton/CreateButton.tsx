import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import { Link } from "react-router";

import { useLocalePath } from "@/modules/router";

import "./createButton.scss";

export const CreateButton = () => {
    const localePath = useLocalePath();
    const { t } = useTranslation();

    return (
        <Link 
			className="create-preparation" 
			to={localePath("preparations/new")}
		>
			<MdAdd />
            {t("preparations.new")}
        </Link>
    );
};
