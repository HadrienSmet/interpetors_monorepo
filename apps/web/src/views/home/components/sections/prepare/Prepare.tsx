"use client"

import { useTranslation } from "@/contexts";

import "./prepare.scss";

export const Prepare = () => {
    const { t } = useTranslation();
 
    return (
        <section className="prepare">
            <h1>{t("views.prepare.title")}</h1>
			<div className="origin-language">
                <label htmlFor="origin-language">{t("views.prepare.inputs.languages")}</label>
            </div>
        </section>
    )
};
