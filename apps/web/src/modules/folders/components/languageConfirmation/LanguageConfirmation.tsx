import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/hooks";
import { Button, LanguageSelect, Modal } from "@/components";
import { usePdfTools } from "@/modules/pdf";
import { useWorkspaces } from "@/modules/workspace";
import { getLocaleName } from "@/utils";

import "./languageConfirmation.scss";

export const LanguageConfirmation = () => {
	const { locale } = useLocale();
	const { languageToConfirm, setLanguageToConfirm, setLanguageToUse } = usePdfTools();
	const { t } = useTranslation();
	const { currentWorkspace } = useWorkspaces();
	
	const [selectedLanguage, setSelectedLanguage] = useState(languageToConfirm);

	const confirm = () => {
		setLanguageToUse(selectedLanguage);
		setLanguageToConfirm(undefined);
	};

	const recommandedItems: Array<string> = useMemo(() => {
		if (!currentWorkspace || !languageToConfirm) {
			return ([]);
		}
		const others = [...currentWorkspace.languages].filter(el => el === languageToConfirm);

		return ([languageToConfirm, ...others]);
	},[languageToConfirm, currentWorkspace?.languages]);

	useEffect(() => {
		setSelectedLanguage(languageToConfirm);
	}, [languageToConfirm]);

	return (
		<Modal
			isOpen={languageToConfirm !== undefined}
			onClose={() => null}
			persistant
			width="40%"
		>
			<div className="language-confirmation">
				<h3>
					{t("folders.languages.confirmation", { language: getLocaleName(languageToConfirm ?? "", locale)?.toLowerCase()})}
				</h3>
				
				<LanguageSelect
					name="vocabulary-language"
					onChange={(val) => setSelectedLanguage(val)}
					recommandedItems={recommandedItems}
					value={selectedLanguage}
				/>

				<Button onClick={confirm}>{t("actions.confirm")}</Button>
			</div>
		</Modal>
	);
};
