import { PiSignOut } from "react-icons/pi";
import { useTranslation } from "react-i18next";

import { APP_NAME } from "@/constants";
import { Button, LocaleSelect, ThemeToggler } from "@/components";
import { useAuth } from "@/modules";
import { getUserEmail } from "@/utils";

import "./settings.scss";

export const Settings = () => {
	const { signout } = useAuth();
	const { t } = useTranslation();

	const email = getUserEmail();

	if (!email) return;

	return (
		<main className="settings">
			<p>{APP_NAME}</p>
			<div className="settings-grid">
				<div className="settings-grid__label">{t("settings.mail")}</div>
				<div className="settings-grid__value">{email}</div>

				<div className="settings-grid__label">{t("settings.theme")}</div>
				<div className="settings-grid__value">
					<ThemeToggler containerWidth={60} />
				</div>

				<div className="settings-grid__label">{t("settings.language")}</div>
				<div className="settings-grid__value">
					<LocaleSelect />
				</div>
			</div>
			<Button onClick={signout}>
				<PiSignOut />
				<span>{t("auth.signout")}</span>
			</Button>
		</main>
	);
};
